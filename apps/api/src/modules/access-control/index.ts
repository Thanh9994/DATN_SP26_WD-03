import { Router } from "express";
import authRouter from "./auth/auth.route";
import usersRouter from "./user/user.router";
import rateLimit from "express-rate-limit";

const accessRouter = Router();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // tối đa 100 request
  message: {
    success: false,
    message: "Bạn gửi quá nhiều request, vui lòng thử lại sau",
  },
});

accessRouter.use("/auth", limiter, authRouter);
accessRouter.use("/users", usersRouter);

export default accessRouter;
