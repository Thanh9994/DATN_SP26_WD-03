import { Router } from "express";
import { Login, Register } from "./auth.controller";

const authRouter= Router();

authRouter.post ("/register", Register);
authRouter.post ("/login", Login);


export default authRouter;