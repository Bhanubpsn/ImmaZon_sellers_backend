import mongoose from "mongoose";

const changedb= async (databaseName = "ShopOwners")=>{
    mongoose.connection.useDb(databaseName);
    console.log(`Connected to MongoDB Atlas - ${databaseName}`);
}

export default changedb;