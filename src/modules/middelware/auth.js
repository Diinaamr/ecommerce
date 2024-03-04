import {asyncHandler} from '../../utilis/asynchandler.js'
import jwt from 'jsonwebtoken';
import {Token} from '../../../Db/model/token.model.js'
import {User} from '../../../Db/model/user.model.js'
export const isAuthenticated= asyncHandler(async(req,res,next)=>{
let{token}=req.headers;
if(!token||!token.startsWith(process.env.BEARER_KEY)) return next(new Error('invalid token'))

//check payload
 token =token.split(process.env.BEARER_KEY)[1]
const decoded= jwt.verify(token,process.env.TOKEN_KEY)
if(!decoded) return next(new Error("invalid token"))

//check token in db
const tokenDb= await Token.findOne({token,isvalid:true})

if(!tokenDb) return next(new Error('token expired'))
 //check user existence 
const user = await User.findOne({email:decoded.email})
if(!user) return next (new Error('user is not found'))
req.user=user;
return next()
})