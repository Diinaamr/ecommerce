import {Router} from 'express'
import { isAuthenticated } from '../middelware/auth.js';
import { isAuthorized } from '../middelware/authorization.middelware.js';
import { isValid } from '../middelware/middelware.validation.js';
import{CartSchema,removeProductsFromCart} from '../cart/cart.validation.js';
import { addToCart,userCart,updateCart ,removeProductCart,clearCart} from './cart.controller.js';
const router=Router();

//add product in cart
router.post('/',isAuthenticated,isValid(CartSchema),addToCart);



//retrieve all products from cart
router.get('/',isAuthenticated,userCart);



//update cart
router.patch('/',isAuthenticated,isValid(CartSchema),updateCart);

//clear cart
router.patch('/clear',isAuthenticated,clearCart)


//remove products from carts
router.patch("/:productId",isAuthenticated,isValid(removeProductsFromCart),removeProductCart);






















export default router;