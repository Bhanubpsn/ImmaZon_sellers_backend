import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const mongoURI = process.env.URI

const connectToMongo = async()=>{
    await mongoose.connect(mongoURI).then(()=>{
        console.log("Connected to MongoDB Atlas");
    })
}

export default connectToMongo;