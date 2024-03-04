import {asyncHandler} from'../../utilis/asynchandler.js';
import bcryptjs from'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../../Db/model/user.model.js';
import crypto from 'crypto'; // it is buildin and it makes unique random letters for user
import { sendEmail } from '../../utilis/sendEmails.js';
import {signUpTemp,sendCodeTemp} from '../../utilis/generateHtml.js';
import {Token} from'../../../Db/model/token.model.js';
import randomstring from 'randomstring';
import { Cart } from '../../../Db/model/cart.model.js';

export const register=  asyncHandler(async(req,res,next)=>{
    //data from request
const {userName,email,password}=req.body;
//check user is exicst but this step not necessary cause already we put in the user model the email must be unique
const isUser=await User.findOne({email})
if(isUser){
    return next(new Error('user already registered',{cause:409}));
}
//hash password
const hashpassword= bcryptjs.hashSync(password,parseInt(process.env.SALT_ROUND))
// generate activationcode
// it means that we will creat  unique random letters for the user or we can creat token by email
const activationCode= crypto.randomBytes(64).toString('hex');

//create user
const user = await User.create({userName,email,password:hashpassword,activationCode});

//create confirmationlink
const link=`http://localhost:4000/user/confirmEmail/${activationCode}`;
console.log(activationCode);

//sendEmail
 const isSend=await sendEmail({to:email,subject:"ActivateAccount",html:signUpTemp(link)});
 //send response
return isSend ? res.json({success:true ,message:'please review your mail'}) :next (new Error("email is invalid"));
});

///////////////////////////////////////////////////////
//activate code
export const ActivateAccount=asyncHandler(async(req,res,next)=>{
    //find user, delete activationCode, update isConfirmed
const user = await User.findOneAndUpdate({activationCode: req.params.activationCode},{isConfirmed:true, $unset:{activationCode:1}})
//check if the user doesn't exist
if(!user)return next (new Error('user is not found!!',{cause:404}));
//create a cart

await Cart.create({user:user._id})


// send response 
return res.send("congratulations your acount now is active")
});


/////////////////////login
export const Login= asyncHandler(async(req,res,next)=>{
//data from body
const {email,password}=req.body;
//check if the email is exist
const user = await User.findOne({email})
if(!user){
    return next(new Error("invalid email",{cause:400}))
}
// chech if the is confirmed=true
if(!user.isConfirmed){
    return next (new Error('you are not confirmed'))
}
//check paassword
 const comparepass= bcryptjs.compareSync(password,user.password)
if(!comparepass){
    return next (new Error("invalid password!"))
}
// generate token
const token = jwt.sign({id:user._id,email:user.email},process.env.TOKEN_KEY);

///////save token in  token model 
 const model= await Token.create({token,user:user._id,agent:req.headers['user-agent']});

//change user status and islogged

user.isLogged=true
user.status="online"
await user.save();
return res.json({success:true,message:"user logged in succefully",results:token})

})

// send forget password code
export const sendFrogetCode=asyncHandler(async(req,res,next)=>{
//check email exisctence
const user = await User.findOne({email:req.body.email})

if(!user){
    return next(new Error("invalid email"))
}
// generate code
const code= randomstring.generate({
    length:5,
    charset:"numeric"
});
// save code in db to compare it when the user enter the code to cmake sure he is the real user
user.forgetCode=code
await user.save();

// send this code across the email
 return await sendEmail({to:user.email,subject:"confirmation code",html:sendCodeTemp(code)}) ? res.json({sccuss:true,message:"check your email"})
 : next (new Error('invalid email'))

})
   ////////////// reset new password
   export const resetPassword= asyncHandler(async(req,res,next)=>{

// check user 
let user = await User.findOne({forgetCode:req.body.forgetCode});

if(!user) return next (new Error('invalid code'))

user = await User.findOneAndUpdate({email:req.body.email},{$unset:{forgetCode:1} })

user.password= bcryptjs.hashSync(req.body.password,parseInt(process.env.SALT_ROUND));
await user.save();

//invalidate token cause we need after changing password the email logg out from the all devices
 const tokens=  await Token.find({user:user._id});
 tokens.forEach(async(token)=>{
    token.isvalid=false
   await token.save();
   return res.json({success:true,message:"try to login again"})
 })

   })