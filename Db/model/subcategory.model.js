import  mongoose,{ Schema , model , Types } from "mongoose";
export const subcategorySchema= new Schema({
    name:{
        type:String,
        min:5,
        max:20,
        required:true

    },
    slug:{
        type:String,
        required:true,
    },
    image:{
        url:{type:String,required:true},
        id:{type:String,required:true}
},
categoryId:{
    type:Types.ObjectId,
    ref:"Category",
    required:true
},
createdBy:{
    type:Types.ObjectId,
    ref:'User',
    required:true,
},
brand:[{
type:Types.ObjectId,
ref:"Brand"
}]
},{timestamps:true })

export const Subcategory=mongoose.models.Subcategory||model("Subcategory",subcategorySchema)