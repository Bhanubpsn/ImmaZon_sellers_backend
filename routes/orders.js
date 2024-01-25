import express, { response } from 'express';
const router = express.Router();
import mongoose from "mongoose";
import createOrderModel from '../models/orderModel.js';

import connectToMongo from '../db.js';
import orderSchema from '../models/schema/order.js';


// GET request to get a sellers all pending orders.
router.get('/getmyorders/:id',async(req,res)=>{
    // Again ye me 3 tarike se kar skata hu. I ll choose the simplest method, (without using auth-middleware) kyuki abhi just project simplicity pr dhyan dera hu aage will secure it.
    const ordersDbConnection = connectToMongo("Orders");
    try{
        const sellerId = req.params.id;
        console.log(sellerId);
        
        const orders = ordersDbConnection.model(sellerId , orderSchema);
        const myOrders = await orders.find({});
        res.json(myOrders);

        // const orderModel = createOrderModel(sellerId);
        // const myOrders = await orderModel.find();
        // const myOrders = await orderModel.find();
        // res.json(myOrders);

        // const Order = ordersDbConnection.collection(sellerId);
        // const myOrders = await Order.find({}).toArray();
        // res.json(myOrders);

        


    }catch (error) {
        res.statusCode = 500;
        console.log(error);
        res.send(error);
    }
})

export default router;
