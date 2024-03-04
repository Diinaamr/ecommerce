import { asyncHandler } from "../../utilis/asynchandler.js";
import {Subcategory} from '../../../Db/model/subcategory.model.js'
import { User } from "../../../Db/model/user.model.js";
import slugify from "slugify";
import cloudinary from "../../utilis/cloud.js";
import {Category} from '../../../Db/model/category.model.js'


//create subcategory
export const createSubcategory=asyncHandler(async(req,res,next)=>{
    const {categoryId}=req.params;
if(!req.file) return next(new Error("please enter file"))
    const category = await Category.findById(categoryId)
    if(!category) return next(new Error("invalid category"))
const user = await User.findById(req.user._id)
if(!user) return next(new Error('user is not found'))

const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.FOLDER_CLOUD_NAME}/subcategory`})

const subcategory= await Subcategory.create({
    name:req.body.name,
    slug:slugify(req.body.name),
    image:{id:public_id,url:secure_url},
    categoryId,
    createdBy:req.user._id,

})


return res.json({success:true,subcategory})
})

//update
export const updateSubcategory=asyncHandler(async(req,res,next)=>{
    //check category
    const category = await Category.findById(req.params.categoryId)
    if(!category) return next(new Error("invalid categry"))
    //check subcategory with their parent cause the perivious step is not enough cause maybe we find category called electronics but it is not the parent for this subcategory
const subcategory= await Subcategory.findone({_id:req.params.categoryId, categoryId:req.params.categoryId})

//check owner >> we need here that the admin who created this subcategory who only the person that will update or delete the subcategory
if(req.user._id.toString()!==subcategory.createdBy.toString())
return next(new Error("you are not authorized"))
//check subcategory
if(!subcategory) return next(new Error('invalid subcategory'))
subcategory.name=req.body.name?req.body.name:subcategory.name;
subcategory.slug=req.body.name?slugify(req.body.name):subcategory.slug
//check file
if(req.file){
const {secure_url}= await cloudinary.uploader.upload(req.file.path,{public_id:subcategory.image.id})
subcategory.image.url=secure_url;
subcategory.save()
}

return res.json({success:true,message:"updated succefully"})


})

/////delte
export const deleteSubcategory=asyncHandler(async(req,res,next)=>{
const category= await Category.findById(req.params.categoryId)
if(!category) return next(new Error('invalid category'))
 const subcategoy= await Subcategory.findone({_id:req.params.subcategoryId,categoryId:req.params.categoryId})
if(!subcategoy) return next(new Error('invalid subcategory'))
//check owner >> we need here that the admin who created this subcategory who only the person that will update or delete the subcategory
if(req.user._id.toString()!== subcategoy.createdBy.toString())
return next(new Error("you are not authorized"))
const results = await cloudinary.uploader.destroy(subcategoy.image.id)

const deleteSubcategory = await Subcategory.findOneAndDelete({_id:req.params.subcategoryId,categoryId:req.params.categoryId})
return res.json({success:true,message:"deleted succefully"})
})








//read
export const allSubcategory=asyncHandler(async(req,res,next)=>{
const subcategory= await Subcategory.find().populate("categoryId")
return res.json({success:true,results:subcategory})
   
})