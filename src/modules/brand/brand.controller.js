import { asyncHandler } from "../../utilis/asynchandler.js";
import {Brand} from '../../../Db/model/brand.model.js';
import cloudinary from "../../utilis/cloud.js";
import slugify from "slugify";
export const createBrand= asyncHandler(async(req,res,next)=>{
// const {name}=req.body;
if(!req.file) return next(new Error('you must enter image'));
//upload the image in cloudinary
const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.FOLDER_CLOUD_NAME}/brand`})

//save brand in database
const brand = await Brand.create({
    name:req.body.name,
    createdBy:req.user._id,
    image:{
        url:secure_url,
        id:public_id,
    },
    slug:slugify(req.body.name)
})

return res.json({success:true,message:"brand created succeffully",results:brand})


});

//update brand
export const updateBrand= asyncHandler(async(req,res,next)=>{
const {brandId}= req.params;
const brand =  await Brand.findById(brandId)
if(!brand) return next (new Error("invalid brand"))

//check owner 
if(req.user._id.toString()!==brand.createdBy.toString())
return next(new Error("you are not autherized"))
brand.name=req.body.name?req.body.name : brand.name
brand.slug=req.body.name ? slugify(req.body.name) :brand.slug

if(req.file){
    const {secure_url}= await cloudinary.uploader.upload(req.file.path,{public_id:brand.image.id})
    brand.image.url=secure_url;
}
await brand.save();
return res.json({success:true});

});


//delte brand 
export const deleteBrand=asyncHandler(async(req,res,next)=>{
const{brandId}=req.params
const brand =await Brand.findById(req.params.brandId);
if(!brand) return next(new Error("invalid brand"));
//check owner
if(req.user._id.toString()!==brand.createdBy.toString()) return next(new Error("you are not authorized"))

//delte the image from cloudinare
const result= await cloudinary.uploader.destroy(brand.image.id)
console.log(result)


const delteBrand= await Brand.findByIdAndDelete(brandId);
return res.json({success:true,message:"deleted succeffully"})
});

//get all brands
export const getAllBrands=asyncHandler(async(req,res,next)=>{

const brands= await Brand.find()
return res.json({success:true,results:brands})


});