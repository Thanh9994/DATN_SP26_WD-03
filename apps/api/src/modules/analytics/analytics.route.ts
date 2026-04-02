import { Router } from "express";
import { analyticsController } from "./analytics.controller";

const analyticsRouter = Router();

analyticsRouter.get("/", analyticsController.getOverview);
analyticsRouter.get("/theaters", analyticsController.getTheaterOptions);

export default analyticsRouter;