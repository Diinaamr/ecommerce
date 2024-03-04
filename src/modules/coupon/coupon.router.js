import { Router } from "express";
const router=Router();
import{isAuthenticated} from '../middelware/auth.js';
import {isAuthorized} from '../middelware/authorization.middelware.js'
import {isValid} from '../middelware/middelware.validation.js'
import{createCouponSchema,updateCouponSchema,deleteCouponSchema} from '../../modules/coupon/coupon.validation.js'
import {createCoupon,updateCoupon,deleteCoupon,allCoupons} from '../coupon/coupon.controller.js'

//create
router.post("/",isAuthenticated,isAuthorized("admin"),isValid(createCouponSchema),createCoupon)


//update
router.patch("/:code",isAuthenticated,isAuthorized("admin"),isValid(updateCouponSchema),updateCoupon)

//delete
router.delete('/:code',isAuthenticated,isAuthorized("admin"),isValid(deleteCouponSchema),deleteCoupon);


//get allcoupouns
router.get('/',allCoupons)

export default router