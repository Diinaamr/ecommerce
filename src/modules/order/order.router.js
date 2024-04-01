import { Router } from "express";
import{isAuthenticated} from '../../modules/middelware/auth.js'
import{isValid} from '../middelware/middelware.validation.js'
import {createOrder,cancelOrder,orderWebhook} from './order.controller.js'
import{createOrderSchema,cancelOrderSchema} from './order.validation.js'
const router=Router()
// Crud

//create order
router.post('/',isAuthenticated,isValid(createOrderSchema),createOrder)


//cancel order
router.patch('/:orderId',isAuthenticated,isValid(cancelOrderSchema),cancelOrder)


// webhook endpoint and stripe will call it not the frontend




router.post('/webhook', express.raw({type: 'application/json'}), orderWebhook)









export default router