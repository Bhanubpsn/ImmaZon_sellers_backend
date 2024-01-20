import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const mongoURI = process.env.URI;

const connectToMongo = async (databaseName = "ShopOwners") => {
    const uri = `${mongoURI}/${databaseName}`;

    //Phele disconnecting the initial connection.
    mongoose.connection.close();

    await mongoose.connect(uri).then(() => {
        console.log(`Connected to MongoDB Atlas - Database: ${databaseName}`);
    });
}

export default connectToMongo;
