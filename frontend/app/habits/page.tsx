"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { useApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { HabitGrid } from "@/components/HabitGrid";
import { CreateHabitModal } from "@/components/CreateHabitModal";
import { FiPlus, FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function Habits() {
  const { data: session, status } = useSession();
  const api = useApi();

  // Currently viewed month/year
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-indexed

  const [rawHabits, setRawHabits] = useState<any[]>([]); // full habit docs from API
  const [habits, setHabits] = useState<any[]>([]);         // transformed for the grid
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();
  const isFutureMonth =
    viewYear > now.getFullYear() ||
    (viewYear === now.getFullYear() && viewMonth > now.getMonth());

  // ── Fetch raw habits once (or when session changes) ─────────────────────────
  const fetchHabits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getHabits();
      setRawHabits(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to load habits");
    } finally {
      setLoading(false);
    }
  }, [status, session]); // eslint-disable-line

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchHabits();
  }, [status, session]); // eslint-disable-line

  // ── Re-transform whenever viewMonth / viewYear / rawHabits change ────────────
  useEffect(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const transformed = rawHabits.map((h: any) => {
      const completed = Array(daysInMonth).fill(null);
      (h.completedDates || []).forEach((date: string) => {
        const d = new Date(date);
        if (d.getMonth() === viewMonth && d.getFullYear() === viewYear) {
          completed[d.getDate() - 1] = date;
        }
      });
      return {
        id: h._id,
        name: h.name,
        category: h.category,
        color: h.color || "bg-primary",
        streak: h.streak ?? 0,
        target: h.targetPerMonth ?? 30,
        completed,
      };
    });
    setHabits(transformed);
  }, [rawHabits, viewMonth, viewYear]);

  // ── Month navigation ─────────────────────────────────────────────────────────
  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (isFutureMonth) return; // can't go past current month
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const goToCurrentMonth = () => {
    setViewMonth(now.getMonth());
    setViewYear(now.getFullYear());
  };

  // ── CRUD handlers ────────────────────────────────────────────────────────────
  const handleCreateHabit = async (formData: any) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.createHabit(formData);
      const h = res.data.habit;
      setRawHabits((prev) => [...prev, h]);
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create habit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      await api.deleteHabit(habitId);
      setRawHabits((prev) => prev.filter((h) => h._id !== habitId));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete habit");
    }
  };

  const handleToggle = async (habitId: string, dayIndex: number) => {
    try {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return;

      const existingDate = habit.completed[dayIndex];

      if (existingDate) {
        await api.completeHabit(habitId, { date: existingDate, uncomplete: true });
      } else {
        // Build the exact date for the viewed month
        const targetDate = new Date(viewYear, viewMonth, dayIndex + 1, 12, 0, 0);
        await api.completeHabit(habitId, { date: targetDate.toISOString() });
      }
      await fetchHabits();
    } catch (err) {
      console.error("Error saving habit:", err);
    }
  };

  // ── Derived stats ────────────────────────────────────────────────────────────
  const totalCompleted = habits.reduce(
    (sum, h) => sum + h.completed.filter(Boolean).length,
    0
  );
  const daysInViewMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const totalPossible = habits.length * daysInViewMonth;
  const consistencyPct = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  // ── Guards ───────────────────────────────────────────────────────────────────
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
    <div className="min-h-screen bg-habits-pattern dark:bg-dark-pattern bg-cover bg-center bg-fixed bg-no-repeat">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-1">My Habits</h1>
            <p className="text-muted">
              Track your daily habits and build consistency
            </p>
          </div>
          <button
            id="new-habit-btn"
            className="btn-primary flex items-center space-x-2 shrink-0"
            onClick={() => setIsModalOpen(true)}
          >
            <FiPlus /> New Habit
          </button>
        </div>

        {/* ── Month navigator ── */}
        <div className="flex items-center justify-between mb-6 px-4 py-3 rounded-2xl card">
          <button
            id="prev-month-btn"
            onClick={goToPrevMonth}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150
                       text-gray-700 dark:text-gray-200"
          >
            <FiChevronLeft size={18} />
            <span className="hidden sm:inline">
              {MONTH_NAMES[(viewMonth + 11) % 12]}
            </span>
          </button>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-primary" size={16} />
              <span className="text-xl font-bold">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
            </div>
            {!isCurrentMonth && (
              <button
                id="go-to-current-month-btn"
                onClick={goToCurrentMonth}
                className="text-xs text-primary hover:underline font-medium"
              >
                Jump to current month →
              </button>
            )}
            {isCurrentMonth && (
              <span className="text-xs text-green-500 font-medium">● Current month</span>
            )}
          </div>

          <button
            id="next-month-btn"
            onClick={goToNextMonth}
            disabled={isCurrentMonth}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150
                       text-gray-700 dark:text-gray-200
                       disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">
              {MONTH_NAMES[(viewMonth + 1) % 12]}
            </span>
            <FiChevronRight size={18} />
          </button>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted text-lg mb-4">
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
          <HabitGrid habits={habits} onToggle={handleToggle} onDelete={handleDeleteHabit} />
        )}

        {/* ── Monthly stats ── */}
        {habits.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Total Habits",
                value: `${habits.length}`,
                stat: "active",
              },
              {
                title: `Best Streak`,
                value:
                  rawHabits.reduce(
                    (best: any, h: any) => (h.streak > (best.streak ?? 0) ? h : best),
                    rawHabits[0]
                  )?.name ?? "—",
                stat: `${Math.max(0, ...rawHabits.map((h: any) => h.streak ?? 0))} days`,
              },
              {
                title: `${MONTH_NAMES[viewMonth]} Consistency`,
                value: `${consistencyPct}%`,
                stat: `${totalCompleted} / ${totalPossible} check-ins`,
              },
            ].map((item, index) => (
              <div key={index} className="card">
                <p className="text-muted text-sm mb-2">{item.title}</p>
                <h3 className="text-xl font-semibold mb-1 truncate">{item.value}</h3>
                <p className="text-sm font-medium text-primary">{item.stat}</p>
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
