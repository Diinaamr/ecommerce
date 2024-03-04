import { asyncHandler } from "../../utilis/asynchandler.js";
import {Coupon} from '../../../Db/model/coupon.model.js';
import voucher_codes from 'voucher-code-generator';
export const createCoupon=asyncHandler(async(req,res,next)=>{

//create code
const code= voucher_codes.generate({length:5})

//create coupon 
const coupon = await Coupon.create({
name:code[0],
discount:req.body.discount,
expiredAt: new Date(req.body.expiredAt).getTime(), // here the getTime will transform the expiredAt to numbers 
createdBy:req.user._id,
})
return res.json({success:true ,results:coupon})


});


//update coupon
export const updateCoupon=asyncHandler(async(req,res,next)=>{

//check coupon
const coupon= await Coupon.findOne({name:req.params.code, expiredAt:{$gt:Date.now()}})
if(!coupon) return next (new Error('invalid coupon'))
//check owner
if(req.user._id.toString()!==coupon.createdBy.toString())return next(new Error("you are not authorized"))

coupon.discount=req.body.discount?req.body.discount:coupon.discount
coupon.expiredAt=req.body.expiredAt? new Date(req.body.expiredAt):coupon.expiredAt
await coupon.save();
return res.json({success:true,message:"updated succefully",results:coupon})



});


///delete coupon
export const deleteCoupon=asyncHandler(async(req,res,next)=>{

const coupon = await Coupon.findOneAndDelete({name:req.params.code})
if(!coupon) return next(new Error("invalid coupon"))
//check owner
if(req.user._id.toString()!==coupon.createdBy.toString())return next(new Error("you are not authorized"))
return res.json({success:true,message:"deleted succefully"})


     
});




//get allCoupons
export const allCoupons=asyncHandler(async(req,res,next)=>{

const coupon= await Coupon.find()

return res.json({success:true,results:coupon})


})