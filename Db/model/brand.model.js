
import mongoose,{Schema,Types,model} from "mongoose";
export const brandSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
    image:{
        url:{
            type:String,
            required:true,
        },
        id:{
            type:String,
            required:true
        }
    },
    createdBy:{
        type:Types.ObjectId,
        ref:"User"
    },

},{timestamps:true})
export const Brand= mongoose.models.Brand||model("Brand",brandSchema)