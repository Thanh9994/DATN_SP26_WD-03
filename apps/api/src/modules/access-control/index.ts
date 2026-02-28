import { Router } from "express";
import authRouter from "./auth/auth.route";
import usersRouter from "./user/user.router";

const accessRouter = Router()

accessRouter.use("/auth", authRouter);
accessRouter.use("/users", usersRouter);

export default accessRouter;