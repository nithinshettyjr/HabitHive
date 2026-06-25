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
  CategoryChart,
} from "@/components/Charts";
import { FiDownload, FiTrendingUp, FiCheckCircle, FiAward, FiActivity } from "react-icons/fi";

export default function Analytics() {
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
      const daysInMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ).getDate();

      const transformedHabits = res.data.map((habit: any) => {
        const completed = Array(daysInMonth).fill(false);
        (habit.completedDates || []).forEach((date: string) => {
          const d = new Date(date);
          const now = new Date();
          if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
            completed[d.getDate() - 1] = true;
          }
        });

        return {
          ...habit,
          completed,
        };
      });

      setHabits(transformedHabits);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to load analytics data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Derived Metrics ────────────────────────────────────────────────────────
  const today = new Date().toDateString();

  const completedToday = habits.filter((h) =>
    (h.completedDates || []).some(
      (cd: string) => new Date(cd).toDateString() === today
    )
  ).length;

  const completionPct =
    habits.length > 0
      ? Math.round((completedToday / habits.length) * 100)
      : 0;

  const totalCompletions = habits.reduce(
    (sum, h) => sum + (h.completedDates?.length ?? 0),
    0
  );

  const bestStreak = habits.reduce(
    (best, h) => (h.streak > best.streak ? h : best),
    { name: "—", streak: 0 }
  );

  const weeklyCompletions = habits.reduce((sum, h) => {
    return (
      sum +
      (h.completedDates || []).filter((cd: string) => {
        const diff = (Date.now() - new Date(cd).getTime()) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      }).length
    );
  }, 0);
  const weeklyAvg =
    habits.length > 0 ? (weeklyCompletions / 7).toFixed(1) : "0";

  const topHabits = [...habits]
    .map((h) => ({
      name: h.name,
      completion: Math.min(
        100,
        Math.round(
          ((h.completedDates?.length ?? 0) / Math.max(h.targetPerMonth, 1)) * 100
        )
      ),
      streak: h.streak ?? 0,
      category: h.category,
    }))
    .sort((a, b) => b.completion - a.completion)
    .slice(0, 5);

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your real habit performance — derived from your actual data
            </p>
          </div>
          <button
            className="btn-primary flex items-center space-x-2"
            onClick={() => window.print()}
          >
            <FiDownload /> Export Report
          </button>
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
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  icon: <FiCheckCircle className="text-primary" size={20} />,
                  label: "Today's Completion",
                  value: `${completionPct}%`,
                  sub: `${completedToday} / ${habits.length} habits`,
                },
                {
                  icon: <FiActivity className="text-secondary" size={20} />,
                  label: "Weekly Avg / Day",
                  value: weeklyAvg,
                  sub: "habits completed",
                },
                {
                  icon: <FiTrendingUp className="text-accent" size={20} />,
                  label: "Total Completions",
                  value: totalCompletions.toLocaleString(),
                  sub: "all time",
                },
                {
                  icon: <FiAward className="text-yellow-500" size={20} />,
                  label: "Best Streak",
                  value: bestStreak.name,
                  sub: `${bestStreak.streak} days`,
                },
              ].map((metric, index) => (
                <div key={index} className="card">
                  <div className="flex items-center gap-2 mb-2">
                    {metric.icon}
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {metric.label}
                    </p>
                  </div>
                  <p className="text-2xl font-bold mb-1 truncate">{metric.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{metric.sub}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <HabitChart habits={habits} />
              <CompletionChart habits={habits} />
              <ConsistencyChart habits={habits} />
              <StreakChart habits={habits} />
              <div className="lg:col-span-2">
                <CategoryChart habits={habits} />
              </div>
            </div>

            {/* Top Habits */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Top Performing Habits</h2>
              {topHabits.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No habits yet. Create habits and start tracking to see your top performers!
                </p>
              ) : (
                <div className="space-y-4">
                  {topHabits.map((habit, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between pb-4 border-b dark:border-gray-700 last:border-b-0"
                    >
                      <div>
                        <p className="font-semibold">{habit.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {habit.category} · {habit.streak} day streak
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-secondary">
                          {habit.completion}%
                        </p>
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                          <div
                            className="bg-secondary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${habit.completion}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
