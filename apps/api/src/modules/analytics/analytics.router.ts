import { Router } from "express";
import { topMoviesController, busyDaysController } from "./analytics.controller";

const analyticsRouter = Router();

// Tạm thời bỏ middleware để test (sau khi ổn sẽ mở lại)
analyticsRouter.get("/top-movies", topMoviesController);
analyticsRouter.get("/busy-days", busyDaysController);

export default analyticsRouter;