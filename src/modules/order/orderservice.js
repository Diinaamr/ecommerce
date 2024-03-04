//clear cart
import { Cart } from "../../../Db/model/cart.model.js";
import { Product } from "../../../Db/model/product.model.js";
export const clearCart= async(userId)=>{

    await Cart.findOneAndUpdate({user:userId }, { products:[]})
}



//update stock
export const updateStock= async(products,placeOrder)=>{
    //placeOrder>> true or false
    //true>>placeOrder
    //false>>cancel order
    if(placeOrder){for (const product of products){
    
await Product.findByIdAndUpdate(product.productId ,{
    $inc:{
        availableItems: -product.quantity,

        soldItems: product.quantity
    }

})

}}
else{
    for (const product of products){
    
        await Product.findByIdAndUpdate(product.productId ,{
            $inc:{
                availableItems: product.quantity,
        
                soldItems: -product.quantity
            }
        
        })
        
        }


}







}

