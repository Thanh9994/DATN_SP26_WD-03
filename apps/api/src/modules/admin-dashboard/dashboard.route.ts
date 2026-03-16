import { Router } from "express";
import {
  getCleanupLogs,
  getUnreadCleanupCount,
  markCleanupLogsRead,
} from "./dashboard.controller";
import { authenticate, authorize } from "@api/middlewares/auth.middleware";

const dashboardRouter = Router();

dashboardRouter.use(authenticate, authorize(["admin", "manager"]));

dashboardRouter.get("/cleanup-logs", getCleanupLogs);
dashboardRouter.get("/cleanup-logs/unread-count", getUnreadCleanupCount);
dashboardRouter.patch("/cleanup-logs/mark-read", markCleanupLogsRead);

export default dashboardRouter;
