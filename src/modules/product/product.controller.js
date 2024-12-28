import { asyncHandler } from "../../utilis/asynchandler.js";
import {Product} from '../../../Db/model/product.model.js';
import cloudinary from '../../utilis/cloud.js'
import {nanoid} from "nanoid";
import{Category} from '../../../Db/model/category.model.js'
import { Subcategory } from "../../../Db/model/subcategory.model.js";
import{Brand} from '../../../Db/model/brand.model.js'


// create product
export const createProduct= asyncHandler(async(req,res,next)=>{
//date
// const{name,description,price,discount,availableItems,category,subCategory,brand}=req.body;
//check category 
const category= await Category.findById(req.body.category)
if(!category) return next(new Error('invalid category '));

//check subcategory
const subcategory= await Subcategory.findById(req.body.subCategory)
if(!subcategory) return next(new Error('invalid subcategory '));


//check brand
const brand= await Brand.findById(req.body.brand)
if(!brand) return next(new Error('invalid brand'));


if(!req.files) return next(new Error("products images are required",{cause:400}))
//create unique folder name

const cloudFolder=nanoid()
let images=[]
//upload file in cloudinary
for(const file of req.files.subImages){ // here we mean that for loop to every image we have
    const{secure_url,public_id}= await cloudinary.uploader.upload(file.path,{folder:`${process.env.FOLDER_CLOUD_NAME}/products/${cloudFolder}`}) 
images.push({id:public_id,url:secure_url})
}
//upload default image
const {secure_url,public_id}= await cloudinary.uploader.upload(req.files.defaultImage[0].path,{folder:`${process.env.FOLDER_CLOUD_NAME}/products/${cloudFolder}`})

//create product
const result= await Product.create({
...req.body,
createdBy:req.user._id,
cloudFolder,
defaultImage:{id:public_id,url:secure_url},
images,
})
console.log('product without dicount:',result.finalPrice)
return res.json({success:true,message:"created succefully",results:result})
});





///delete product
export const deleteProduct=asyncHandler(async(req,res,next)=>{
    //chech if the product exisit
const product= await Product.findById(req.params.productId)
if(!product) return next(new Error('invalid product'))
//check owner
if(req.user._id.toString()!==product.createdBy.toString())return next(new Error('you are not authorized',{cause:401}))
//delete files from cloudinary
const imagesArr= product.images // da array of object [{id:,url,},{id:,url}] we need to loop on the id to delete it
 const ids=imagesArr.map((imageObj)=>imageObj.id) //here we took the imageArr to loop on it by the function map and we put the imageObj and will return from the one image her id
console.log(ids);
//and also wee need delete the if of the defaultImage
ids.push(product.defaultImage.id)
// we will use here function called delete_resources cause it delete group of ids so inside it ww will write the variable ids cause we strored the all ids inside him
//delte images 
const result= await cloudinary.api.delete_resources(ids)
console.log(result);

// we need delete the folder itself cause we deleted the images but the cloudfolder that they were in it still not deleted and we can't delte the folder only if it is empty
await cloudinary.api.delete_folder(`${process.env.FOLDER_CLOUD_NAME}/products/${product.cloudFolder}`)
  
// delete the product itself from Db
await Product.findByIdAndDelete(req.params.productId);

return res.json({success:true,message:"product delted succefully"})

})

//get allProducts
export const allProducts=asyncHandler(async(req,res,next)=>{

    if(req.params.categoryId){
        const category= await Category.findById(req.params.categoryId)
        if(!category) return next (new Error('inalid category'))
        const products= await Product.findOne({category:req.params.categoryId})
        return res.json({success:true,products})
    }
//     /////////////**********search***********//////////////////
//     const{keyWord}=req.query
//     //search by name and regex to return any product has the same word but if we don't write regex so if we will search about oppo and in the strore we have oppo reno it won't return anything
// //and also here i wanna when the user search by any word even if thi word exists in the describtion return to them
// const product= await Product.find({$or:[{name:{$regex:keyWord , $options:"i"}},{description:{$regex:keyWord  , $options:"i"}}]}) 
// i for insensetive cause i need to return the products that i need regardeless that start by capital or small letters

///////****************filter***********888/////////////
//here i need to search by special things like i need that product that its name is iphone and its price is 70000 for example
// const {name,price} =req.query
// const products= await Product.find({...req.query})
// and here to read from the query or search for the only the things that we have in the model and ignore anything else we wrote in the model >>strictQuery:true
const products= await Product.find({...req.query}).paginate(req.query.page).customSelect(req.query.fields).sort(req.query.sort)
return res.json({success:true,results:products})

})



//get single product
export const singleProducts=asyncHandler(async(req,res,next)=>{
const product = await Product.findById(req.params.productId)
if(!product) return next(new Error('invalid product'))

return res.json({success:true,results:product})



})