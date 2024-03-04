import {Router}  from "express";
import { isValid } from "../middelware/middelware.validation.js";
import { userValid ,activateSchema,loginSchema, passCodeSchema,resetPassSchema} from "./auth.validation.js";
import { register,ActivateAccount,Login,sendFrogetCode,resetPassword} from "./auth.controller.js";
const router= Router();

//register
router.post("/register",isValid(userValid),register);

//activate account
router.get('/confirmEmail/:activationCode',isValid(activateSchema),ActivateAccount)


//////////login

router.post('/login',isValid(loginSchema),Login)

// send forget password code
router.patch('/forgetCode',isValid(passCodeSchema),sendFrogetCode)


//reset password
 router.patch("/resetPassword",isValid(resetPassSchema),resetPassword)




export default router;