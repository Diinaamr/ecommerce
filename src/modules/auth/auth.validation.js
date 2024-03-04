import joi from 'joi'
//regestration
export const userValid= joi.object({
userName:joi.string().min(3).max(20).required(),
email:joi.string().email().required(),
password:joi.string().required(),
confirmPassword:joi.string().valid(joi.ref('password')).required(),

}).required()



////activateCode
export const activateSchema= joi.object({
    activationCode:joi.string().required(),
}).required()
////login
export const loginSchema=joi.object({
    email:joi.string().email().required(),
    password:joi.string().required(),
}).required()

///forget password code
export const passCodeSchema=joi.object({
    email:joi.string().email().required(),
}).required()

////////reset password
export const resetPassSchema=joi.object({
    email:joi.string().email().required(),
    forgetCode:joi.string().required(),
    password:joi.string().required(),
    confirmPassword:joi.string().valid(joi.ref('password')).required(),
}).required()