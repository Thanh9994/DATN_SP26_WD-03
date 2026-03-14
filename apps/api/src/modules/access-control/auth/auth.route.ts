import { Router } from "express";
import {
  forgotPassword,
  Login,
  Register,
  resetPassword,
  verifyEmail,
} from "./auth.controller";

const authRouter = Router();

authRouter.post("/register", Register);
authRouter.post("/login", Login);
authRouter.post("/forgot-password", forgotPassword);

authRouter.post("/reset-password/:token", resetPassword);
authRouter.get("/verify-email", verifyEmail);

export default authRouter;
