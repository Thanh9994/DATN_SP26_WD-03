import { Router } from "express";
import { sendContactMail } from "./contact.controller";

const contactRoute = Router();

contactRoute.post("/", sendContactMail);

export default contactRoute;