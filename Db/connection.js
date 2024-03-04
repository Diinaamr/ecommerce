import mongoose from "mongoose";
export const connectDB= async()=>{
return await mongoose.connect(process.env.CONNECTIONDB).then(()=>console.log("DB connected")).catch((error)=> console.log(error));

}