import mongoose from "mongoose";
import orderSchema from "./schema/order.js";
import connectToMongo from "../db.js";

const createOrderModel = (sellerId) => {
    const collectionName = `${sellerId}`;
    const orderModel = connectToMongo("Orders").model(collectionName, orderSchema);
    return orderModel;
};

export default createOrderModel;
