import express from 'express';
import createProductModel from '../models/productModel.js';
const router = express.Router();
import { body, validationResult } from 'express-validator';


// POST request to add product in sellers' collection.
router.post('/addmyproduct',[
    body('productname', 'productname length should be >5 characters ').isLength({ min: 5,}),
    body('price', 'price length should be >1 characters').isDecimal().isLength({ min: 1,}),
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


export default router;