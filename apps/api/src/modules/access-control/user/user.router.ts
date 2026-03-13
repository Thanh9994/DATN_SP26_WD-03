import { authenticate, authorize } from "@api/middlewares/auth.middleware";
import { Router } from "express";
import { deleteUser, getAllUsers, me, updateUser } from "./user.controller";

const usersRouter = Router();

usersRouter.get("/me", authenticate, me);

usersRouter.use(authenticate, authorize(["admin", "manager"]));

usersRouter.get("/", getAllUsers);
usersRouter.patch("/:id", authorize(["admin"]), updateUser);
usersRouter.delete("/:id", authorize(["admin"]), deleteUser);

export default usersRouter;
