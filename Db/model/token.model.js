//here wee follow the idea of tracking the token cause we can't destroy the token so we will follow this approach to make the token isvalid:false in the databse if you made logout and still the token not expired 
//so you can't take any action by the token cause it in the databse is not invalid cause you are log out


import mongoose, {Schema,model,Types} from 'mongoose';
export const tokenSchema= new Schema({
token:{
    type:String,
    required:true
},
user:{
    type:Types.ObjectId,
    ref:"User"
    
},
isvalid:{
    type:Boolean,
    default:true,
},
agent:{ // we need to know the name of the device that the user logged in from it
    type:String,
},
expiredAt:String,


},{timestamps:true})
 export const Token= mongoose.models.Token||model('Token',tokenSchema)