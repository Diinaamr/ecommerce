import joi from "joi";
import {isValidObjectId} from '../middelware/middelware.validation.js';



 export const createBrandSchema= joi.object({
name:joi.string().min(3).max(20).required(),
createdBy:joi.string().custom(isValidObjectId),

}).required();



 export const updateBrandSchema=joi.object({
name:joi.string(),
brandId:joi.string().custom(isValidObjectId).required()

 }).required()
 
 export const delteBrandSchema=joi.object({

brandId:joi.string().custom(isValidObjectId).required()

 }).required()