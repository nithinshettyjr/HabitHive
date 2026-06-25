import { Router } from "express";
import {
  createHabit,
  getHabits,
  getHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
  getHabitAnalytics,
} from "../controllers/habitController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);
router.post("/", createHabit);
router.get("/", getHabits);
router.get("/analytics", getHabitAnalytics);
router.get("/:id", getHabit);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);
router.post("/:id/complete", completeHabit);

export default router;
