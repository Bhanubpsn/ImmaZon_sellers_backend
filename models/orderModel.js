import mongoose from "mongoose";
import orderSchema from "./schema/order.js";

const createOrderModel = (sellerId) => {
    const collectionName = `${sellerId}`;
    const orderModel = mongoose.model(collectionName, orderSchema);
    return orderModel;
};

export default createOrderModel;
