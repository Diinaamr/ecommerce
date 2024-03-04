import joi from 'joi'
import {isValidObjectId} from '../middelware/middelware.validation.js';
export const createSchema= joi.object({
    name:joi.string().required(),
    createdBy:joi.string().custom(isValidObjectId),
}).required()


export const updateSchema=joi.object({
    name:joi.string(),
    id:joi.string().custom(isValidObjectId).required().required(),

}).required()






export const deleteSchema=joi.object({
    id:joi.string().custom(isValidObjectId),
}).required()
