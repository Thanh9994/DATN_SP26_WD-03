import express from "express";
import { analyticsCinemasController } from "./analyticsCinemas.controller";

const router = express.Router();

router.get("/", analyticsCinemasController.getAllCinemas);
router.get("/overview", analyticsCinemasController.getOverview);
router.get("/options", analyticsCinemasController.getCinemaOptions);

export default router;