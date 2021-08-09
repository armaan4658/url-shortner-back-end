import jwt from "jsonwebtoken";
import dotenv from "dotenv/config";
import Cookies from "cookies";
import cookieParser from "cookie-parser";
export const auth = (req,res,next)=>{
    try{
        const token = req.cookies;
        jwt.verify(token.jwt,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
            if(err) return res.send({"error":err});
            req.user = user;
            next();
        });
    }catch(e){
        res.status(500).send({"error":e});
    }
}