export const calculateStreak = (completedDates: Date[]): number => {
  if (completedDates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const isCompleted = completedDates.some(
      (d) => new Date(d).toISOString().split("T")[0] === dateStr
    );

    if (!isCompleted && streak === 0) {
      // If today is not completed and we haven't started counting, move to yesterday
      currentDate.setDate(currentDate.getDate() - 1);
      continue;
    }

    if (isCompleted) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export const getCompletionPercentage = (
  completedDates: Date[],
  targetPerMonth: number
): number => {
  return Math.min((completedDates.length / targetPerMonth) * 100, 100);
};

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getDaysInMonth = (date: Date = new Date()): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getMonthName = (date: Date = new Date()): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};

export const calculateAverageCompletion = (habits: any[]): number => {
  if (habits.length === 0) return 0;

  const totalCompletion = habits.reduce((sum, habit) => {
    return sum + getCompletionPercentage(habit.completedDates, habit.targetPerMonth);
  }, 0);

  return Math.round(totalCompletion / habits.length);
};

export const getTopHabits = (habits: any[], limit: number = 5): any[] => {
  return habits
    .sort((a, b) => calculateStreak(b.completedDates) - calculateStreak(a.completedDates))
    .slice(0, limit);
};
