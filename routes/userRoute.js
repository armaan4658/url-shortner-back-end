import express from "express";
import {User} from '../models/user.js';
export const userRouter = express.Router();
import {
    signUp,logIn,
    getUserData,userUpdate,
    otpVerification,passwordResetLink,
    logOut
} from "../modules/userModule.js"

//sign up
userRouter.post('/signup',signUp);

//login
userRouter.post('/login',logIn);

//logout
userRouter.get('/logout',logOut);

//getting user data
userRouter.get('/get/:id',getUserData);

//updating user
userRouter.patch('/update/:id',userUpdate);

//otp verification
userRouter.patch('/verification',otpVerification);

//password reset link
userRouter.get('/passwordReset/:email',passwordResetLink);