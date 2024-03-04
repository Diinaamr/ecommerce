import mongoose ,{Schema,model,Types} from "mongoose";
const orderSchema= new Schema({
user:{
    type:Types.ObjectId,
    ref:"User",
    required:true,
},
address:{
    type:String,
    required:true,
},
phone:{
    type:String,
    required:true,

},
products:[{
    _id:false,
    productId:{type:Types.ObjectId, ref:"Product"},
    quantity:{type:Number,min:1},
    name:String,
    itemPrice:{ type:Number},
    totalPrice:{ type:Number},
}],

invoice:{id:String,url:String},

status:{
    type:String,
    enum:["placed","shipped","delivered","canceled","refunded"],
    default:"placed"
},

price:{
    type:Number,
    min:1,
    required:true
},

coupon:{
 id:{type:Types.ObjectId,
    ref:"Coupon"},
    name:String,
    discount:{
        type:Number,
        min:1,
        max:100,

    }
},
payment:{
    type:String,
    enum:["cash","visa"],
    default:"cash"

},



},{timestamps:true})


orderSchema.virtual("finalPrice").get(function(){

    return this.coupon?
 Number.parseFloat( this.price-(this.price*this.coupon.discount)/100).toFixed(2):this.price

    
    })


//model
export const Order= mongoose.models.Order|| model("Order",orderSchema)