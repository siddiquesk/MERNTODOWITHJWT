import express from "express"
const app=express();
import mongoose from "mongoose";
import todoRoute from "./routes/todoroute.js";
import userRoute from "./routes/userroute.js";
import dotenv from "dotenv"
import cors from "cors"
dotenv.config();


const PORT=process.env.PORT || 8080;
const MONGO_DB=process.env.MONGO_URL;
main().then(()=>{
console.log('db conncted');
}).catch(err => console.log(err));
async function main() {
  await mongoose.connect(MONGO_DB);
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/todo', todoRoute);
app.use('/user',userRoute);



app.listen(PORT,()=>{
  console.log(`server is runnning on ${PORT}`);
})