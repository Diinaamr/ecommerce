import mongoose,{Schema,Types,model} from "mongoose";
export const productSchema= new Schema({
    name:{
        type:String,
        required:true,
        min:2,
        max:20,
    },
    slug:{
        type:String,
        // required:true
    },
    description:String,
    images:[{
        url:{
            type:String,
            required:true,
        },
        id:{
            type:String,
            required:true
        }
    }],
    createdBy:{
        type:Types.ObjectId,
        ref:"User"
    },
    defaultImage:{ // this is the default image that appears in the first on the product
        url:{type:String,required:true},
        id:{type:String,required:true}
    },
    availableItems:{type:Number,min:1,required:true},
    soldItems:{type:Number,default:0},
    price:{type:Number,min:1,required:true},
    discount:{type:Number,min:1,max:100}, //%%%%
    category:{type:Types.ObjectId,
        ref:"Category",
        required:true
    },
    subCategory:{type:Types.ObjectId,
        ref:"Subcategory",
        required:true
    },
    brand:{type:Types.ObjectId,
    ref:"Brand",
    required:true
},

    cloudFolder: // here the one product will hava many images so we nedd to make folder on the cloudinary for the one product
    {type:String,
    unique:true}

},{timestamps:true , strictQuery:true , toJSON:{virtuals:true}}) // strictQuery means that the query won't read anything dosen't exist in the model

//virtual final price

productSchema.virtual("finalPrice").get(function(){
//this>>>refer to the document itself>>product {}

//calculate the finalprice?>>price and discount
// if(this.discount>0){
//  return this.price- (this.price*this.discount)/100 //here wee need to calculate the final price after the discount and the discount here is percentage 

// }
// return this.price

//and also we can write by better way
if(this.price){
return Number.parseFloat( this.price-(this.price*this.discount||0)/100).toFixed(2)
 //here Number.parsefloat de 3shan thsbly lw tl3 ksor w toFixed 3shan n2rb elksor elly httl3
}
})


////////////////***** pagination ***///////////
// query helper
// query holds the functions which are the skip and limit and sort and filter and select and this things
productSchema.query.paginate=function(page) {

page= !page || page<1 || isNaN(page)?1:page
const limit= 2
const skip= (page-1) * limit
//this>>quey
 return this.skip(skip).limit(limit)

};


 ///////***** selection ***///

productSchema.query.customSelect=function(fields){
   if(!fields) return this;

//model keys
const modelKeys= Object.keys(Product.schema.paths) // here i used the function Object.keys cause i need only the keys from the schema
//quers keys 
//cause we need to make the fields array to compare it with the modelkeys cause we need if the query has something dosen't exist in the model ignore it
const queryKeys=fields.split(" ")
//matchedKey
//here we need to filter the array of the fields fro anything strange that it dosn't exist in the model so i mean we dont want that if we write in the query 'x' we don't need that 'x' appear in the console,lo

const matchedKey= queryKeys.filter((key)=>modelKeys.includes(key))
return this.select(matchedKey)
}

//stock function
productSchema.methods.inStock=function(requiredQuantity){
     return this.availableItems>=requiredQuantity ?true : false
}

export const Product= mongoose.models.Product||model("Product",productSchema)