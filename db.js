import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const mongoURI = process.env.URI;

const connectToMongo = (databaseName = "ShopOwners") => {
    const uri = `${mongoURI}/${databaseName}`;
    console.log(`Connected to ${databaseName}`)
    return mongoose.createConnection(uri);
}

export default connectToMongo;
