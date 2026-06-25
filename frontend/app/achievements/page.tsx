"use client";

import { useSession, signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { AchievementGrid } from "@/components/Achievements";
import { FiAward, FiTrendingUp, FiZap } from "react-icons/fi";

export default function Achievements() {
  const { data: session, status } = useSession();

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Achievements & Milestones</h1>
          <p className="text-gray-600 dark:text-gray-400">Celebrate your progress and unlock new achievements</p>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <FiAward className="text-accent" size={32} />
              <span className="badge badge-success">8/12</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Achievements Unlocked</p>
            <p className="text-3xl font-bold">8</p>
          </div>
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <FiZap className="text-secondary" size={32} />
              <span className="badge badge-secondary">Active</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Current Longest Streak</p>
            <p className="text-3xl font-bold">45 days</p>
          </div>
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <FiTrendingUp className="text-primary" size={32} />
              <span className="badge badge-primary">↑ 12%</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Overall Progress</p>
            <p className="text-3xl font-bold">78%</p>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">All Achievements</h2>
          <AchievementGrid />
        </div>

        {/* Achievement Timeline */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Recent Unlocks</h2>
          <div className="space-y-4">
            {[
              { icon: "🔥", title: "Week Warrior", description: "Completed a 7-day streak", date: "2 days ago" },
              { icon: "⭐", title: "First Step", description: "Created your first habit", date: "1 week ago" },
              { icon: "🎯", title: "Habit Master", description: "Created 5 habits", date: "2 weeks ago" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between pb-4 border-b last:border-b-0">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{item.icon}</div>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
