import mongoose from "mongoose";
const { Schema } = mongoose;

const orderSchema = new Schema({

    productId: {
        type : String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    sellerId: {
        type: String,
        required: true,

    },
    color:{
        type: String,
        defaultValue : "",
    },
    size:{
        type: String,
        defaultValue : "",
    },
    qantity: {
        type: Number,
        required: true,
    }
    
});

export default orderSchema;