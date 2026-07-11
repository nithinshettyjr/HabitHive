export const calculateStreak = (completedDates: Date[]): number => {
  if (!completedDates || completedDates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const formatYMD = (d: Date) => {
    const date = new Date(d);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const completedDateStrings = completedDates.map((d) => formatYMD(d));

  const todayStr = formatYMD(today);
  const yesterdayStr = formatYMD(yesterday);

  const hasActiveStreak =
    completedDateStrings.includes(todayStr) ||
    completedDateStrings.includes(yesterdayStr);

  if (!hasActiveStreak) {
    return 0;
  }

  let streak = 0;
  const startFromToday = completedDateStrings.includes(todayStr);
  let currentDate = startFromToday ? new Date(today) : yesterday;

  for (let i = 0; i < 365; i++) {
    const checkStr = formatYMD(currentDate);
    if (completedDateStrings.includes(checkStr)) {
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
