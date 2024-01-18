import express from "express";
import cors from "cors";
import connectToMongo from './db.js'
import authRoute from "./routes/auth.js"

connectToMongo();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoute)

// app.get('/', (req, res) => {
//     res.send("Hello Mum!")
// })

app.listen(port,()=>{
    console.log(`Listening on http://localhost:${port}`);
})
