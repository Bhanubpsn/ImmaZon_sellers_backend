import mongoose from "mongoose";
import orderSchema from "./schema/order.js";
const { Schema } = mongoose;


const SellerSchema = new Schema({

    shopName :{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    orders: {
        type: [orderSchema],
        default: [], 
    },
});

export default mongoose.model('seller',SellerSchema);