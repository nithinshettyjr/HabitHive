import { Response } from "express";
import Achievement from "../models/Achievement";
import { AuthRequest } from "../middleware/auth";

export const getAchievements = async (req: AuthRequest, res: Response) => {
  try {
    const achievements = await Achievement.find({ userId: req.userId })
      .sort({ unlockedAt: -1 });

    res.json(achievements);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const unlockAchievement = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, icon } = req.body;

    const achievement = await Achievement.create({
      userId: req.userId,
      title,
      description,
      icon,
    });

    res.status(201).json({ message: "Achievement unlocked", achievement });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
