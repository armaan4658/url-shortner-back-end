import express from "express";
import {getData,deleteData} from '../modules/otpModule.js';
export const otpRouter = express.Router();

otpRouter.get('/get',getData);

otpRouter.delete('/delete/:id',deleteData);