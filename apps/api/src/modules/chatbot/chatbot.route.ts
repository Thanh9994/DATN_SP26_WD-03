import { Router } from "express";
import { ChatbotController } from "./chatbot.controller";

const router = Router();

// Public routes
router.post("/chat", ChatbotController.chat);
router.get("/", ChatbotController.getAll);

// Admin routes
router.post("/create", ChatbotController.create);
router.get("/:id", ChatbotController.getOne);
router.put("/:id", ChatbotController.update);
router.delete("/:id", ChatbotController.delete);
router.patch("/:id/toggle", ChatbotController.toggleStatus);

export default router;