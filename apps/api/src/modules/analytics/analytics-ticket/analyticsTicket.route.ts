import { Router } from "express";
import { analyticsTicketController } from "./analyticsTicket.controller";

const analyticsTicketRoute = Router();

analyticsTicketRoute.get("/overview", analyticsTicketController.getOverview);

export default analyticsTicketRoute;