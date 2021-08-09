import express from "express";
import {auth} from '../middleware/auth.js';
import {addUrl,getUrl,deleteUrl} from '../modules/urlModule.js';
export const urlRouter = express.Router();

//adding url
urlRouter.post('/add',auth,addUrl);

//getting url
urlRouter.get('/get/:userId',auth,getUrl);

//deleting url
urlRouter.delete('/delete/:id',auth,deleteUrl);