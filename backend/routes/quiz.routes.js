import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createQuizHandler,
  getQuizHandler,
} from "../controllers/quiz.controller.js";

const router = Router();

router.post("/createquiz", authMiddleware, createQuizHandler);
router.get("/user", authMiddleware, getQuizHandler);

export default router;
