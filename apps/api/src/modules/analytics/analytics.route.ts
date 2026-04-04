import { Router } from "express";
import { analyticsController } from "./analytics.controller";

const analyticsRouter = Router();

analyticsRouter.get("/", analyticsController.getOverview);
analyticsRouter.get("/booking", analyticsController.getBookingAnalytics);
analyticsRouter.get("/theaters", analyticsController.getTheaterOptions);
analyticsRouter.get("/statuses", analyticsController.getStatusOptions);

export default analyticsRouter;