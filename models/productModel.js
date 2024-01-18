import mongoose from "mongoose";
import productSchema from "./schema/product.js";

const createProductModel = (sellerId) => {
    const collectionName = `${sellerId}`;
    const productModel = mongoose.model(collectionName, productSchema);
    return productModel;
  };
  
  export default createProductModel;
