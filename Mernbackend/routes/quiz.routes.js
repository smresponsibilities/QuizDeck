import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createQuizHandler,saveQuizHandler } from "../controllers/quiz.controller.js";

const router = Router();

router.post("/createquiz", authMiddleware, createQuizHandler);
router.post("/savequiz", authMiddleware, createQuizHandler);

export default router;
