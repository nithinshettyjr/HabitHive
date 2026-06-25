"use client";

import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#EC4899", "#8B5CF6"];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Weekly Completion Bar Chart ────────────────────────────────────────────
interface HabitChartProps {
  habits: any[];
}

export function HabitChart({ habits = [] }: HabitChartProps) {
  // Build last-7-days completion counts from completedDates
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = DAY_LABELS[d.getDay()];
    const dateStr = d.toDateString();

    const completed = habits.filter((h) =>
      (h.completedDates || []).some(
        (cd: string) => new Date(cd).toDateString() === dateStr
      )
    ).length;

    return { name: label, completed, total: habits.length };
  });

  if (habits.length === 0) return <EmptyCard title="Weekly Completion" />;

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Weekly Completion</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={weekData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="completed" fill="#4F46E5" name="Completed" />
          <Bar dataKey="total" fill="#E5E7EB" name="Total Habits" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Streak Bar Chart ────────────────────────────────────────────────────────
interface StreakChartProps {
  habits: any[];
}

export function StreakChart({ habits = [] }: StreakChartProps) {
  const streakData = habits
    .filter((h) => h.streak > 0)
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 8)
    .map((h) => ({ name: h.name, value: h.streak }));

  if (streakData.length === 0) return <EmptyCard title="Habit Streaks" />;

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Habit Streaks</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={streakData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip formatter={(v: any) => [`${v} days`, "Streak"]} />
          <Bar dataKey="value" fill="#22C55E" name="Days" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Completion Pie Chart ────────────────────────────────────────────────────
interface CompletionChartProps {
  habits: any[];
}

export function CompletionChart({ habits = [] }: CompletionChartProps) {
  const today = new Date().toDateString();
  const completed = habits.filter((h) =>
    (h.completedDates || []).some(
      (cd: string) => new Date(cd).toDateString() === today
    )
  ).length;
  const missed = habits.length - completed;

  const data = [
    { name: "Completed Today", value: completed },
    { name: "Remaining", value: missed },
  ].filter((d) => d.value > 0);

  if (habits.length === 0) return <EmptyCard title="Today's Completion" />;

  const pct = habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0;

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-1">Today's Completion</h3>
      <p className="text-3xl font-bold text-primary mb-4">{pct}%</p>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: any, name: string) => [`${v} habits`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Monthly Consistency Line Chart ─────────────────────────────────────────
interface ConsistencyChartProps {
  habits: any[];
}

export function ConsistencyChart({ habits = [] }: ConsistencyChartProps) {
  // Build last-6-months completion % per month
  const monthLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const now = new Date();

  const consistencyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const monthStr = monthLabels[d.getMonth()];
    const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

    let totalPossible = habits.length * daysInMonth;
    let totalDone = 0;

    habits.forEach((h) => {
      (h.completedDates || []).forEach((cd: string) => {
        const cDate = new Date(cd);
        if (
          cDate.getFullYear() === d.getFullYear() &&
          cDate.getMonth() === d.getMonth()
        ) {
          totalDone++;
        }
      });
    });

    const consistency =
      totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;
    return { month: monthStr, consistency };
  });

  if (habits.length === 0) return <EmptyCard title="Consistency Trend" />;

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Consistency Trend (6 Months)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={consistencyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(v: any) => [`${v}%`, "Consistency"]} />
          <Line
            type="monotone"
            dataKey="consistency"
            stroke="#4F46E5"
            strokeWidth={3}
            dot={{ fill: "#4F46E5", r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Category Distribution Pie Chart ────────────────────────────────────────
interface CategoryChartProps {
  habits: any[];
}

export function CategoryChart({ habits = [] }: CategoryChartProps) {
  const categoryMap: Record<string, number> = {};
  habits.forEach((h) => {
    categoryMap[h.category] = (categoryMap[h.category] || 0) + 1;
  });
  const data = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  if (data.length === 0) return <EmptyCard title="Habits by Category" />;

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Habits by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}>
            {data.map((_, index) => (
              <Cell key={`cat-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: any, name: string) => [`${v} habits`, name]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Helper ──────────────────────────────────────────────────────────────────
function EmptyCard({ title }: { title: string }) {
  return (
    <div className="card flex flex-col items-center justify-center h-64 text-gray-400">
      <p className="text-lg font-semibold mb-2">{title}</p>
      <p className="text-sm">No habit data yet. Start tracking to see charts!</p>
    </div>
  );
}
