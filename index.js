import express from "express";
import cors from "cors";
import dotenv from "dotenv/config";
import mongoose from "mongoose";
import {userRouter} from './routes/userRoute.js';
import cookieParser from "cookie-parser";
import { urlRouter } from "./routes/urlRouter.js";
import {otpRouter} from './routes/otpRouter.js';
const app = express();
const PORT = process.env.PORT||5000;
const url = process.env.MONGO_DB_URL;
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true});
const con = mongoose.connection;
con.on("open",()=>console.log("MongoDb is connected"));
app.use(express.json());
//for netlify
const allowedOrigin = "https://url-shortner-front-end-ak.netlify.app" || "http://localhost:3000";
app.use(cors({credentials:true,origin:allowedOrigin}));

app.use(cookieParser());
app.get("/",(req,res)=>{
    res.send({"message":"Server is up"});
})
app.use('/user',userRouter);
app.use('/url',urlRouter);
app.use('/otp',otpRouter);
app.listen(PORT,()=>console.log(`Server started at port: ${PORT}`));