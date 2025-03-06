import express from "express"
const router =express.Router();
import { register, login, logout } from "../controllers/usercontroller.js";


router.post("/signup",register);
router.post("/login",login);
router.get("/logout",logout);


export default router;

