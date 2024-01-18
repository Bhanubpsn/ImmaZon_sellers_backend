import mongoose from "mongoose";
import productSchema from "./product.js";
const { Schema } = mongoose;

const orderSchema = new Schema({

    product: {
        type : productSchema,
        required: true,
    },
    userAddress: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    userContect: {
        type: String,
        required: true,
    }
    
});

export default orderSchema;