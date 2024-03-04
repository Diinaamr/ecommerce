import {Category} from '../../../Db/model/category.model.js';
import { Subcategory } from '../../../Db/model/subcategory.model.js';
import {asyncHandler} from '../../utilis/asynchandler.js';
import  cloudinary from '../../utilis/cloud.js';
import slugify from 'slugify';

export const createCategory= asyncHandler(async(req,res,next)=>{
    //data
// const createdBy= req.user._id;
// const {name}=req.body;

//file
if(!req.file) return next(new Error('category image is required'));

//upload file in cloud
const {secure_url,public_id}=await  cloudinary.uploader.upload(req.file.path,{folder:`${process.env.FOLDER_CLOUD_NAME}/category`})

// save file in database
const category= await Category.create({name:req.body.name,
    createdBy:req.user._id,
    image:{id:public_id,url:secure_url},
    slug: slugify(req.body.name)
});

return res.json({success:true,message:"added succefully",results:category});


})



//update category
export const updateCategory=asyncHandler(async(req,res,next)=>{
const {id}=req.params;
const category = await Category.findById(id);
//check owner >> we need here that the admin who created this subcategory who only the person that will update or delete the subcategory
if(req.user._id.toString()!==category.createdBy.toString())
return next(new Error("you are not authorized"))
if(!category) return next (new Error('invalid category'));
category.name=req.body.name ? req.body.name : category.name;
category.slug=req.body.name?slugify(req.body.name) : category.slug;
if(!req.file) return next (new Error('please enter the image'));
const {secure_url}= await cloudinary.uploader.upload(req.file.path,{public_id:category.image.id});

category.url=secure_url
await category.save();
// console.log(category.image.id);
// console.log(category.image.url);
return res.json({success:true,message:"updated succefully"})

});



/////////////delete category
 export const deleteCategory= asyncHandler(async(req,res,next)=>{

const {id}=req.params
const category = await Category.findById(id)
if(!category) return next (new Error("invalid category"))
//check owner
if(req.user._id.toString()!==category.createdBy.toString())
return next(new Error("you are not authorized"))
//delte imgae first
  const results =await cloudinary.uploader.destroy(category.image.id)
console.log(results);


//remove category itself
//  await category.remove
// category.save();
const deleteCategory= await Category.findByIdAndDelete(id)

//delete the subcategory that is under this category
await Subcategory.deleteMany({categoryId:category._id})
return res.json({success:true,message:"deleted succefully"})
 })









 /////////get all categories
 export const readCategory=asyncHandler(async(req,res,next)=>{
const category= await Category.find().populate({path:'subcategory',
populate:[{path:"createdBy"}]});
//here we did nested populate so it means that inside the category we populated on the subcategories and in the same time we need to populate on thing inside the subcategory so we poplualte on it
return res.json({success:true,message:"these the all categories we have",results:category})



 })