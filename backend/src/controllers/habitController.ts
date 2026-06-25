import { Response } from "express";
import Habit from "../models/Habit";
import { AuthRequest } from "../middleware/auth";

export const createHabit = async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, description, color, targetPerMonth } = req.body;

    const habit = await Habit.create({
      userId: req.userId,
      name,
      category,
      description,
      color,
      targetPerMonth,
    });

    res.status(201).json({ message: "Habit created", habit });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getHabits = async (req: AuthRequest, res: Response) => {
  try {
    const habits = await Habit.find({ userId: req.userId });
    res.json(habits);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getHabit = async (req: AuthRequest, res: Response) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.json(habit);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHabit = async (req: AuthRequest, res: Response) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.json({ message: "Habit updated", habit });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteHabit = async (req: AuthRequest, res: Response) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.json({ message: "Habit deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const completeHabit = async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.body;

    const habit = await Habit.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      {
        $addToSet: {
          completedDates: new Date(date),
        },
      },
      {
        new: true,
      }
    );

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    res.json({
      message: "Habit completed",
      habit,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getHabitAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const habits = await Habit.find({ userId: req.userId });

    const analytics = {
      totalHabits: habits.length,
      averageStreak: habits.reduce((sum, h) => sum + h.streak, 0) / habits.length || 0,
      totalCompletions: habits.reduce((sum, h) => sum + h.completedDates.length, 0),
      topHabits: habits
        .sort((a, b) => b.streak - a.streak)
        .slice(0, 5),
    };

    res.json(analytics);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
