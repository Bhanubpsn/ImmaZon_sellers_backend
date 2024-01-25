import express from 'express';
import seller from '../models/seller.js';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();


import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fetchseller from '../middleware/fetchseller.js';
import SellerSchema from '../models/seller.js';
import connectToMongo from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET_KEY;
let sellerId;

// POST request for a seller to sign up to Immazon
router.post('/createseller',[
    body('email', 'Email length should be 5 to 30 characters').isEmail().isLength({ min: 5, max: 30 }),
    body('shopName', 'ShopName length should be 1 to 20 characters').isLength({ min: 1, max: 20 }),
    body('password', 'Password length should be 5 to 10 characters').isLength({ min: 5, max: 10 })
],async (req,res)=>{
    const ordersDbConnection = connectToMongo("ShopOwners");
    let success = false;
    
    // Validating correct entry length.
    const erros = validationResult(req);
    if(!erros.isEmpty()){
        res.statusCode = 400;
        return res.json({success, errors: erros.array()});
    }

    try{

        // Checking if seller already exists.
        let user = await ordersDbConnection.model('sellers',SellerSchema).findOne({email: req.body.email});
        if(user){
            res.statusCode = 400;
            return res.json({success, error: "An email exists already"});
        }

        // Generating salt for hashing the password.
        const salt = await bcrypt.genSalt(10);

        // Hashing the pasword.
        const secPass = await bcrypt.hash(req.body.password,salt);
        
        // Creating a new user with new attributes in MongoDB.
        // Orders is optional and its default value is [].
        user = await seller.create({
            shopName: req.body.shopName,
            password: secPass,
            email: req.body.email,
        })
        console.log(user.id);
        // Creating a new data with user and its id.
        const data = {
            user:{
                id: user.id,
            }
        }

        // Generating its authtoken. Unique to every seller/user.
        const authtoken = jwt.sign(data, JWT_SECRET);
        const sellerid = user.id;

        // res.json(user);
        success = true;
        // Returing authtoken as response.
        res.statusCode = 200;
        res.json({success, authtoken, sellerid});

    }catch(err){
        console.log(err);
        res.statusCode = 500;
        res.send("Some Error Occured");
    }
    

});


// POST request to login an exsisting seller.
router.post('/login',[
    body('email', 'Email length should be 5 to 30 characters').isEmail().isLength({ min: 5, max: 30 }),
    body('password', 'Password can\'t be blank').exists(),
],async (req,res)=>{
    let success = false;
    const ordersDbConnection = connectToMongo("ShopOwners");
    // Validating the entries entered by the seller.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.statusCode = 400;
        res.json({success, errors: errors.array()});
    }

    // Destructuring email and password from request
    const { email, password } = req.body;

    try {
        // Checking if the seller dies exisits in the database.
        let user = await ordersDbConnection.model('sellers',SellerSchema).findOne({ email });
        if (!user) {
            res.statusCode = 400;
            return res.json({success, errors: "Please enter valid credentials."});            
        }

        // validating password
        const isCorrectPassword = await bcrypt.compare(password, user.password);

        if (!isCorrectPassword) {
            res.statusCode = 400;
            return res.json({success, errors: "Please enter valid credentials"});
        }

        const data = {
            user:{
                id: user.id,
            }
        }

        // Generating JWT token
        const authtoken = jwt.sign(data, JWT_SECRET);
        console.log(user.id);
        const sellerid = user.id;
        success = true;
        res.json({success, authtoken, sellerid});

    } catch (error) {
        // console.log(err);
        res.statusCode = 500;
        res.json({
            success: false,
            error: error
        });
    }


})


// GET request to get the seller data.
router.get('/getseller',fetchseller,async (req,res)=>{
    // USing the middleware fetchseller we find out that the seller is authentic or not. Once verified we then head towards next operation that is fetching its attributes (but not the password).
    const ordersDbConnection = connectToMongo("ShopOwners");
    try {
        sellerId  = req.user.id;
        console.log(sellerId);
        const user = await ordersDbConnection.model('sellers',SellerSchema).findById(sellerId).select("-password");
        res.send(user);
    } catch (error) {
        // console.log(error);
        res.statusCode = 500;
        res.json({
            success :false,
            error: error,
        });
    }

})


export default router;