import {Otp} from '../models/otp.js';

export const getData = async(req,res) => {
    try{
        const otp = await Otp.find();
        res.send(otp);
    }catch(e){
        res.status(402).send(e);
    }
}

export const deleteData = async(req,res) => {
    try{
        const {id} = req.params;
        const otp = await Otp.findByIdAndDelete(id,(err,data)=>{
            err ? res.status(402).send(err) : res.send({"message":"green"});
        })
    }catch(e){
        res.status(402).send(e);
    }
}
