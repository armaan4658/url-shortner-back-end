import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv/config" ;
import nodemailer from "nodemailer";
import {User} from '../models/user.js';
import {Otp} from '../models/otp.js';
//signing up
export const signUp = async(req,res)=>{
    const {email,firstName,lastName,password} = req.body;
    try{
        const isUser = await User.findOne({email});
        if(!isUser){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            const user = new User({
                email,
                firstName,
                lastName,
                password:hashedPassword,
            })
            const otp = Math.floor(1000 + Math.random()*9000);
            const verify = new Otp({
                email,
                otp
            })
            //saving to database
            const savedUser = await user.save();
            //saving otp in db
            await verify.save();
            const sub="Confirmation e-mail";
            const link = await bcrypt.genSalt(4);
            const href=`http://localhost:3000/verifyaccount/${savedUser._id}`;
            const message = `<b>Your one time password is : ${otp}</b><br/>
            Click the link below to verify your account<br/>
            <a href=${href}>${link} </a>`
            //sending confirmation email
            sendEmail(email,sub,message);
            res.status(200).send({"message":"green"});
        }else{
            res.send({"message":"Account already exist"});
        }
    }catch(e){
        res.status(400).send({error:e});
    }
}


//Logging in
export const logIn = async(req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(user){
            if(user.status=="inactive"){
                res.send({"message":"Your account has not been verified"});
            }
            const inDbPassword = user.password;
            const isPassword = await bcrypt.compare(password,inDbPassword);
            if(isPassword){
                const sign = {id:email}
                const accessToken = jwt.sign(sign,process.env.ACCESS_TOKEN_SECRET);
                res.cookie("jwt", `${accessToken}`, {
                    expires: new Date(Date.now() + (60000*60)),
                    path: "/",
                    httpOnly: true,
                    secure: true,
                    sameSite: "None",
                  });
                res.send({"message":"green","_id":user._id});
            }else{
                res.send({"message":"Unauthorized user"});
            }
        }else{
            res.send({"message":"Invalid credentials"})
        }
    }catch(e){
        res.send({"error":e});
    }
}

//logout
export const logOut = async(req,res) => {
    try{
        res.clearCookie('jwt');
        res.send({"message":"green"});
    }catch(e){
        res.send({"error":e})
    }
}

//getting user data
export const getUserData = async(req,res)=>{
    try{
        const {id} = req.params;
        const data = await User.findById(id);
        res.send({"email":data.email,"firstName":data.firstName,"lastName":data.lastName,"_id":data._id});
    }catch(e){
        res.send({"error":e});
    }
}


//user update
export const userUpdate = async(req,res)=>{
    try{
        const {id} = req.params;
        const {email,
            firstName,
            lastName,
            password,
            status} = req.body;
        const user = await User.findById(id);
        if(email){
            user.email = email;
        }
        if(firstName){
            user.firstName = firstName;
        }
        if(lastName){
            user.lastName = lastName;
        }
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            user.password = hashedPassword;
        }
        if(status){
            user.status = status;
        }
        await user.save();
        res.send({"message":"green",...user});
    }catch(e){
        res.send({"error":e});
    }
}


//otp check
export const otpVerification = async(req,res) =>{
    const {otp,email} = req.body;
    try{
        const verify = await Otp.findOne({email});
        if(otp==verify.otp){
            const user = await User.findOne({email});
            user.status="active";
            await user.save();
            res.send({"message":"green"})
        }else{
            res.send({"message":"OTP entered is incorrect"})
        }
    }catch(e){
        res.send({"error":e});
    }
}


//sending email
const sendEmail = async(hospitalEmail,sub,message) => {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
  });
  // send mail with defined transport object
  let info = {
    from: `"Test Maan" <${process.env.EMAIL}>`, // sender address
    to: `${hospitalEmail}`, // list of receivers
    subject: `${sub}`,  // plain text body
    html: `${message} ` // html body
  };
   transporter.sendMail(info,(err,data)=>{
      if(err){
          console.log(err);
      }else{
          console.log(`Email sent to : ${hospitalEmail}`);
      }
  })

}

//sending password reset link
export const passwordResetLink = async(req,res)=>{
    try{
        const {email} = req.params;
        const user = await User.findOne({email})
        if(user){
            const salt = await bcrypt.genSalt(3);
            const sub ="Password reset";
            const href=`http://localhost:3000/passwordreset/${user._id}`;
            const message = `<b>Click the link below to reset your password : </b><br/>
            <a href=${href}>${salt} </a>`;
            //sending e-mail
            sendEmail(user.email,sub,message);
            res.send({"message":"green"});
        }else{
            res.send({"message":"incorrect email"});
        }
    }catch(e){
        res.send({"error":e});
    }
}