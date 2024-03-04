import  mongoose,{ Schema,model } from "mongoose";
export const userSchema= new Schema({

userName:{
    type:String,
    required:true
},
email:{
    type:String,
    unique:true,
    required:true
},
password:String,
phone:String,
gender:{
    type:String,
    enum:['male','female']
},
status:{
    type:String,
    enum:['online','offline'],
    default:"offline"
},
role:{
    type:String,
    enum:['user','admin'],
    default:"user"
},
isConfirmed:{
    type:Boolean,
    default:false
},
isLogged:{
    type:Boolean,
 default:false

},
activationCode:String,
profilePicture:{
    url:{
        type:String,
         default:"https://res.cloudinary.com/dcqxhysyg/image/upload/v1695840123/ecommercedefault/user/depositphotos_29387653-stock-photo-facebook-profile_roomkz.webp"
    },
    id:{
        type:String,
        default:"ecommercedefault/user/depositphotos_29387653-stock-photo-facebook-profile_roomkz"
    }
},
coverPicture:[{url:String,id:String}],
forgetCode:String,



},{timestamps:true})
export const User = mongoose.models.User || model("User",userSchema);