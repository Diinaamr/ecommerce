import { Router } from "express";
import {isAuthenticated} from '../middelware/auth.js';
import {isAuthorized} from '../middelware/authorization.middelware.js'
import { filterObject, uploadCloud } from "../../utilis/multer.cloud.js";
import { isValid } from "../middelware/middelware.validation.js";
import { createBrandSchema ,updateBrandSchema,delteBrandSchema} from "./brand.validation.js";
import { createBrand ,updateBrand,deleteBrand,getAllBrands} from "./brand.controller.js";

const router =Router();

router.post('/',isAuthenticated,isAuthorized('admin'),uploadCloud(filterObject.image).single('B'),isValid(createBrandSchema),createBrand)
     


router.patch("/:brandId",isAuthenticated,isAuthorized("admin"),uploadCloud(filterObject.image).single('B'),isValid(updateBrandSchema),updateBrand);

router.delete('/:brandId',isAuthenticated,isAuthorized('admin'),isValid(delteBrandSchema),deleteBrand)

router.get('/',getAllBrands)






export default router;