import {Router}  from "express";
import { isAuthenticated } from "../middelware/auth.js";
import { isAuthorized } from "../middelware/authorization.middelware.js";
import { filterObject, uploadCloud} from "../../utilis/multer.cloud.js";
import { isValid } from "../middelware/middelware.validation.js";
import { createProductSchema, productIdSchema} from "./product.validation.js";
import { createProduct ,deleteProduct,allProducts,singleProducts} from "./product.controller.js";

const router= Router({mergeParams:true});



router.post('/',isAuthenticated,isAuthorized("admin"),uploadCloud(filterObject.image).fields([{name:"defaultImage",maxCount:1},{name:"subImages",maxCount:3}]),isValid(createProductSchema),createProduct)


//delte product
router.delete('/:productId',isAuthenticated,isAuthorized('admin'),isValid(productIdSchema),deleteProduct)

//get
router.get('/',allProducts)

// single product
router.get('/single/:productId',isValid(productIdSchema),singleProducts)






export default router;