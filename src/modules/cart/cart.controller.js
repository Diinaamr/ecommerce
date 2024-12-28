import { Cart } from "../../../Db/model/cart.model.js";
import { Product } from "../../../Db/model/product.model.js";
import { asyncHandler } from "../../utilis/asynchandler.js";

export const addToCart=asyncHandler(async(req,res,next)=>{
    //data
    const{productId,quantity}=req.body
//check product
const product= await Product.findById(productId)
if(!product) return next(new Error("invalid product"))

//check stock
// if(quantity>product.availableItems) return next (new Error(`sorry,only${product.availableItems} items left in the stock`))
if(!product.inStock(quantity))
return next(new Error(` we have only ${product.availableItems} lefts in our store`))

//check product existence in the cart //TODO
const isproductInCart= await Cart.findOne({user:req.user._id,"products.productId":productId})
if(isproductInCart){
isproductInCart.products.forEach((productObj) => {
if(productObj.productId.toString()===productId.toString()&&productObj.quantity+quantity<product.availableItems){
    productObj.quantity +=quantity
}

    
});
 await isproductInCart.save()
 return res.json({
    success:true,
    results:isproductInCart,
    message:"product added succefully"
 })


}
else{
    //add to cart
const cart= await Cart.findOneAndUpdate({user:req.user._id},{$push:{products:{productId,quantity}}},{new :true})


//response 
return res.json({success:true,results:cart,message:"product added succefully"})

}
})



////////////user cart
 export const userCart=asyncHandler(async(req,res,next)=>{
const cart= await Cart.findOne({user:req.user._id}).populate('products.productId',"name defaultImage.url price discount finalPrice") //cause here we need to populate on the porduct id we need the information about this product but we have that productId inside the array of product
//so we will write the name of array>>products.productId
// and after the , we select what we need on the product we selected the name and the image and this things
// and alse we need to select the finalPrice ut it is virtual like it will calculate when the price and the discount will be there so we put the price and discount before the finalPrice
return res.json({success:true,results:cart})



 });



 //update cart
 export const updateCart=asyncHandler(async(req,res,next)=>{
    const{productId,quantity}=req.body
const product= await Product.findById(productId)
if(!product) return next(new Error('invalid product'))

//check stock
// if(quantity>product.availableItems) return next(new Error(` we have only ${availableItems} lefts in our store`))
 if(!product.inStock(quantity))
 return next(new Error(` we have only ${availableItems} lefts in our store`))

//update
const cart= await Cart.findOneAndUpdate({user:req.user._id,"products.productId":productId},{$set:{"products.$.quantity":quantity}},{new:true})
// here we need to find the cart of the user and in the same time we need to update the quantity of the product so we need the product it self 
// and $set this function to set value to the thing that we need so we need to set the new quantity that we will take from the body to the products.quantity


//response
return res.json({success:true,results:cart,message:"updated succefully"})




 });


 //remove product from cart
 export const removeProductCart=asyncHandler(async(req,res,next)=>{

//remove
const cart= await Cart.findOneAndUpdate({user:req.user._id},{$pull:{products:{productId:req.params.productId}}},{new:true})
//$pull to remove object from array // it is opposite of $push

return res.json({success:true,results:cart,message:"deleted succefulyy"})


 });


 //clear cart from any product
 export const clearCart=asyncHandler(async(req,res,next)=>{
 const cart= await Cart.findOneAndUpdate({user:req.user._id},{products:[]},{new:true})


return res.json({success:true,results:cart,message:"producs deleteed succefully"})


 })