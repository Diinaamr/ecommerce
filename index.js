import express from 'express';
import { appRouter } from './src/approuter.js';
import { connectDB } from './Db/connection.js';
import dotenv from 'dotenv';
dotenv.config();
const app=express();
appRouter(app,express);
connectDB();
app.listen(process.env.PORT,()=>{

console.log('app is running ');



})

