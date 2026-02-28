import { authenticate, authorize } from "@api/middlewares/auth.middleware";
import { Router } from "express";
import { deleteUser, getAllUsers, me, updateUser } from "./user.controller";

const usersRouter = Router();

usersRouter.get("/me", authenticate, me);

usersRouter.use(authenticate, authorize(["admin"]));
usersRouter.get ("/",authenticate, authorize(["admin"]), getAllUsers);
usersRouter.patch ("/:id",authenticate, authorize(["admin"]), updateUser);
usersRouter.delete ("/:id",authenticate, authorize(["admin"]), deleteUser);

export default usersRouter;