import { Router } from "express";
import { deleteUser, getAllUsers, Login, Register, updateUser } from "./auth.controller";

const usersRouter = Router();

usersRouter.get ("/", getAllUsers);
usersRouter.post ("/register", Register);
usersRouter.post ("/login", Login);
usersRouter.patch ("/:id", updateUser);
usersRouter.delete ("/:id", deleteUser);

export default usersRouter;