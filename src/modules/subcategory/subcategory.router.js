import { Router } from "express";
import { isAuthenticated } from "../middelware/auth.js";
import { isAuthorized } from "../middelware/authorization.middelware.js";
import { filterObject, uploadCloud } from "../../utilis/multer.cloud.js";
import { isValid } from "../middelware/middelware.validation.js";
import{createSubcategoryValidation, updateSubcategoryValidation,deleteSubcategoryValidation} from '../subcategory/subcategory.validation.js';
import{createSubcategory,updateSubcategory,deleteSubcategory,allSubcategory} from './subcategory.controller.js'
const router = Router({mergeParams:true}); // this to read any id will be in the params like the categoryId
 router.post('/',isAuthenticated,isAuthorized('admin'),uploadCloud(filterObject.image).single("subcategory"),isValid( createSubcategoryValidation),createSubcategory)


//update


router.patch('/:subcategoryId',isAuthenticated,isAuthorized('admin'),uploadCloud(filterObject.image).single("subcategory"),isValid( updateSubcategoryValidation),updateSubcategory)

//delete
router.delete('/:subcategoryId',isAuthenticated,isAuthorized('admin'),isValid( deleteSubcategoryValidation),deleteSubcategory)

//read
router.get('/',allSubcategory)






export default router;