import express from "express";
import cors from "cors";
import connectToMongo from './db.js'
import authRoute from "./routes/auth.js"
import productRoute from "./routes/product.js"
import ordersRoute from "./routes/orders.js"
import dotenv from 'dotenv';
dotenv.config();

// Connecting to database 'ShopOwners'.By defalut.
// connectToMongo();

const app = express();
const port = process.env.port || 5000;

const defaultDbConnection = connectToMongo();

app.use(cors());
app.use(express.json());


app.use('/api/auth',async (req, res, next) => {
    const ordersDbConnection = connectToMongo("ShopOwners");
    req.ordersDbConnection = ordersDbConnection;
    next();
});

app.use('/api/auth', authRoute);

app.use('/api/products',async (req, res, next) => {
    const ordersDbConnection = connectToMongo("ShopOwners");
    req.ordersDbConnection = ordersDbConnection;
    next();
});
app.use('/api/products', productRoute);

// Connecting to database 'Orders'.
app.use('/api/orders',async (req, res, next) => {
    const ordersDbConnection = connectToMongo("Orders");
    req.ordersDbConnection = ordersDbConnection;
    next();
});

// Handling /api/orders route
app.use('/api/orders', ordersRoute);

// app.get('/', (req, res) => {
//     res.send("Hello Mum!")
// })

app.listen(port,()=>{
    console.log(`Listening on http://localhost:${port}`);
})
