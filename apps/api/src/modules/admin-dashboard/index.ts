import { Router } from "express";
import dashboardRouter from "./dashboard.route";

const adminDashboardRouter = Router();

adminDashboardRouter.use("/", dashboardRouter);

export default adminDashboardRouter;
