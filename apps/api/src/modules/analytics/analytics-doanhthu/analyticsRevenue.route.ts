
import { Router } from "express";
import {
  getRevenueFilterOptions,
  getRevenueOverview,
} from "./analyticsRevenue.controller";

const router = Router();

router.get("/", getRevenueOverview);
router.get("/filter-options", getRevenueFilterOptions);

export default router;
