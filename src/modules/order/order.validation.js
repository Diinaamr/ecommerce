import joi from 'joi'
import{isValidObjectId} from '../middelware/middelware.validation.js'
//create order

export const createOrderSchema=joi.object({
address:joi.string().min(5).required(),
phone:joi.string().required(),
coupon:joi.string(),
payment:joi.string().valid("cash","visa").required(),





}).required()

//cancel order
export const cancelOrderSchema=joi.object({

orderId:joi.string().custom(isValidObjectId).required(),






}).required()