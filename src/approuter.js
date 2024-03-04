import  userRouter from './modules/auth/auth.router.js'
import categoryRouter from '../src/modules/category/category.router.js';
import subcategoryRouter from '../src/modules/subcategory/subcategory.router.js';
import brandRouter from '../src/modules/brand/brand.router.js';
import productRouter from '../src/modules/product/product.router.js';
import couponRouter from '../src/modules/coupon/coupon.router.js';
import cartRouter from '../src/modules/cart/cart.router.js'
import orderRouter from '../src/modules/order/order.router.js'
import morgan from 'morgan';
export const appRouter=(app,express)=>{
    //morgan
    if(process.env.NODE_ENV==='dev'){
         app.use(morgan("combined"))
    }
// CORS
const whitelist=['http://127.0.0.1:5500']
app.use((req,res,next)=>{
//activate acount
if(req.originalUrl.includes('/auth/confirmEmail'))
{
    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Methods","GET")
    return next()
}


    if(!whitelist.includes(req.header("origin"))){
        return next (new Error("blocked by cors"))
    }
res.setHeader("Access-Control-Allow-Origin","*")
res.setHeader("Access-Control-Allow-Headers","*")
res.setHeader("Access-Control-Allow-Methods","*")
res.setHeader("Access-Control-Allow-Private-Networks",true)
return next()
})

app.use(express.json());
app.use('/user',userRouter);
app.use('/category',categoryRouter);
app.use('/subcategory',subcategoryRouter);
app.use('/brand',brandRouter);
app.use("/products",productRouter)
app.use('/coupon',couponRouter)
app.use('/cart',cartRouter)
app.use('/order',orderRouter)
//page not found
app.all('*',(req,res,next)=>{

    return res.status(404).json({sucess:false,message:"page not found!"});

});


///global error handling
app.use((error,req,res,next)=>{

return res.json({success:false,message:error.message,stack:error.stack});


})
};
