import express from 'express';
import createProductModel from '../models/productModel.js';
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import multer from "multer";
const router = express.Router();
import { body, validationResult } from 'express-validator';
import fetchseller from '../middleware/fetchseller.js';
import config from '../config/firebaseconfig.js';

//Initialize a firebase application.
initializeApp(config.firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

// this is a custom validation function. Pretty cool right? ;) <-- wink
const validateTags = (value) => {
    if (!Array.isArray(value)) {
        throw new Error('Tags must be an array');
    }

    if (!value.every(tag => typeof tag === 'string')) {
        throw new Error('Each element in tags must be a string');
    }

    // You can add additional validation rules for tags if needed.

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
   
    // Ye teen tarike se krr skta tha me
    // 1 being this way, by using parameters.
    // 2nd being the way using query parameters. <-- I like this one more. seems coool.
    // 3rd by using seller id as the body parameter thru middlemare <-- Ye sabse safest method hai.


    try {
        
        let sellerId = req.params.id;
        console.log(sellerId);
        const productModel = createProductModel(sellerId);
        const myproducts = await productModel.find();
        res.json(myproducts);

    } catch (error) {
        res.statusCode = 500;
        console.log(error);
        res.send(error);
    }
})

// DELETE request for seller to delete his/her products.
router.delete('/deletemyproduct/:id',fetchseller,async (req,res)=>{

    //Find the product to be deleted in the seller's collection.
    let tobeDeletedProduct = await createProductModel(req.user.id).findById(req.params.id);

    if (!tobeDeletedProduct) {
        res.statusCode = 404;
        res.send("404 Product not found :(");
    }

    if (tobeDeletedProduct.sellerid !== req.user.id) {
        res.statusCode = 401;
        res.send("This product dosn't seems to be yours *_*");
    }

    await createProductModel(req.user.id).findByIdAndDelete(req.params.id);
    res.send("The product has been deleted :)");

})

// POST route to upload image of the image.
router.post("/uploadproductimage/:sellerid/:productid", upload.single("image"), async (req, res) => {
    //This image is the key name in the post body.

    try {

        if (!req.file) {
            return res.status(400).send({ message: 'No file uploaded.' });
        }

        //Collection Reference jaise flutter me bnate hai and file name add krr diya.
        const storageRef = ref(storage, `${req.params.sellerid}/${req.params.productid}`);

        // Create file metadata including the content type
        const metadata = {
            contentType: req.file.mimetype,
        };

        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

        // Grab the public url
        const downloadURL = await getDownloadURL(snapshot.ref);

        console.log('File successfully uploaded.');
        return res.status(200).json({
            message: 'file uploaded to firebase storage',
            name: req.file.originalname,
            downloadURL: downloadURL
        })
    } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(400).send(error.message)
    }
});

// PUT request for seller to update his/her products.
router.put('/updatemyproduct/:id',fetchseller,async (req,res)=>{

    // Destructuring the parameters tht ll be given in the request.
    const {productName, productPrice, productTags} = req.body;

    // First loading the product to be updated.
    let updatedProduct = await createProductModel(req.user.id).findById(req.params.id);

    if (!updatedProduct) {
        res.statusCode = 404;
        res.send('404 Product not found :(');
    }
    if (updatedProduct.sellerid !== req.user.id) {
        res.statusCode = 401;
        res.send("This product dosn't seems to be yours *_*");
    }

    if (productName) {
        updatedProduct.productname = productName;
    }
    if (productPrice) {
        updatedProduct.price = productPrice;
    }
    if (productTags) {
        updatedProduct.tags = productTags;
    }
    if (req.query.imageurl) {
        const lastSlashIndex = req.query.imageurl.lastIndexOf("/");
        const updatedImageUrl = req.query.imageurl.substring(0, lastSlashIndex) + "%2F" + req.query.imageurl.substring(lastSlashIndex + 1);
        updatedProduct.image = `${(updatedImageUrl)}&token=${(req.query.token)}`;
    }

    await createProductModel(req.user.id).findByIdAndUpdate(req.params.id,{$set: updatedProduct},{new: false});

    res.json({updatedProduct});

})

export default router;