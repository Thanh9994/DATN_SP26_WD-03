import { Router } from "express";
import TestModel from "./Test.model";

const router = Router();

/**
 * GET /api/test
 * kiểm tra server sống
 */
router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "API is running"
  });
});

/**
 * POST /api/test
 * ghi dữ liệu test vào Mongo
 */
router.post("/", async (_req, res) => {
  const doc = await TestModel.create({
    message: "Hello Mongo Compass"
  });

  res.json(doc);
});

export default router;
