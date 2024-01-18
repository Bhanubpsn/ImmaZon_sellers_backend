import mongoose from "mongoose";
import orderSchema from "./schema/order.js";

const orderModel = mongoose.model('order', orderSchema); 
export default orderModel;
