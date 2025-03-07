import express from "express"
const app=express();
import mongoose from "mongoose";
import todoRoute from "./routes/todoroute.js";
import userRoute from "./routes/userroute.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import cors from "cors"
dotenv.config();


const PORT=process.env.PORT || 8080;
const MONGO_DB=process.env.MONGO_URL;
main().then(()=>{
}).catch(err => console.log(err));
async function main() {
  await mongoose.connect(MONGO_DB);
}

app.use(
  cors({
    origin: process.env.FRONTEEND_URL, // सिर्फ frontend को allow करें
    credentials: true, // Cookies और Authentication headers को allow करें
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],  
  })
);
app.use(express.json());
app.use(cookieParser());  
app.use(express.urlencoded({extended:true}));
app.use('/todo', todoRoute);
app.use('/user',userRoute);



app.listen(PORT,()=>{
  console.log(`server is runnning on ${PORT}`);
})