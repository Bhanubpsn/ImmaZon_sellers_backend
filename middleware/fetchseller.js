import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const fetchseller = (req,res,next)=>{
    //Get seller from jwt token and add id to req obj
    const token = req.header('authtoken');
    if(!token){
        res.status = 401;
        res.send({
            sucess: false,
            error: "Can't Find the Seller."
        });
    }
    const data = jwt.verify(token,JWT_SECRET);
    req.user = data.user;
    next();
}


export default fetchseller;
