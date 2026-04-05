import { Router } from "express";
import analyticsTicketRoute from "./analytics-ticket/analyticsTicket.route";

const analyticsRouter = Router();

analyticsRouter.use("/ticket", analyticsTicketRoute);

export default analyticsRouter;