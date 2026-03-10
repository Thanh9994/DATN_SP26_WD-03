import { authenticate, authorize } from "@api/middlewares/auth.middleware";
import { Router } from "express";

import { deleteUser, getAllUsers, me, updateUser } from "./user.controller";

const usersRouter = Router();

usersRouter.get("/me", authenticate, me);

usersRouter.use(authenticate, authorize(["admin"]));

usersRouter.get("/", getAllUsers);

usersRouter.patch("/:id", updateUser);

usersRouter.delete("/:id", deleteUser);

export default usersRouter;
