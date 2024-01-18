import express from 'express';
import createProductModel from '../models/productModel.js';
const router = express.Router();
import { body, validationResult } from 'express-validator';

const validateTags = (value) => {
    if (!Array.isArray(value)) {
        throw new Error('Tags must be an array');
    }

    if (!value.every(tag => typeof tag === 'string')) {
        throw new Error('Each element in tags must be a string');
    }

    // You can add additional validation rules for tags if needed

    return true;
};

// POST request to add product in sellers' collection.
router.post('/addmyproduct',[
    body('productname', 'productname length should be >5 characters ').isLength({ min: 5,}),
    body('price', 'price length should be >1 characters').isDecimal().isLength({ min: 1,}),
    body('tags', 'There should be at least one tag in the product').custom(validateTags),
],async (req,res)=>{

    let success = false;

    // Validating correct entry length.
    const erros = validationResult(req);
    if(!erros.isEmpty()){
        res.statusCode = 400;
        return res.json({success, errors: erros.array()});
    }

    try {

        //Creating a product inside the collection of the seller's id.
        let product = await createProductModel(req.header('sellerid')).create({
            productname: req.body.productname,
            price: req.body.price,
            tags: req.body.tags,
        })

        // const data = {
        //     product:{
        //         id: product.id,
        //     }
        // }

        success = true;
        res.statusCode = 200;
        res.json({success, product});

    } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.send("Some Error Occured");
    }
})

// GET request for seller to get his/her all products.
router.get('/getmyproducts',async (req,res)=>{
   
    try {
        
        let sellerId = req.query.id;
        console.log(sellerId);
        const myproducts = await createProductModel(sellerId).find();
        res.json(myproducts);

    } catch (error) {
        res.statusCode = 500;
        console.log(error);
        res.send(error);
    }
})


export default router;