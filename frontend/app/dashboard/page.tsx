"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession, signIn } from "next-auth/react";
import { useApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import {
  HabitChart,
  StreakChart,
  CompletionChart,
  ConsistencyChart,
  HeatmapChart,
} from "@/components/Charts";
import { AchievementGrid } from "@/components/Achievements";
import {
  FiActivity, FiTrendingUp, FiZap, FiCheckCircle,
  FiStar, FiAward, FiCpu,
} from "react-icons/fi";
import Link from "next/link";

// ── XP / Level system ────────────────────────────────────────────────────────
function computeXP(habits: any[]): number {
  let xp = 0;
  const now = new Date();
  habits.forEach((h) => {
    // +10 XP per completion
    xp += (h.completedDates?.length ?? 0) * 10;
    // +50 XP per streak day
    xp += (h.streak ?? 0) * 50;
    // +20 XP per habit created
    xp += 20;
  });
  return xp;
}

interface LevelInfo { level: number; title: string; emoji: string; minXP: number; maxXP: number }
const LEVELS: LevelInfo[] = [
  { level: 1,  title: "Seedling",      emoji: "🌱", minXP: 0,     maxXP: 500   },
  { level: 2,  title: "Sprout",        emoji: "🌿", minXP: 500,   maxXP: 1500  },
  { level: 3,  title: "Grower",        emoji: "🌳", minXP: 1500,  maxXP: 3000  },
  { level: 4,  title: "Achiever",      emoji: "⭐", minXP: 3000,  maxXP: 5000  },
  { level: 5,  title: "Warrior",       emoji: "⚔️", minXP: 5000,  maxXP: 8000  },
  { level: 6,  title: "Champion",      emoji: "🏆", minXP: 8000,  maxXP: 12000 },
  { level: 7,  title: "Legend",        emoji: "🔥", minXP: 12000, maxXP: 18000 },
  { level: 8,  title: "Mythic",        emoji: "💎", minXP: 18000, maxXP: 25000 },
  { level: 9,  title: "Grandmaster",   emoji: "👑", minXP: 25000, maxXP: 35000 },
  { level: 10, title: "Habit God",     emoji: "🌟", minXP: 35000, maxXP: 35000 },
];

function getLevelInfo(xp: number): LevelInfo & { pct: number } {
  const info = [...LEVELS].reverse().find((l) => xp >= l.minXP) ?? LEVELS[0];
  const range = info.maxXP - info.minXP;
  const pct = info.level === 10 ? 100 : Math.min(100, Math.round(((xp - info.minXP) / range) * 100));
  return { ...info, pct };
}

// ── AI morning message ────────────────────────────────────────────────────────
function getMorningMessage(habits: any[], name: string): string {
  if (!habits.length) return `Welcome, ${name}! Add your first habit to start your journey. 🚀`;

  const now = new Date();
  const today = now.toDateString();
  const completedToday = habits.filter((h) =>
    (h.completedDates || []).some((cd: string) => new Date(cd).toDateString() === today)
  ).length;

  const maxStreak = Math.max(0, ...habits.map((h) => h.streak ?? 0));
  const streakHabit = habits.find((h) => (h.streak ?? 0) === maxStreak);

  // Last week completions
  const weekTotal = habits.reduce((s, h) => s + (h.completedDates || []).filter((cd: string) => {
    const diff = (Date.now() - new Date(cd).getTime()) / 86400000;
    return diff <= 7;
  }).length, 0);
  const weekPct = habits.length > 0 ? Math.round((weekTotal / (habits.length * 7)) * 100) : 0;

  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (maxStreak >= 3 && streakHabit)
    return `${greeting}, ${name}! 🔥 You're ${maxStreak} days into your "${streakHabit.name}" streak — don't break it today!`;
  if (completedToday > 0)
    return `${greeting}, ${name}! ✅ You've already completed ${completedToday}/${habits.length} habit${habits.length > 1 ? "s" : ""} today. Keep the momentum!`;
  if (weekPct >= 80)
    return `${greeting}, ${name}! 📈 You completed ${weekPct}% of your habits last week — outstanding consistency!`;
  if (weekPct > 0)
    return `${greeting}, ${name}! Your ${weekPct}% completion last week shows real progress. Let's push higher today!`;
  return `${greeting}, ${name}! Every habit you complete today is an investment in tomorrow's you. Let's go! 💪`;
}

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

  // ── Derived Stats ────────────────────────────────────────────────────────────
  const today = new Date().toDateString();
  const completedToday = habits.filter((h) =>
    (h.completedDates || []).some((cd: string) => new Date(cd).toDateString() === today)
  ).length;
  const dailyCompletionPct = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  const weeklyCompletions = habits.reduce((sum, h) =>
    sum + (h.completedDates || []).filter((cd: string) => {
      const diff = (Date.now() - new Date(cd).getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }).length, 0);
  const weeklyAvg = habits.length > 0 ? (weeklyCompletions / 7).toFixed(1) : "0";

  const bestStreak = habits.reduce((best, h) => (h.streak > best.streak ? h : best), { name: "—", streak: 0 });

  // XP / Level
  const xp = useMemo(() => computeXP(habits), [habits]);
  const levelInfo = useMemo(() => getLevelInfo(xp), [xp]);

  // AI Message
  const aiMessage = useMemo(
    () => getMorningMessage(habits, session?.user?.name?.split(" ")[0] ?? "there"),
    [habits, session]
  );

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );
  if (status === "unauthenticated") { signIn(); return null; }

  return (
    <div className="min-h-screen bg-dashboard-pattern dark:bg-dark-pattern bg-cover bg-center bg-fixed bg-no-repeat">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── AI Greeting Banner ── */}
        <div
          className="rounded-2xl p-5 mb-8 flex items-start gap-4"
          style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 60%, #EC4899 100%)" }}
        >
          <div className="bg-white/20 rounded-xl p-2 flex-shrink-0 mt-0.5">
            <FiCpu className="text-white" size={22} />
          </div>
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-0.5">AI Coach</p>
            <p className="text-white font-semibold text-base leading-snug">{aiMessage}</p>
          </div>
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
            {/* ── Quick Stats ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: <FiCheckCircle className="text-primary" size={24} />, label: "Today's Completion", value: `${dailyCompletionPct}%`, sub: `${completedToday} / ${habits.length} done` },
                { icon: <FiTrendingUp className="text-secondary" size={24} />, label: "Weekly Avg / Day", value: weeklyAvg, sub: "habits completed" },
                { icon: <FiZap className="text-accent" size={24} />, label: "Best Streak", value: `${bestStreak.streak} days`, sub: bestStreak.name },
                { icon: <FiActivity className="text-primary" size={24} />, label: "Total Habits", value: `${habits.length}`, sub: "active" },
              ].map((stat, i) => (
                <div key={i} className="card">
                  <div className="flex items-start justify-between mb-3"><div>{stat.icon}</div></div>
                  <p className="text-muted text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold truncate text-heading">{stat.value}</p>
                  <p className="text-xs text-muted mt-1 truncate">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* ── XP / Level Card ── */}
            <div className="card mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="text-5xl">{levelInfo.emoji}</div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <span className="font-bold text-xl text-heading">{levelInfo.title}</span>
                      <span className="ml-2 text-sm text-muted">Level {levelInfo.level}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-primary">{xp.toLocaleString()} XP</span>
                      {levelInfo.level < 10 && (
                        <p className="text-xs text-gray-400">{levelInfo.maxXP.toLocaleString()} to next</p>
                      )}
                    </div>
                  </div>
                  <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${levelInfo.pct}%`,
                        background: "linear-gradient(90deg, #4F46E5, #EC4899)",
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted">
                    <span>Level {levelInfo.level}</span>
                    <span>{levelInfo.pct}% to Level {Math.min(levelInfo.level + 1, 10)}</span>
                  </div>
                  <p className="text-xs text-muted mt-2">
                    Earn XP: +10 per completion · +50 per streak day · +20 per habit created
                  </p>
                </div>
              </div>

              {/* XP breakdown */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
                {[
                  { label: "From Completions", value: habits.reduce((s, h) => s + (h.completedDates?.length ?? 0), 0) * 10 },
                  { label: "From Streaks", value: habits.reduce((s, h) => s + (h.streak ?? 0) * 50, 0) },
                  { label: "From Habits Created", value: habits.length * 20 },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <p className="text-sm font-bold text-primary">{item.value.toLocaleString()}</p>
                    <p className="text-xs text-muted">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Heatmap ── */}
            <div className="mb-8">
              <HeatmapChart habits={habits} />
            </div>

            {/* ── Charts ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <HabitChart habits={habits} />
              <CompletionChart habits={habits} />
              <StreakChart habits={habits} />
              <ConsistencyChart habits={habits} />
            </div>

            {/* ── Quick Links ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Habit Library", icon: "📚", href: "/library", desc: "Ready-made plans" },
                { label: "Analytics", icon: "📊", href: "/analytics", desc: "Deep insights + heatmap" },
                { label: "Suggestions", icon: "🤖", href: "/suggestions", desc: "AI coach + tips" },
                { label: "Achievements", icon: "🏆", href: "/achievements", desc: "Unlock milestones" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="card hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-center group"
                >
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <p className="font-bold text-sm group-hover:text-primary transition-colors text-heading">{item.label}</p>
                  <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                </Link>
              ))}
            </div>

            {/* ── Achievements ── */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your Achievements</h2>
                <Link href="/achievements" className="text-sm text-primary hover:underline font-medium">View all →</Link>
              </div>
              <AchievementGrid />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
