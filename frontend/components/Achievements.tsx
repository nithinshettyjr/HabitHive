"use client";

import { FiAward, FiZap, FiTrendingUp, FiCalendar } from "react-icons/fi";

interface AchievementCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  achieved: boolean;
  progress?: number;
}

export function AchievementCard({ title, description, icon, achieved, progress }: AchievementCardProps) {
  return (
    <div className={`card ${achieved ? "bg-gradient-to-br from-secondary/10 to-accent/10" : "opacity-50"}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${achieved ? "bg-secondary/20 text-secondary" : "bg-gray-200 dark:bg-gray-700 text-gray-400"}`}>
          {icon}
        </div>
        {achieved && <span className="badge-success">Unlocked</span>}
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
      
      {progress !== undefined && !achieved && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-secondary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export function AchievementGrid() {
  const achievements = [
    {
      title: "First Step",
      description: "Create your first habit",
      icon: <FiZap size={24} />,
      achieved: true,
    },
    {
      title: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: <FiTrendingUp size={24} />,
      achieved: true,
      progress: 100,
    },
    {
      title: "Month Master",
      description: "Maintain a 30-day streak",
      icon: <FiCalendar size={24} />,
      achieved: false,
      progress: 65,
    },
    {
      title: "Century",
      description: "Complete 100 habits",
      icon: <FiAward size={24} />,
      achieved: false,
      progress: 42,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {achievements.map((achievement, index) => (
        <AchievementCard key={index} {...achievement} />
      ))}
    </div>
  );
}
