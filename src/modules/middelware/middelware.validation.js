import {Types} from 'mongoose'
export const isValidObjectId=(value,helper)=>{
    if(Types.ObjectId.isValid(value)){
        return true
    } else{
        return helper.message("invalid objectId")
    }
    
    
    }
export const isValid=(schema)=>{
return (req,res,next)=>{

const copyReq={...req.body, ...req.params , ...req.query };
const validationResults= schema.validate(copyReq,{abortEarly:false})

if (validationResults.error){
   const messages= validationResults.error.details.map((error)=>error.message)
    return next(new Error(messages),{cause:400})
}

return next();

}



};
