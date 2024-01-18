import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({

    id:{
        type: String,
        required: true,
    },
    color:{
        type: String,
        required: false,
    },
    size:{
        type: Number,
        required: false,
    },
    price:{
        type: Number,
        required: true,
    }

});

export default productSchema;