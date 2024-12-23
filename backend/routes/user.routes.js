import { Router } from "express";
import { signin, signup } from "../controllers/user.controller.js";
 import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);



export default router;
