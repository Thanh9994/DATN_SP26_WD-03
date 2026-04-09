import { Router } from "express";
import { sendContactMail } from "./contact.controller";

const contactRouter = Router();

contactRouter.post("/", sendContactMail);

export default contactRouter;