import mongoose from "mongoose";
import productSchema from "./schema/product.js";

const productModel = mongoose.model('product', productSchema);
export default productModel;
