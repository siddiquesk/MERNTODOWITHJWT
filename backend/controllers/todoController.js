import Todo from '../models/todo-model.js';

export const createTodo=async (req,res)=>{
   const todo=new Todo({
    text:req.body.text,
    completed:req.body.completed,
    user: req.user._id, //assoiated with logged in user
   })
   try{
  const newtodo=await todo.save();
   res.status(201).json({message:"todo created successfull",newtodo});

   }catch(err){
    res.status(400).json({message:`Error creating todo: ${err.message}`});
   }
}

export const getTodos=async(req,res)=>{
  try{
  const todos=await Todo.find({user: req.user._id});
  res.status(200).json({message:"tods fetched successfully",todos});
  }
  catch(err){
  res.status(500).json({message:`Error fetching todos: ${err.message}`});
  }
}


export const updateTodo=async(req,res)=>{
  const {id}=req.params;
try{
const updatetodo=await Todo.findByIdAndUpdate(id,req.body,{new:true});
res.status(200).json({message:"todo updated successfully",updatetodo});
}catch(err){
 res.status(404).json({message:`Error updating todo: ${err.message}`});
}
}

export const deleteTodo=async(req,res)=>{
  const {id}=req.params;
  try{
  const deletetodo=await Todo.findByIdAndDelete(id);
  res.status(200).json({message:"todo deleted successfully",deletetodo});
  }catch(err)
  {
   res.status(404).json({message:`Error deleteing todo: ${err.message}`});
  }
}
