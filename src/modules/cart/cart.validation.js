import joi from 'joi'
import { isValidObjectId } from '../middelware/middelware.validation.js'
export const CartSchema=joi.object({
productId:joi.string().custom(isValidObjectId).required(),
quantity:joi.number().integer().min(1).required(),




}).required()


export const removeProductsFromCart=joi.object({

    productId:joi.string().custom(isValidObjectId).required(),


}).required()