import express from 'express';
import seller from '../models/seller.js';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();


import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = process.env.JWT_SECRET_KEY;

// POST request for a seller to sign up to Immazon
router.post('/createseller',[
    body('email', 'Email length should be 5 to 30 characters').isEmail().isLength({ min: 5, max: 30 }),
    body('shopName', 'ShopName length should be 1 to 20 characters').isLength({ min: 1, max: 20 }),
    body('password', 'Password length should be 5 to 10 characters').isLength({ min: 5, max: 10 })
],async (req,res)=>{

    let success = false;
    
    // Validating correct entry length.
    const erros = validationResult(req);
    if(!erros.isEmpty()){
        res.statusCode = 400;
        return res.json({success, errors: erros.array()});
    }

    try{

        // Checking if seller already exists.
        let user = await seller.findOne({email: req.body.email});
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
        
        // Creating a new data with user and its id.
        const data = {
            user:{
                id: user.id,
            }
        }

        // Generating its authtoken. Unique to every seller/user.
        const authtoken = jwt.sign(data, JWT_SECRET);
        console.log(authtoken);

        // res.json(user);
        success = true;
        // Returing authtoken as response.
        res.statusCode = 200;
        res.json({success, authtoken});

    }catch(err){
        console.log(err);
        res.statusCode = 500;
        res.send("Some Error Occured");
    }
    

});

export default router;
