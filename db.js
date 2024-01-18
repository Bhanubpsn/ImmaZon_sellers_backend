import mongoose from "mongoose";

const mongoURI = "mongodb+srv://bhanunegi:immazonproject@e-commerce.npdkq1r.mongodb.net/ShopOwners"; 

const connectToMongo = async()=>{
    await mongoose.connect(mongoURI).then(()=>{
        console.log("Connected to MongoDB Atlas");
    })
}

export default connectToMongo;