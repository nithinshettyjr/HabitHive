"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { HabitGrid } from "@/components/HabitGrid";
import { CreateHabitModal } from "@/components/CreateHabitModal";
import { FiPlus } from "react-icons/fi";

export default function Habits() {
  const { data: session, status } = useSession();
  const api = useApi();
  const [habits, setHabits] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

      const transformedHabits = res.data.map((h: any) => {
        const completed = Array(daysInMonth).fill(false);
        (h.completedDates || []).forEach((date: string) => {
          const d = new Date(date);
          const now = new Date();
          if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
            completed[d.getDate() - 1] = true;
          }
        });

        return {
          id: h._id,
          name: h.name,
          category: h.category,
          color: h.color ? h.color : "bg-primary",
          streak: h.streak ?? 0,
          target: h.targetPerMonth ?? 30,
          completed,
        };
      });

      setHabits(transformedHabits);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to load habits");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHabit = async (formData: any) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.createHabit(formData);
      const h = res.data.habit;
      setHabits((prev) => [
        ...prev,
        {
          id: h._id,
          name: h.name,
          category: h.category,
          color: h.color ? h.color : "bg-primary",
          streak: 0,
          target: h.targetPerMonth ?? 30,
          completed: Array(30).fill(false),
        },
      ]);
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create habit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (habitId: string, dayIndex: number) => {
    try {
      const currentDate = new Date();
      currentDate.setDate(dayIndex + 1);

      await api.completeHabit(habitId, { date: currentDate });
      await fetchHabits();
    } catch (error) {
      console.error("Error saving habit:", error);
    }
  };

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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Habits</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your daily habits and build consistency
            </p>
          </div>
          <div className="flex gap-4">
            <button
              id="new-habit-btn"
              className="btn-primary flex items-center space-x-2"
              onClick={() => setIsModalOpen(true)}
            >
              <FiPlus /> New Habit
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No habits yet. Create your first one!
            </p>
            <button
              className="btn-primary inline-flex items-center space-x-2"
              onClick={() => setIsModalOpen(true)}
            >
              <FiPlus /> Add Habit
            </button>
          </div>
        ) : (
          <HabitGrid habits={habits} onToggle={handleToggle} />
        )}

        {habits.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Total Habits",
                value: `${habits.length}`,
                stat: "active",
              },
              {
                title: "Best Streak",
                value:
                  habits.reduce(
                    (best, h) => (h.streak > best.streak ? h : best),
                    habits[0]
                  )?.name ?? "—",
                stat: `${Math.max(...habits.map((h) => h.streak))} days`,
              },
              {
                title: "This Month",
                value: `${habits.filter((h) => h.completed.filter(Boolean).length > 0).length}/${habits.length} habits`,
                stat: `${Math.round(
                  (habits.reduce(
                    (sum, h) => sum + h.completed.filter(Boolean).length,
                    0
                  ) /
                    (habits.length * 30)) *
                  100
                )}% complete`,
              },
            ].map((item, index) => (
              <div key={index} className="card">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  {item.title}
                </p>
                <h3 className="text-lg font-semibold mb-1">{item.value}</h3>
                <p className="text-2xl font-bold text-primary">{item.stat}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateHabit}
        submitting={submitting}
      />
    </div>
  );
}
