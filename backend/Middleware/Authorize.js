import jwt from 'jsonwebtoken';
import User from '../models/user-model.js';
export const Authenticate=async (req,res,next)=>{
  const token=req.cookies.jwt;
  console.log("jwt ",token);
  if(!token){
return res.status(401).json({message:"Unauthorized"}); 
  }   
  
  try{
 const dcoded=jwt.verify(token,process.env.JWT_SECRET);
 console.log("decoded ",dcoded);
 req.user=await User.findById(dcoded.userId);

  } catch(err){
return res.status(401).json({message:"Invalid token"});
  }
  next();
}