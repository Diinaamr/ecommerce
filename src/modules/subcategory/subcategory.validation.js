import joi from 'joi';
import{isValidObjectId} from '../middelware/middelware.validation.js'
export const createSubcategoryValidation=joi.object({
name:joi.string().min(5).max(20).required(),
categoryId:joi.string().custom(isValidObjectId)
}).required()

export const  updateSubcategoryValidation=joi.object({
    name:joi.string().min(5).max(20),
 categoryId:joi.string().custom(isValidObjectId).required(),
 subcategoryId:joi.string().custom(isValidObjectId).required(),
}).required()

export const deleteSubcategoryValidation=joi.object({ 
    categoryId:joi.string().custom(isValidObjectId).required(),
    subcategoryId:joi.string().custom(isValidObjectId).required(),
}).required()