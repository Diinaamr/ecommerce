import { asyncHandler } from "../../utilis/asynchandler.js";

export const isAuthorized=((role)=>{
return asyncHandler( async(req,res,next)=>{
if(role!==req.user.role) return next(new Error('you are not authorized'))
return next()
})


});