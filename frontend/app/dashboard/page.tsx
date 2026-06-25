"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import {
  HabitChart,
  StreakChart,
  CompletionChart,
  ConsistencyChart,
} from "@/components/Charts";
import { AchievementGrid } from "@/components/Achievements";
import { FiActivity, FiTrendingUp, FiZap, FiCheckCircle } from "react-icons/fi";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const api = useApi();
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchHabits();
  }, [status, session]);

  const fetchHabits = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getHabits();
      setHabits(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load habits");
    } finally {
      setLoading(false);
    }
  };

  // ── Derived Stats ──────────────────────────────────────────────────────────
  const today = new Date().toDateString();

  const completedToday = habits.filter((h) =>
    (h.completedDates || []).some(
      (cd: string) => new Date(cd).toDateString() === today
    )
  ).length;

  const dailyCompletionPct =
    habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  const weeklyCompletions = habits.reduce((sum, h) => {
    return (
      sum +
      (h.completedDates || []).filter((cd: string) => {
        const diff =
          (Date.now() - new Date(cd).getTime()) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      }).length
    );
  }, 0);
  const weeklyAvg =
    habits.length > 0 ? (weeklyCompletions / 7).toFixed(1) : "0";

  const bestStreak = habits.reduce(
    (best, h) => (h.streak > best.streak ? h : best),
    { name: "—", streak: 0 }
  );

  // ── Auth guards ─────────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    signIn();
    return null;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {session?.user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your habits, visualize your growth, and celebrate your wins.
          </p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  icon: <FiCheckCircle className="text-primary" size={24} />,
                  label: "Today's Completion",
                  value: `${dailyCompletionPct}%`,
                  sub: `${completedToday} / ${habits.length} done`,
                },
                {
                  icon: <FiTrendingUp className="text-secondary" size={24} />,
                  label: "Weekly Avg / Day",
                  value: weeklyAvg,
                  sub: "habits completed",
                },
                {
                  icon: <FiZap className="text-accent" size={24} />,
                  label: "Best Streak",
                  value: `${bestStreak.streak} days`,
                  sub: bestStreak.name,
                },
                {
                  icon: <FiActivity className="text-primary" size={24} />,
                  label: "Total Habits",
                  value: `${habits.length}`,
                  sub: "active",
                },
              ].map((stat, index) => (
                <div key={index} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div>{stat.icon}</div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold truncate">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {stat.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <HabitChart habits={habits} />
              <CompletionChart habits={habits} />
              <StreakChart habits={habits} />
              <ConsistencyChart habits={habits} />
            </div>

            {/* Achievements */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Your Achievements</h2>
              <AchievementGrid />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
