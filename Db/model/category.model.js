import mongoose ,{Schema,model,Types}from "mongoose";
export const categorySchema= new Schema({
name:{ // Mobile Phone
    type:String,
    required:true,
    min:4,
    max:20,
},
slug:{ /// mobile-phone
    type:String,
    required:true,
},
image:{
    url:{type:String,
    required:true},
    id:{
        type:String,
        required:true,
    }
},
createdBy:{
    type:Types.ObjectId,
    ref:"User",
    required:true,

},
brand:[{type: Types.ObjectId,
    ref:"Brand"
}]

},{timestamps:true,toJSON:{virtuals:true}, toObject:{virtuals:true}}) // here we have to write these things to be able read the virtual populate
categorySchema.virtual('subcategory',{
     ref:"Subcategory"    ,  // here we write the name of model that it has relationship with it so we write thw name of child model
     localField:"_id"   , // and here we write the id for the parents
     foreignField:"categoryId"         // and here we write what is equal the parents id in the child model so  it is the categoryId      
     
     // we use the virtual to calculate things together without saving in the database so now we need to know the all subcategories fot rhis category but without saving
     //so now we can make populate on the category but without saving this information
})  



export  const Category= mongoose.models.Category||model("Category",categorySchema)