import express, { response } from 'express';
const router = express.Router();
import mongoose from "mongoose";
import createOrderModel from '../models/orderModel.js';


// GET request to get a sellers all pending orders.
router.get('/getmyorders/:id',async(req,res)=>{
    // Again ye me 3 tarike se kar skata hu. I ll choose the simplest method, (without using auth-middleware) kyuki abhi just project simplicity pr dhyan dera hu aage will secure it.

    try{
        const sellerId = req.params.id;
        console.log(sellerId);
        // const orderModel = createOrderModel(sellerId);
        // const myOrders = await orderModel.find();
        // res.json(myOrders);

        const collection = mongoose.connection.collection(sellerId);
        const allData = await collection.find({}).toArray();

        res.json(allData);

    }catch (error) {
        res.statusCode = 500;
        console.log(error);
        res.send(error);
    }
})

export default router;
