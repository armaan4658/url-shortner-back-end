import mongoose from "mongoose";
import shortid from "shortid";
const urlSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    shortUrl:{
        type: String,
        required: true,
        default: shortid.generate
    },
})
export const Url = mongoose.model("Url",urlSchema);