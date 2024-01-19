import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({

    productname:{
        type: String,
        required: true,
    },
    color:{
        type: [String],
        default: [],
        required: false,
    },
    size:{
        type: [Number],
        default: [],
        required: false,
    },
    price:{
        type: Number,
        required: true,
    },
    tags:{
        type: [String],
        required: true,
    },
    sellerid:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: false,
        default: "",
    }

});

export default productSchema;