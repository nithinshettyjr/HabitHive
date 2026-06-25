import { Router } from "express";
import {
  getAchievements,
  unlockAchievement,
} from "../controllers/achievementController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);
router.get("/", getAchievements);
router.post("/", unlockAchievement);

export default router;
