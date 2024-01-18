import express from "express";
import cors from "cors";
import connectToMongo from './db.js'
import authRoute from "./routes/auth.js"
import productRoute from "./routes/product.js"
import dotenv from 'dotenv';
dotenv.config();


connectToMongo();

const app = express();
const port = process.env.port || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoute)
app.use('/api/products', productRoute)

// app.get('/', (req, res) => {
//     res.send("Hello Mum!")
// })

app.listen(port,()=>{
    console.log(`Listening on http://localhost:${port}`);
})
