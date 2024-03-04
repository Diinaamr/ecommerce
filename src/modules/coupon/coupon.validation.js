import joi from 'joi';
import { isValidObjectId } from '../middelware/middelware.validation.js';
export const createCouponSchema= joi.object({
name:joi.string(),
discount:joi.number().min(1).max(100).required(),
expiredAt:joi.date().greater(Date.now()).required(),
createdBy:joi.string().custom(isValidObjectId),





}).required()



export const updateCouponSchema=joi.object({
code:joi.string().required(),
discount:joi.number().min(1).max(100),
expiredAt:joi.date().greater(Date.now()),


}).required()

export const deleteCouponSchema=joi.object({
    code:joi.string().required()
}).required()