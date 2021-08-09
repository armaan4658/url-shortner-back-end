import {Url} from '../models/url.js';

//adding url
export const addUrl = async(req,res) => {
    const {userId,url} = req.body;
    try{
        const isUrl = await Url.findOne({$and:[{userId},{url}]});
        // const isUrl = await Url.findOne({url});
        if(!isUrl){
            const newUrl = new Url({
                userId,
                url
            })
            await newUrl.save();
            res.send({"message":"green"});
        }else{
            res.send({"message":"URL already exist"});
        }
    }catch(e){
        res.send({"error":e});
    }
}

//getting url
export const getUrl = async(req,res) => {
    const {userId} = req.params;
    try{
        const isUser = await Url.find({userId});
        if(isUser){
            res.send(isUser);
        }else{
            res.send({"message":"something went wrong"});
        }
    }catch(e){
        res.send({"error":e});
    }
}

//deleting url
export const deleteUrl = async(req,res) =>{
    const {id} = req.params;
    try{
        const url = await Url.findById(id);
        await url.remove();
        res.send({"message":"green"});
    }catch(e){
        res.send({"error":e});
    }
}