"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSession, signIn } from "next-auth/react";
import { useApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import {
  FiZap, FiTrendingUp, FiTrendingDown, FiStar, FiHeart,
  FiSun, FiMoon, FiRefreshCw, FiAward, FiTarget, FiAlertCircle,
  FiChevronLeft, FiChevronRight, FiPause, FiPlay,
} from "react-icons/fi";

// ── Static content pools ──────────────────────────────────────────────────────

const MOTIVATIONAL_QUOTES = [
  { quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { quote: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { quote: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { quote: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { quote: "The chains of habit are too light to be felt until they are too heavy to be broken.", author: "Warren Buffett" },
  { quote: "It's not about having time. It's about making time.", author: "Unknown" },
  { quote: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { quote: "A year from now you'll wish you had started today.", author: "Karen Lamb" },
  { quote: "Don't count the days — make the days count.", author: "Muhammad Ali" },
  { quote: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { quote: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
];

const HEALTHY_TIPS = [
  { icon: "💧", title: "Stay Hydrated", tip: "Drink at least 8 glasses of water daily. Hydration boosts focus, energy and mood by up to 20%.", category: "Health" },
  { icon: "🌅", title: "Morning Sunlight", tip: "Get 10–15 minutes of sunlight within an hour of waking. It resets your circadian rhythm and improves sleep quality.", category: "Wellness" },
  { icon: "🧘", title: "2-Minute Meditation", tip: "Even 2 minutes of deep breathing reduces cortisol levels. Try box breathing: inhale 4s, hold 4s, exhale 4s.", category: "Mindfulness" },
  { icon: "🚶", title: "Move Every Hour", tip: "Set a reminder to stand and walk for 2 minutes every hour. Sitting for prolonged periods raises cardiovascular risk.", category: "Fitness" },
  { icon: "😴", title: "Prioritise Sleep", tip: "Aim for 7–9 hours. Sleep debt accumulates and compounds — even one night of poor sleep reduces cognitive performance by 25%.", category: "Health" },
  { icon: "🥦", title: "Eat the Rainbow", tip: "Include 5 different colored fruits/vegetables daily. Each color signals different antioxidants your body needs.", category: "Nutrition" },
  { icon: "📵", title: "Screen-Free Wind Down", tip: "Put screens away 30 minutes before bed. Blue light suppresses melatonin by up to 50%, making it harder to fall asleep.", category: "Wellness" },
  { icon: "📓", title: "Gratitude Practice", tip: "Write 3 things you're grateful for each night. Studies show this increases long-term wellbeing and reduces anxiety.", category: "Mindfulness" },
  { icon: "🎯", title: "One Big Task First", tip: "Tackle your most important task before checking messages. Your willpower is highest in the morning — protect it.", category: "Productivity" },
  { icon: "🌿", title: "Nature Breaks", tip: "5 minutes in nature (even a park) lowers blood pressure and stress hormones. Try eating lunch outdoors.", category: "Wellness" },
  { icon: "🤝", title: "Social Connection", tip: "Loneliness is as harmful as smoking 15 cigarettes a day. Reach out to one friend or family member today.", category: "Mental Health" },
  { icon: "🏋️", title: "Strength Training", tip: "Lifting weights 2–3× per week increases metabolism, bone density and mental resilience — benefits that last for days.", category: "Fitness" },
];

const SLIDE_INTERVAL_MS = 5000;

// ── Auto-slideshow hook ───────────────────────────────────────────────────────

function useSlideshow(total: number, intervalMs: number) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = (next: number) => {
    setVisible(false);
    setTimeout(() => {
      setIndex((next + total) % total);
      setVisible(true);
    }, 350); // fade-out duration
  };

  const goNext = () => advance(index + 1);
  const goPrev = () => advance(index - 1);
  const goTo = (i: number) => advance(i);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(goNext, intervalMs);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [index, paused, total]); // eslint-disable-line

  return { index, visible, paused, setPaused, goNext, goPrev, goTo };
}

// ── Performance analysis helpers ──────────────────────────────────────────────

interface HabitPerf {
  name: string;
  category: string;
  streak: number;
  thisMonthPct: number;
  totalDone: number;
  color: string;
}

function analyseHabits(rawHabits: any[]): HabitPerf[] {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysPassed = Math.min(now.getDate(), daysInMonth);

  return rawHabits.map((h) => {
    let thisMonthDone = 0;
    (h.completedDates || []).forEach((cd: string) => {
      const d = new Date(cd);
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) thisMonthDone++;
    });
    const pct = daysPassed > 0 ? Math.round((thisMonthDone / daysPassed) * 100) : 0;
    return {
      name: h.name,
      category: h.category,
      streak: h.streak ?? 0,
      thisMonthPct: pct,
      totalDone: h.completedDates?.length ?? 0,
      color: h.color || "#4F46E5",
    };
  });
}

interface Suggestion {
  type: "success" | "warning" | "info" | "danger";
  icon: React.ReactNode;
  title: string;
  body: string;
  habit?: string;
}

function generateSuggestions(perfs: HabitPerf[]): Suggestion[] {
  const suggestions: Suggestion[] = [];

  if (perfs.length === 0) {
    suggestions.push({ type: "info", icon: <FiTarget />, title: "Start Your Journey", body: "You haven't added any habits yet. Begin with just one small habit — consistency over time creates compound growth." });
    return suggestions;
  }

  const avg = perfs.reduce((s, p) => s + p.thisMonthPct, 0) / perfs.length;

  if (avg >= 80) suggestions.push({ type: "success", icon: <FiAward />, title: "Outstanding Performance! 🏆", body: `You're completing ${Math.round(avg)}% of your habits this month. You're in the top tier of consistent performers. Keep this momentum — consistency compounds exponentially.` });
  else if (avg >= 50) suggestions.push({ type: "info", icon: <FiTrendingUp />, title: "Good Progress — Keep Pushing", body: `You're at ${Math.round(avg)}% consistency this month. You're building great foundations. Focus on your weaker habits to cross the 80% mark — that's where lasting change happens.` });
  else if (avg > 0) suggestions.push({ type: "warning", icon: <FiAlertCircle />, title: "Time to Rebuild Momentum", body: `Your current consistency is ${Math.round(avg)}% this month. Don't be discouraged — every expert was once a beginner. Pick your 1–2 most important habits and focus exclusively on those this week.` });

  const best = [...perfs].sort((a, b) => b.thisMonthPct - a.thisMonthPct)[0];
  if (best?.thisMonthPct > 0) suggestions.push({ type: "success", icon: <FiStar />, title: `Your Best Habit: "${best.name}"`, body: `${best.thisMonthPct}% completion this month with a ${best.streak}-day streak. Consider adding a complementary habit in the ${best.category} category.`, habit: best.name });

  const worst = [...perfs].sort((a, b) => a.thisMonthPct - b.thisMonthPct)[0];
  if (worst?.thisMonthPct < 40 && perfs.length > 1) suggestions.push({ type: "danger", icon: <FiTrendingDown />, title: `"${worst.name}" Needs Attention`, body: `Only ${worst.thisMonthPct}% this month. Try habit stacking: attach "${worst.name}" to something you already do daily — right after brushing your teeth, or with your morning coffee.`, habit: worst.name });

  const maxStreak = perfs.reduce((m, p) => p.streak > m ? p.streak : m, 0);
  if (maxStreak >= 7) {
    const streaker = perfs.find((p) => p.streak === maxStreak)!;
    suggestions.push({ type: "success", icon: <FiZap />, title: `🔥 ${maxStreak}-Day Streak — Don't Break It!`, body: `"${streaker.name}" has been completed for ${maxStreak} days straight. You're ${Math.max(0, 21 - maxStreak)} days from the 21-day milestone — the tipping point for permanent habit formation!`, habit: streaker.name });
  }
  if (maxStreak === 0) suggestions.push({ type: "warning", icon: <FiSun />, title: "Start Your First Streak Today", body: "You haven't built a streak yet. Today is day 1. Complete just one habit right now — the first domino is always the hardest." });

  const categories = new Set(perfs.map((p) => p.category));
  if (categories.size === 1) suggestions.push({ type: "info", icon: <FiHeart />, title: "Diversify Your Habits", body: `All your habits are in the "${[...categories][0]}" category. A balanced life includes physical, mental, social and creative habits.` });

  if (avg < 60 && perfs.length >= 3) suggestions.push({ type: "info", icon: <FiMoon />, title: "The 2-Day Rule", body: "Never miss a habit twice in a row. Missing once is human — missing twice is starting a new bad habit. When you skip, make tomorrow non-negotiable." });

  return suggestions;
}

const SUGGESTION_STYLES: Record<string, { border: string; bg: string; icon: string; badge: string }> = {
  success: { border: "border-green-300 dark:border-green-700", bg: "bg-green-50 dark:bg-green-900/20", icon: "text-green-600 dark:text-green-400", badge: "bg-green-100 dark:bg-green-800/60 text-green-700 dark:text-green-300" },
  warning: { border: "border-amber-300 dark:border-amber-700", bg: "bg-amber-50 dark:bg-amber-900/20", icon: "text-amber-600 dark:text-amber-400", badge: "bg-amber-100 dark:bg-amber-800/60 text-amber-700 dark:text-amber-300" },
  danger: { border: "border-red-300 dark:border-red-700", bg: "bg-red-50 dark:bg-red-900/20", icon: "text-red-600 dark:text-red-400", badge: "bg-red-100 dark:bg-red-800/60 text-red-700 dark:text-red-300" },
  info: { border: "border-indigo-300 dark:border-indigo-700", bg: "bg-indigo-50 dark:bg-indigo-900/20", icon: "text-indigo-600 dark:text-indigo-400", badge: "bg-indigo-100 dark:bg-indigo-800/60 text-indigo-700 dark:text-indigo-300" },
};
const TYPE_LABELS: Record<string, string> = { success: "Great Job", warning: "Heads Up", danger: "Action Needed", info: "Tip" };

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SuggestionsPage() {
  const { data: session, status } = useSession();
  const api = useApi();
  const [rawHabits, setRawHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tipPage, setTipPage] = useState(0);

  const TIPS_PER_PAGE = 4;
  const totalTipPages = Math.ceil(HEALTHY_TIPS.length / TIPS_PER_PAGE);

  // Slideshow state
  const slideshow = useSlideshow(MOTIVATIONAL_QUOTES.length, SLIDE_INTERVAL_MS);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchHabits();
  }, [status, session]); // eslint-disable-line

  const fetchHabits = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getHabits();
      setRawHabits(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const perfs = useMemo(() => analyseHabits(rawHabits), [rawHabits]);
  const suggestions = useMemo(() => generateSuggestions(perfs), [perfs]);
  const avgConsistency = perfs.length > 0 ? Math.round(perfs.reduce((s, p) => s + p.thisMonthPct, 0) / perfs.length) : 0;
  const shownTips = HEALTHY_TIPS.slice(tipPage * TIPS_PER_PAGE, (tipPage + 1) * TIPS_PER_PAGE);
  const nextTips = () => setTipPage((p) => (p + 1) % totalTipPages);

  const currentQuote = MOTIVATIONAL_QUOTES[slideshow.index];

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );

  if (status === "unauthenticated") { signIn(); return null; }

  return (
    <div className="min-h-screen bg-ai-pattern dark:bg-dark-pattern bg-cover bg-center bg-fixed bg-no-repeat">
      <Navbar />

      {/* Inline CSS for slideshow fade transition */}
      <style>{`
        .quote-slide { transition: opacity 0.35s ease, transform 0.35s ease; }
        .quote-slide-visible { opacity: 1; transform: translateY(0); }
        .quote-slide-hidden  { opacity: 0; transform: translateY(10px); }
        @keyframes progress-bar {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .progress-anim {
          animation: progress-bar ${SLIDE_INTERVAL_MS}ms linear;
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header ── */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Suggestions</h1>
          <p className="text-muted">
            Personalised insights based on your habit performance, plus healthy tips &amp; motivation.
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
            {/* ── Performance Summary Banner ── */}
            <div
              className="rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-6"
              style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)" }}
            >
              <div className="flex-1 text-white">
                <p className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-1">This Month's Consistency</p>
                <p className="text-6xl font-black mb-2">{avgConsistency}%</p>
                <p className="text-sm opacity-80">
                  Across {perfs.length} habit{perfs.length !== 1 ? "s" : ""}
                  {perfs.length > 0 ? ` · Best streak: ${Math.max(0, ...perfs.map((p) => p.streak))} days` : ""}
                </p>
              </div>
              {perfs.length > 0 && (
                <div className="w-full sm:w-48 space-y-2">
                  {perfs.slice(0, 4).map((p) => (
                    <div key={p.name}>
                      <div className="flex justify-between text-xs text-white/80 mb-0.5">
                        <span className="truncate max-w-[120px]">{p.name}</span>
                        <span>{p.thisMonthPct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/20">
                        <div className="h-1.5 rounded-full bg-white transition-all duration-700" style={{ width: `${p.thisMonthPct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Personalised Suggestions ── */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
                <FiZap className="text-primary" /> Personalised Suggestions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((s, i) => {
                  const style = SUGGESTION_STYLES[s.type];
                  return (
                    <div key={i} className={`rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${style.border} ${style.bg}`}>
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 text-xl ${style.icon} flex-shrink-0`}>{s.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>{TYPE_LABELS[s.type]}</span>
                            {s.habit && <span className="text-xs text-muted truncate">{s.habit}</span>}
                          </div>
                          <p className="font-bold text-heading mb-1">{s.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{s.body}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ── Motivational Thought Slideshow ── */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
                <FiStar className="text-yellow-500" /> Motivational Thoughts
              </h2>

              <div
                className="relative rounded-2xl overflow-hidden text-white select-none"
                style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #312e81 100%)" }}
                onMouseEnter={() => slideshow.setPaused(true)}
                onMouseLeave={() => slideshow.setPaused(false)}
              >
                {/* Auto-progress bar */}
                {!slideshow.paused && (
                  <div className="absolute top-0 left-0 h-0.5 bg-indigo-400/40 w-full">
                    <div
                      key={slideshow.index} // restart animation on index change
                      className="h-full bg-indigo-400 progress-anim"
                    />
                  </div>
                )}

                {/* Paused badge */}
                {slideshow.paused && (
                  <div className="absolute top-3 right-16 flex items-center gap-1 text-xs text-white/50 font-medium">
                    <FiPause size={11} /> Paused
                  </div>
                )}

                {/* Slide counter */}
                <div className="absolute top-3 right-4 text-xs text-white/40 font-mono">
                  {slideshow.index + 1} / {MOTIVATIONAL_QUOTES.length}
                </div>

                {/* Quote content */}
                <div className="px-8 pt-10 pb-6 min-h-[200px] flex flex-col justify-center">
                  {/* Big decorative " */}
                  <div className="absolute top-2 left-5 text-9xl font-black opacity-[0.06] leading-none pointer-events-none" aria-hidden>
                    "
                  </div>

                  <blockquote
                    className={`relative z-10 quote-slide ${slideshow.visible ? "quote-slide-visible" : "quote-slide-hidden"}`}
                  >
                    <p className="text-xl sm:text-2xl font-semibold leading-relaxed mb-5 italic text-white/95">
                      &ldquo;{currentQuote.quote}&rdquo;
                    </p>
                    <footer className="flex items-center gap-3">
                      <div className="w-8 h-0.5 bg-indigo-400 rounded" />
                      <cite className="text-indigo-300 font-bold not-italic text-sm tracking-wide">
                        — {currentQuote.author}
                      </cite>
                    </footer>
                  </blockquote>
                </div>

                {/* Controls row */}
                <div className="flex items-center justify-between px-6 pb-5">
                  {/* Dot indicators */}
                  <div className="flex gap-1.5 flex-wrap">
                    {MOTIVATIONAL_QUOTES.map((_, i) => (
                      <button
                        key={i}
                        id={`quote-dot-${i}`}
                        onClick={() => slideshow.goTo(i)}
                        aria-label={`Go to quote ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === slideshow.index ? "w-5 bg-indigo-400" : "w-1.5 bg-white/25 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Prev / Play-Pause / Next */}
                  <div className="flex items-center gap-2">
                    <button
                      id="quote-prev-btn"
                      onClick={slideshow.goPrev}
                      aria-label="Previous quote"
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-150"
                    >
                      <FiChevronLeft size={16} />
                    </button>
                    <button
                      id="quote-playpause-btn"
                      onClick={() => slideshow.setPaused((p) => !p)}
                      aria-label={slideshow.paused ? "Play" : "Pause"}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-150"
                    >
                      {slideshow.paused ? <FiPlay size={14} /> : <FiPause size={14} />}
                    </button>
                    <button
                      id="quote-next-btn"
                      onClick={slideshow.goNext}
                      aria-label="Next quote"
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-150"
                    >
                      <FiChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Healthy Tips ── */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FiHeart className="text-pink-500" /> Healthy Tips
                </h2>
                <button
                  id="next-tips-btn"
                  onClick={nextTips}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-xl
                             bg-gray-100 dark:bg-card hover:bg-gray-200 dark:hover:bg-gray-700
                             text-gray-600 dark:text-gray-300 transition-all duration-150 font-medium"
                >
                  <FiRefreshCw size={13} /> More Tips
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {shownTips.map((tip, i) => (
                  <div key={`${tipPage}-${i}`} className="card flex gap-4 items-start hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
                    <div className="text-3xl flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-card">
                      {tip.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-heading">{tip.title}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium">
                          {tip.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted leading-relaxed">{tip.tip}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tip page indicators */}
              <div className="flex justify-center gap-2 mt-5">
                {Array.from({ length: totalTipPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTipPage(i)}
                    className={`h-2 rounded-full transition-all duration-200 ${
                      i === tipPage ? "w-6 bg-primary" : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
