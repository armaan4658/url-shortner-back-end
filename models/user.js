import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        default: "inactive"
    },
})
export const User = mongoose.model("User",userSchema);