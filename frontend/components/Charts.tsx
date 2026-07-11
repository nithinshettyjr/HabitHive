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
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis dataKey="name" stroke="var(--text-secondary)" />
          <YAxis allowDecimals={false} stroke="var(--text-secondary)" />
          <Tooltip contentStyle={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-heading)" }} />
          <Legend wrapperStyle={{ color: "var(--text-body)" }} />
          <Bar dataKey="completed" fill="var(--brand-primary)" name="Completed" />
          <Bar dataKey="total" fill="var(--border-color)" name="Total Habits" />
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
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="var(--text-secondary)" />
          <YAxis allowDecimals={false} stroke="var(--text-secondary)" />
          <Tooltip formatter={(v: any) => [`${v} days`, "Streak"]} contentStyle={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-heading)" }} />
          <Bar dataKey="value" fill="var(--brand-secondary)" name="Days" radius={[4, 4, 0, 0]} />
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

// ─── Monthly Consistency Bar Chart ──────────────────────────────────────────
interface MonthlyConsistencyBarChartProps {
  habits: any[];
}

const MONTH_FULL = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

interface MonthBucket {
  label: string;       // "Jul 2025"
  shortLabel: string;  // "Jul"
  year: number;
  month: number;
  consistency: number; // 0-100
  completed: number;
  possible: number;
}

function buildMonthlyData(habits: any[]): MonthBucket[] {
  // Collect every year-month that appears in completedDates
  const seen = new Set<string>();
  habits.forEach((h) => {
    (h.completedDates || []).forEach((cd: string) => {
      const d = new Date(cd);
      seen.add(`${d.getFullYear()}-${d.getMonth()}`);
    });
  });

  // Always include last 12 months so there's always a baseline
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    seen.add(`${d.getFullYear()}-${d.getMonth()}`);
  }

  const buckets: MonthBucket[] = Array.from(seen)
    .map((key) => {
      const [y, m] = key.split("-").map(Number);
      return { year: y, month: m };
    })
    .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month)
    .map(({ year, month }) => {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const possible = habits.length * daysInMonth;
      let completed = 0;
      habits.forEach((h) => {
        (h.completedDates || []).forEach((cd: string) => {
          const d = new Date(cd);
          if (d.getFullYear() === year && d.getMonth() === month) completed++;
        });
      });
      const consistency = possible > 0 ? Math.round((completed / possible) * 100) : 0;
      return {
        label: `${MONTH_SHORT[month]} ${year}`,
        shortLabel: MONTH_SHORT[month],
        year,
        month,
        consistency,
        completed,
        possible,
      };
    });

  return buckets;
}

// Custom tooltip for the monthly bar chart
function MonthlyTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as MonthBucket;
  return (
    <div className="bg-card border border-border rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-bold text-heading mb-1">
        {MONTH_FULL[d.month]} {d.year}
      </p>
      <p className="text-primary font-semibold">
        {d.consistency}% consistency
      </p>
      <p className="text-muted text-xs mt-0.5">
        {d.completed} / {d.possible} check-ins
      </p>
    </div>
  );
}

export function MonthlyConsistencyBarChart({ habits = [] }: MonthlyConsistencyBarChartProps) {
  const data = buildMonthlyData(habits);

  if (habits.length === 0) return <EmptyCard title="Monthly Consistency" />;

  // Color bars: highlight current month in a brighter shade
  const now = new Date();
  const barColor = (entry: MonthBucket) =>
    entry.year === now.getFullYear() && entry.month === now.getMonth()
      ? "#22C55E"
      : "#6366F1";

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xl font-semibold">Monthly Consistency</h3>
        <span className="flex items-center gap-2 text-xs text-muted">
          <span className="inline-block w-3 h-3 rounded-sm bg-green-500" /> Current month
          <span className="inline-block w-3 h-3 rounded-sm bg-indigo-500 ml-2" /> Past months
        </span>
      </div>
      <p className="text-xs text-muted mb-4">
        % of possible habit completions per month — hover a bar for details
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
            angle={-40}
            textAnchor="end"
            interval={0}
            height={60}
            stroke="var(--text-secondary)"
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
            width={42}
            stroke="var(--text-secondary)"
          />
          <Tooltip content={<MonthlyTooltip />} cursor={{ fill: "rgba(99,102,241,0.08)" }} />
          <Bar dataKey="consistency" name="Consistency" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {data.map((entry, index) => (
              <Cell key={`bar-${index}`} fill={barColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Monthly Consistency Line Chart (kept for backward compat) ───────────────
interface ConsistencyChartProps {
  habits: any[];
}

export function ConsistencyChart({ habits = [] }: ConsistencyChartProps) {
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
        if (cDate.getFullYear() === d.getFullYear() && cDate.getMonth() === d.getMonth()) {
          totalDone++;
        }
      });
    });
    const consistency = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;
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
    <div className="card flex flex-col items-center justify-center h-64 text-center group">
      <div className="w-16 h-16 rounded-2xl bg-bg-secondary border border-border flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
        <span className="text-2xl opacity-60">📊</span>
      </div>
      <p className="text-lg font-bold text-heading mb-1">{title}</p>
      <p className="text-sm text-muted">No habit data yet. Start tracking to see charts!</p>
    </div>
  );
}

// ─── GitHub-style Heatmap ────────────────────────────────────────────────────
interface HeatmapChartProps { habits: any[] }

const HEATMAP_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const HEATMAP_DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function heatmapColor(count: number, max: number): string {
  if (count === 0) return ""; // use CSS class
  const ratio = Math.min(count / Math.max(max, 1), 1);
  if (ratio < 0.25) return "#c7d2fe"; // indigo-200
  if (ratio < 0.5)  return "#818cf8"; // indigo-400
  if (ratio < 0.75) return "#4f46e5"; // indigo-600
  return "#3730a3";                   // indigo-800
}

export function HeatmapChart({ habits = [] }: HeatmapChartProps) {
  if (habits.length === 0) return <EmptyCard title="Consistency Heatmap" />;

  // Build a map: dateStr -> count of habits completed that day
  const countMap: Record<string, number> = {};
  habits.forEach((h) => {
    (h.completedDates || []).forEach((cd: string) => {
      const key = new Date(cd).toDateString();
      countMap[key] = (countMap[key] || 0) + 1;
    });
  });

  const maxCount = Math.max(...Object.values(countMap), 1);

  // Show last 365 days
  const today = new Date();
  const days: { date: Date; key: string; count: number }[] = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toDateString();
    days.push({ date: d, key, count: countMap[key] || 0 });
  }

  // Group into weeks (columns)
  const firstDayOffset = days[0].date.getDay(); // pad start
  const paddedDays = [
    ...Array(firstDayOffset).fill(null),
    ...days,
  ];
  const weeks: (typeof days[0] | null)[][] = [];
  for (let i = 0; i < paddedDays.length; i += 7) {
    weeks.push(paddedDays.slice(i, i + 7) as any);
  }

  // Month label positions
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, col) => {
    const first = week.find(Boolean);
    if (first && first.date.getMonth() !== lastMonth) {
      lastMonth = first.date.getMonth();
      monthLabels.push({ label: HEATMAP_MONTHS[lastMonth], col });
    }
  });

  const CELL = 14;
  const GAP  = 2;
  const stride = CELL + GAP;

  return (
    <div className="card overflow-x-auto">
      <h3 className="text-xl font-semibold mb-1">Consistency Heatmap</h3>
      <p className="text-xs text-muted mb-4">Last 365 days — darker = more habits completed</p>
      <div className="min-w-max">
        {/* Month labels */}
        <div className="flex mb-1 ml-8">
          {monthLabels.map(({ label, col }) => (
            <div
              key={label + col}
              className="text-xs text-muted absolute"
              style={{ marginLeft: col * stride }}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="flex gap-0.5 mt-4">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 mr-1">
            {HEATMAP_DAYS.map((d) => (
              <div key={d} className="text-xs text-muted" style={{ height: CELL, lineHeight: `${CELL}px` }}>
                {d[0]}
              </div>
            ))}
          </div>
          {/* Grid */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((day, di) =>
                !day ? (
                  <div key={di} style={{ width: CELL, height: CELL }} />
                ) : (
                  <div
                    key={di}
                    title={`${day.key}: ${day.count} habit${day.count !== 1 ? "s" : ""}`}
                    className="rounded-sm cursor-default transition-all duration-150 hover:ring-2 hover:ring-indigo-400"
                    style={{
                      width: CELL,
                      height: CELL,
                      backgroundColor: day.count > 0
                        ? heatmapColor(day.count, maxCount)
                        : undefined,
                    }}
                  >
                    {day.count === 0 && (
                      <div className="w-full h-full rounded-sm bg-border transition-colors hover:bg-muted/30" />
                    )}
                  </div>
                )
              )}
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 text-xs text-muted">
          <span>Less</span>
          {["#e0e7ff","#c7d2fe","#818cf8","#4f46e5","#3730a3"].map((c) => (
            <div key={c} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

// ─── Day-of-Week Completion Chart ────────────────────────────────────────────
interface DayOfWeekChartProps { habits: any[] }

export function DayOfWeekChart({ habits = [] }: DayOfWeekChartProps) {
  if (habits.length === 0) return <EmptyCard title="Best Days of the Week" />;

  const dayCounts = [0,1,2,3,4,5,6].map((dow) => {
    let count = 0;
    let weeks = 0;
    const seen = new Set<string>();
    habits.forEach((h) => {
      (h.completedDates || []).forEach((cd: string) => {
        const d = new Date(cd);
        if (d.getDay() === dow) {
          count++;
          const wk = `${d.getFullYear()}-W${Math.ceil(d.getDate() / 7)}`;
          seen.add(wk);
        }
      });
    });
    weeks = Math.max(seen.size, 1);
    return {
      day: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][dow],
      avg: parseFloat((count / weeks).toFixed(1)),
      total: count,
    };
  });

  const CustomBar = (props: any) => {
    const { x, y, width, height, value } = props;
    const max = Math.max(...dayCounts.map(d => d.avg));
    const isMax = value === max;
    return (
      <rect x={x} y={y} width={width} height={height}
        fill={isMax ? "#22C55E" : "#6366F1"} rx={6} ry={6} />
    );
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-1">Best Days of the Week</h3>
      <p className="text-xs text-muted mb-4">
        Avg habits completed per day — <span className="text-green-500 font-medium">green = your best day</span>
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={dayCounts} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(v: any) => [`${v} habits avg`, "Completion"]}
            labelFormatter={(l) => `${l}day`}
          />
          <Bar dataKey="avg" shape={<CustomBar />} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
