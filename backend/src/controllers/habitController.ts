import { Response } from "express";
import Habit from "../models/Habit";
import { AuthRequest } from "../middleware/auth";

const calculateStreak = (completedDates: Date[]): number => {
  if (!completedDates || completedDates.length === 0) return 0;

  const completedDateStrings = new Set<string>();
  completedDates.forEach((d) => {
    const date = new Date(d);
    // Format local YYYY-MM-DD
    const localStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    completedDateStrings.add(localStr);

    // Format UTC YYYY-MM-DD
    const utcStr = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
    completedDateStrings.add(utcStr);
  });

  const today = new Date();
  
  // Check if today or yesterday is completed to make sure streak is active
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const todayUtcStr = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, '0')}-${String(today.getUTCDate()).padStart(2, '0')}`;
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  const yesterdayUtcStr = `${yesterday.getUTCFullYear()}-${String(yesterday.getUTCMonth() + 1).padStart(2, '0')}-${String(yesterday.getUTCDate()).padStart(2, '0')}`;

  const hasActiveStreak =
    completedDateStrings.has(todayStr) ||
    completedDateStrings.has(todayUtcStr) ||
    completedDateStrings.has(yesterdayStr) ||
    completedDateStrings.has(yesterdayUtcStr);

  if (!hasActiveStreak) {
    return 0;
  }

  let streak = 0;
  const startFromToday = completedDateStrings.has(todayStr) || completedDateStrings.has(todayUtcStr);
  let currentDate = startFromToday ? new Date(today) : yesterday;

  for (let i = 0; i < 365; i++) {
    const localCheck = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    const utcCheck = `${currentDate.getUTCFullYear()}-${String(currentDate.getUTCMonth() + 1).padStart(2, '0')}-${String(currentDate.getUTCDate()).padStart(2, '0')}`;

    if (completedDateStrings.has(localCheck) || completedDateStrings.has(utcCheck)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

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
    const { date, uncomplete } = req.body;

    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    if (uncomplete) {
      const targetDate = new Date(date);
      habit.completedDates = habit.completedDates.filter((d) => {
        const itemDate = new Date(d);
        const match =
          (itemDate.getFullYear() === targetDate.getFullYear() &&
            itemDate.getMonth() === targetDate.getMonth() &&
            itemDate.getDate() === targetDate.getDate()) ||
          (itemDate.getUTCFullYear() === targetDate.getUTCFullYear() &&
            itemDate.getUTCMonth() === targetDate.getUTCMonth() &&
            itemDate.getUTCDate() === targetDate.getUTCDate()) ||
          itemDate.getTime() === targetDate.getTime();
        return !match;
      });
      habit.markModified("completedDates");
    } else {
      const targetDate = new Date(date);
      const exists = habit.completedDates.some((d) => {
        const itemDate = new Date(d);
        return (
          (itemDate.getFullYear() === targetDate.getFullYear() &&
            itemDate.getMonth() === targetDate.getMonth() &&
            itemDate.getDate() === targetDate.getDate()) ||
          (itemDate.getUTCFullYear() === targetDate.getUTCFullYear() &&
            itemDate.getUTCMonth() === targetDate.getUTCMonth() &&
            itemDate.getUTCDate() === targetDate.getUTCDate()) ||
          itemDate.getTime() === targetDate.getTime()
        );
      });

      if (!exists) {
        habit.completedDates.push(targetDate);
        habit.markModified("completedDates");
      }
    }

    // Recalculate streak
    habit.streak = calculateStreak(habit.completedDates);

    await habit.save();

    res.json({
      message: uncomplete ? "Habit uncompleted" : "Habit completed",
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
