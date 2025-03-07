import express from 'express';
import { createTodo,getTodos,updateTodo,deleteTodo } from '../controllers/todoController.js';
import { Authenticate } from "../Middleware/Authorize.js";  // Ensure .js extension
const router = express.Router();

router.post('/create',Authenticate, createTodo);
router.get('/fetch',Authenticate, getTodos);
router.put('/update/:id',Authenticate, updateTodo);
router.delete('/delete/:id',Authenticate,deleteTodo);
export default router;
