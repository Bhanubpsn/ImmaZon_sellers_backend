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
    }

});

export default productSchema;