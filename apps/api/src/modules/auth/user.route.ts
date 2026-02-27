    import { Router } from "express";
    import { deleteUser, getAllUsers, Login, me, Register, updateUser } from "./auth.controller";
    import { authenticate, authorize } from "@api/middlewares/auth.middleware";

    const usersRouter = Router();

    usersRouter.post ("/register", Register);
    usersRouter.post ("/login", Login);
    usersRouter.get("/me", authenticate, me);
    
    usersRouter.get ("/",authenticate, authorize(["admin"]), getAllUsers);
    usersRouter.patch ("/:id",authenticate, authorize(["admin"]), updateUser);
    usersRouter.delete ("/:id",authenticate, authorize(["admin"]), deleteUser);

    export default usersRouter;