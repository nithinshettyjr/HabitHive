"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { FiPlus, FiCheck, FiBook, FiHeart, FiZap, FiTarget } from "react-icons/fi";

// ── Habit plan library ────────────────────────────────────────────────────────

interface HabitPlan {
  id: string;
  title: string;
  emoji: string;
  description: string;
  category: string;
  color: string;
  duration: string;
  habits: Array<{
    name: string;
    category: "Health" | "Fitness" | "Learning" | "Productivity" | "Finance" | "Mindfulness" | "Custom";
    description: string;
    color: string;
    targetPerMonth: number;
  }>;
}

const PLANS: HabitPlan[] = [
  {
    id: "morning-routine",
    title: "Morning Routine",
    emoji: "🌅",
    description: "Build a powerful morning routine that sets you up for success every day.",
    category: "Productivity",
    color: "#F59E0B",
    duration: "30 days",
    habits: [
      { name: "Wake up at 6 AM", category: "Productivity", description: "Consistent early wake-up", color: "#F59E0B", targetPerMonth: 30 },
      { name: "10-min meditation", category: "Mindfulness", description: "Start with calm focus", color: "#8B5CF6", targetPerMonth: 30 },
      { name: "Exercise 30 min", category: "Fitness", description: "Morning workout", color: "#22C55E", targetPerMonth: 30 },
      { name: "Healthy breakfast", category: "Health", description: "No skipping breakfast", color: "#EF4444", targetPerMonth: 30 },
    ],
  },
  {
    id: "fitness-30",
    title: "30-Day Fitness",
    emoji: "🏋️",
    description: "Transform your body in 30 days with consistent exercise and healthy habits.",
    category: "Fitness",
    color: "#22C55E",
    duration: "30 days",
    habits: [
      { name: "Walk 8,000 steps", category: "Fitness", description: "Daily step goal", color: "#22C55E", targetPerMonth: 30 },
      { name: "Workout 45 min", category: "Fitness", description: "Strength or cardio", color: "#4F46E5", targetPerMonth: 25 },
      { name: "Drink 3L water", category: "Health", description: "Stay fully hydrated", color: "#06B6D4", targetPerMonth: 30 },
      { name: "Sleep 8 hours", category: "Health", description: "Recovery is key", color: "#8B5CF6", targetPerMonth: 30 },
    ],
  },
  {
    id: "weight-loss",
    title: "Weight Loss Plan",
    emoji: "⚖️",
    description: "Evidence-based habits to help you lose weight sustainably.",
    category: "Health",
    color: "#EF4444",
    duration: "60 days",
    habits: [
      { name: "No junk food", category: "Health", description: "Avoid processed foods", color: "#EF4444", targetPerMonth: 30 },
      { name: "Drink 3L water", category: "Health", description: "Curb hunger naturally", color: "#06B6D4", targetPerMonth: 30 },
      { name: "Walk 10,000 steps", category: "Fitness", description: "Daily movement", color: "#22C55E", targetPerMonth: 30 },
      { name: "No late-night eating", category: "Health", description: "Stop eating by 8PM", color: "#F59E0B", targetPerMonth: 30 },
    ],
  },
  {
    id: "meditation-21",
    title: "21-Day Meditation",
    emoji: "🧘",
    description: "Build a mindfulness practice in just 21 days — proven to reduce stress and improve focus.",
    category: "Mindfulness",
    color: "#8B5CF6",
    duration: "21 days",
    habits: [
      { name: "Morning meditation", category: "Mindfulness", description: "5–15 min focused breathing", color: "#8B5CF6", targetPerMonth: 21 },
      { name: "Digital detox 1hr", category: "Mindfulness", description: "No screens before sleep", color: "#EC4899", targetPerMonth: 21 },
      { name: "Gratitude journaling", category: "Mindfulness", description: "Write 3 things grateful for", color: "#F59E0B", targetPerMonth: 21 },
    ],
  },
  {
    id: "coding-challenge",
    title: "Coding Challenge",
    emoji: "💻",
    description: "Level up your programming skills with daily coding practice.",
    category: "Learning",
    color: "#4F46E5",
    duration: "30 days",
    habits: [
      { name: "Code 1 hour daily", category: "Learning", description: "Consistent daily practice", color: "#4F46E5", targetPerMonth: 30 },
      { name: "Solve 1 LeetCode", category: "Productivity", description: "Problem-solving skills", color: "#22C55E", targetPerMonth: 30 },
      { name: "Read tech articles", category: "Learning", description: "Stay up to date", color: "#8B5CF6", targetPerMonth: 20 },
    ],
  },
  {
    id: "financial-health",
    title: "Financial Health",
    emoji: "💰",
    description: "Build wealth through consistent saving and spending awareness.",
    category: "Finance",
    color: "#10B981",
    duration: "30 days",
    habits: [
      { name: "Save ₹100/day", category: "Finance", description: "Daily savings habit", color: "#10B981", targetPerMonth: 30 },
      { name: "Track expenses", category: "Finance", description: "Log every purchase", color: "#F59E0B", targetPerMonth: 30 },
      { name: "No impulse buying", category: "Finance", description: "24hr rule before purchases", color: "#EF4444", targetPerMonth: 30 },
    ],
  },
  {
    id: "reading-habit",
    title: "Reading Habit",
    emoji: "📚",
    description: "Become a consistent reader and expand your knowledge daily.",
    category: "Learning",
    color: "#F59E0B",
    duration: "30 days",
    habits: [
      { name: "Read 20 pages", category: "Learning", description: "Daily reading goal", color: "#F59E0B", targetPerMonth: 30 },
      { name: "Book summary note", category: "Learning", description: "Retain what you read", color: "#4F46E5", targetPerMonth: 15 },
      { name: "No social media AM", category: "Mindfulness", description: "Replace scroll with books", color: "#8B5CF6", targetPerMonth: 30 },
    ],
  },
  {
    id: "sleep-better",
    title: "Better Sleep",
    emoji: "😴",
    description: "Optimize your sleep for better energy, mood and performance.",
    category: "Health",
    color: "#6366F1",
    duration: "21 days",
    habits: [
      { name: "Sleep by 10:30 PM", category: "Health", description: "Consistent sleep time", color: "#6366F1", targetPerMonth: 21 },
      { name: "No screens 30min before", category: "Mindfulness", description: "Blue light blocks melatonin", color: "#8B5CF6", targetPerMonth: 21 },
      { name: "Wind-down routine", category: "Mindfulness", description: "Read or stretch before bed", color: "#22C55E", targetPerMonth: 21 },
    ],
  },
];

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  Fitness: <FiZap />,
  Health: <FiHeart />,
  Learning: <FiBook />,
  Productivity: <FiTarget />,
  Finance: <span>💰</span>,
  Mindfulness: <span>🧘</span>,
  Custom: <FiTarget />,
};

const ALL_CATEGORIES = ["All", "Health", "Fitness", "Learning", "Productivity", "Finance", "Mindfulness"];

export default function LibraryPage() {
  const { data: session, status } = useSession();
  const api = useApi();
  const [adding, setAdding] = useState<string | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [loadingCheck, setLoadingCheck] = useState(true);  // initial fetch
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  // ── On mount: fetch existing habits and detect already-added plans ──────────
  useEffect(() => {
    if (status !== "authenticated") return;
    (async () => {
      try {
        const res = await api.getHabits();
        const existingNames = new Set<string>(
          (res.data as any[]).map((h) => h.name.toLowerCase().trim())
        );
        // A plan is "already added" if ALL its habits exist by name
        const preAdded = new Set<string>();
        PLANS.forEach((plan) => {
          const allPresent = plan.habits.every((h) =>
            existingNames.has(h.name.toLowerCase().trim())
          );
          if (allPresent) preAdded.add(plan.id);
        });
        setAdded(preAdded);
      } catch {
        // silently ignore — user can still add plans
      } finally {
        setLoadingCheck(false);
      }
    })();
  }, [status, session]); // eslint-disable-line

  const handleAddPlan = async (plan: HabitPlan) => {
    setAdding(plan.id);
    setError(null);
    try {
      await Promise.all(
        plan.habits.map((h) =>
          api.createHabit({
            name: h.name,
            category: h.category,
            description: h.description,
            color: h.color,
            targetPerMonth: h.targetPerMonth,
          })
        )
      );
      setAdded((prev) => new Set([...prev, plan.id]));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add plan. Are you signed in?");
    } finally {
      setAdding(null);
    }
  };

  const filtered = filter === "All" ? PLANS : PLANS.filter((p) => p.category === filter);

  if (status === "loading" || loadingCheck) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <p className="text-sm text-muted">Checking your habits…</p>
      </div>
    </div>
  );
  if (status === "unauthenticated") { signIn(); return null; }

  return (
    <div className="min-h-screen bg-habits-pattern dark:bg-dark-pattern bg-cover bg-center bg-fixed bg-no-repeat">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">📚 Habit Library</h1>
          <p className="text-muted">
            Ready-made habit plans curated by experts — add an entire plan with one click.
          </p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Category filter tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 ${
                filter === cat
                  ? "bg-primary text-white shadow"
                  : "bg-gray-100 dark:bg-card text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((plan) => {
            const isAdded = added.has(plan.id);
            const isAdding = adding === plan.id;
            const isExpanded = expandedPlan === plan.id;

            return (
              <div
                key={plan.id}
                className="card flex flex-col gap-4 hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
              >
                {/* Plan header */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: plan.color + "22" }}
                  >
                    {plan.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h3 className="font-bold text-lg leading-tight">{plan.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 font-medium">
                        {plan.category}
                      </span>
                      <span>⏱ {plan.duration}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted leading-relaxed">
                  {plan.description}
                </p>

                {/* Habit list toggle */}
                <button
                  onClick={() => setExpandedPlan(isExpanded ? null : plan.id)}
                  className="text-xs text-primary hover:underline text-left font-medium"
                >
                  {isExpanded ? "▲ Hide habits" : `▼ See ${plan.habits.length} habits included`}
                </button>

                {isExpanded && (
                  <div className="space-y-2 bg-gray-50 dark:bg-card/50 rounded-xl p-3">
                    {plan.habits.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: h.color }} />
                        <span className="font-medium text-heading">{h.name}</span>
                        <span className="text-xs text-gray-400 ml-auto">{h.targetPerMonth}d/mo</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add button */}
                <button
                  id={`add-plan-${plan.id}`}
                  onClick={() => !isAdded && handleAddPlan(plan)}
                  disabled={isAdding || isAdded}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-150 ${
                    isAdded
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 cursor-default border border-green-300 dark:border-green-700"
                      : isAdding
                      ? "bg-primary/60 text-white cursor-wait"
                      : "bg-primary hover:bg-primary/90 active:scale-95 text-white"
                  }`}
                >
                  {isAdded ? (
                    <><FiCheck size={15} /> Already Added</>  
                  ) : isAdding ? (
                    <><span className="inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Adding…</>
                  ) : (
                    <><FiPlus size={15} /> Add This Plan</>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted">
            No plans in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}
