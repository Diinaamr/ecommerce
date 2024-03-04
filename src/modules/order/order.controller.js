import { asyncHandler } from "../../utilis/asynchandler.js";
import{Coupon} from '../../../Db/model/coupon.model.js'
import{Cart} from '../../../Db/model/cart.model.js'
import{Product} from '../../../Db/model/product.model.js'
import{Order} from '../../../Db/model/order.model.js'
import{createInvoice} from '../../utilis/createinvoice.js'
import cloudinary from '../../utilis/cloud.js'
import{sendEmail} from '../../utilis/sendEmails.js'
import path from 'path'
import Stripe from 'stripe'
import { fileURLToPath } from "url";
import { clearCart, updateStock } from "./orderservice.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const createOrder=asyncHandler(async(req,res,next)=>{


//data
const{address,phone,coupon,payment}=req.body
//check coupon
let checkCoupon;
if(coupon) {
checkCoupon=await Coupon.findOne({name:coupon,expiredAt:{$gt:Date.now()}})
if(!coupon) return next (new Error("invalid coupon!"))
}
let orderProducts=[];
let orderPrice=0;

//check cart 
const cart = await Cart.findOne({user:req.user._id})
if(!cart) return next (new Error("invalid cart"))
//check products inside cart
const products=cart.products
if(products.length<1) return next(new Error("empty cart"))

// check products 
for (let i = 0; i < products.length; i++) {

  //check product existence
const product=await Product.findById(products[i].productId)
if(!product) return next(new Error(`product ${products[i].productId}not found`))
  //check stock
 if(!product.inStock(products[i].quantity))
 return next(new Error(`${product.name} out of the stock,only${product.availableItems} left in the stock`))


 orderProducts.push({
  productId:product._id,
  quantity:products[i].quantity,
  name:product.name,
  itemPrice:product.finalPrice,
  totalPrice:products[i].quantity*product.finalPrice,
 })
 orderPrice +=products[i].quantity*product.finalPrice;
  
}

//create order
const order= await Order.create({
  user:req.user._id,
  products:orderProducts,
address,
phone,
payment,
coupon:{
  id:checkCoupon?._id,
    name:checkCoupon?.name,
 discount:checkCoupon?.discount,
},
price:orderPrice,


})

//generate invoice
const user= req.user
const invoice={
shipping:{
  name:user.userName,
  address:order.address,
  country:"Egypt"

},
items:order.products,
subtotal:order.price,
paid:order.finalPrice,
invoice_nr:order._id,


}
const pdfPath= path.join(__dirname, `./../../../invoicetemp/${order._id}.pdf`)
createInvoice(invoice,pdfPath)


//upload cloudinary
const {secure_url,public_id}= await cloudinary.uploader.upload(pdfPath,{
  folder:`${process.env. FOLDER_CLOUD_NAME}/order/invoice/${user._id}`
 
})
//add invoice to the order
order.invoice={id:public_id,url:secure_url}
await order.save()
//update stock
updateStock(order.products,true)

//clear cart
clearCart(user._id)
//send email
// const isSend= await sendEmail({to:user.email,subject:'order invoice',
// attachments:[{
// path:secure_url,
// contentType:'application/pdf'

// }]})
// console.log(isSend);
// if(isSend){

// }
//stripe payment
const stripe = new Stripe(process.env.STRIPE_KEY)
let existCoupon;
if(order.coupon.name !== undefined){
  existCoupon= await stripe.coupons.create({
 percent_off:order.coupon.discount,
 duration:"once"


  })
}
if(payment=='visa'){
  const session= await stripe.checkout.sessions.create({
    payment_method_types:['card'],
    mode:"payment",
    success_url:process.env.success_URL,
    cancel_url: process.env.cancel_URL,
    line_items:order.products.map((product)=>{
    return {
    price_data:{
    currency:"egp",
    product_data:{name: product.name},
    unit_amount: product.itemPrice *100
    
    },
    quantity: product.quantity
    
    }
    
    }),
     discounts: existCoupon?[{coupon : existCoupon.id}]:[]
    
    });
    return res.json({success:true ,results:session.url})
}







//response
return res.json({success:true , message:"your order placed now "})
})









//cancel order
export const cancelOrder=asyncHandler(async(req,res,next)=>{

const order= await Order.findById(req.params.orderId)
if(!order) return next (new Error("order not found"))
 if(order.status=== "shipped"||order.status==="delivered") return next(new Error("can not cancel the order"))
 
 order.status="canceled"
 await order.save()

 //udate stock
 updateStock(order.products,false)
 

 return res.json({success:true, message:"order canceled succefully"})

})