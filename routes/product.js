import express from 'express';
import createProductModel from '../models/productModel.js';
const router = express.Router();
import { body, validationResult } from 'express-validator';
import fetchseller from '../middleware/fetchseller.js';

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
            sellerid: req.header('sellerid'),
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
router.get('/getmyproducts/:id',async (req,res)=>{
   
    // Ye do tarike se krr skta tha me
    // 1 being this way, by using parameters.
    // 2nd being the way using query parameters. <-- I like this one more.


    try {
        
        let sellerId = req.params.id;
        console.log(sellerId);
        const myproducts = await createProductModel(sellerId).find();
        res.json(myproducts);

    } catch (error) {
        res.statusCode = 500;
        console.log(error);
        res.send(error);
    }
})

// PUT request for seller to update his/her products.
router.put('/updatemyproduct/:id',fetchseller,async (req,res)=>{

    // Destructuring the parameters tht ll be given in the request.
    const {productName, productPrice, productTags} = req.body;

    // First loading the product to be updated.
    let updatedProduct = await createProductModel(req.user.id).findById(req.params.id);

    if (!updatedProduct) {
        res.statusCode = 404;
        res.send('404 Product not found');
    }
    if (updatedProduct.sellerid !== req.user.id) {
        res.statusCode = 401;
        res.send('Invalid Product');
    }

    if (productName) {
        updatedProduct.productname = productName;
    }
    if (productPrice) {
        updatedProduct.price = productPrice;
    }
    if (productTags) {
        updatedProduct.tags = productTags;
        console.log(updatedProduct.tags);
    }

    await createProductModel(req.user.id).findByIdAndUpdate(req.params.id,{$set: updatedProduct},{new: false});

    res.json({updatedProduct});


})


export default router;