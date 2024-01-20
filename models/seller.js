import mongoose from "mongoose";
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
});

export default mongoose.model('seller',SellerSchema);