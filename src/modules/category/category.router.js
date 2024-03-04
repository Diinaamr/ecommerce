import { Router } from "express";
import { isValid } from "../middelware/middelware.validation.js";
import{createSchema,updateSchema,deleteSchema} from './category.validation.js';
import{isAuthenticated} from '../middelware/auth.js';
import{isAuthorized} from '../middelware/authorization.middelware.js';
import {createCategory,updateCategory,deleteCategory,readCategory} from '../../modules/category/category.controller.js'
import { filterObject, uploadCloud } from "../../utilis/multer.cloud.js";
import subcategoryRouter from '../subcategory/subcategory.router.js'
import productRouter from '../product/product.router.js'
const router=Router();

//here because the category is the parent and the subcategory is the child
router.use("/:categoryId/subcategory",subcategoryRouter)

//here because the category is the parent and the product is the child
router.use("/:categoryId/products",productRouter)

//create category
router.post('/',isAuthenticated,isAuthorized("admin"),uploadCloud(filterObject.image).single('category'),isValid(createSchema),createCategory)

//update category
router.patch('/update/:id',isAuthenticated,isAuthorized('admin'),uploadCloud(filterObject.image).single('update'),isValid(updateSchema),updateCategory)

//////////delete category
router.delete('/delete/:id',isAuthenticated,isAuthorized('admin'),isValid(deleteSchema),deleteCategory)

//get all categories
router.get('/',readCategory)



export default router