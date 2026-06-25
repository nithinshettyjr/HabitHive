"use client";

import { useSession, signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { FiPlus, FiSearch, FiDownload } from "react-icons/fi";

export default function Journal() {
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Habit Hive</h1>
            <p className="text-gray-600 dark:text-gray-400">Reflect on your day and track your thoughts</p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <FiPlus /> New Entry
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search entries..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="btn-ghost flex items-center space-x-2">
            <FiDownload /> Export
          </button>
        </div>

        {/* Journal Entries */}
        <div className="space-y-4">
          {[
            {
              date: "Today",
              title: "Great Day Ahead",
              excerpt: "Started with a 30-minute run and felt energized. Read 45 minutes of 'Atomic Habits'. Feeling productive today...",
              mood: "😊",
              time: "9:30 AM",
            },
            {
              date: "Yesterday",
              title: "Consistency Wins",
              excerpt: "Maintained all habits for another day! The meditation practice is becoming easier. Gratitude: Thankful for health...",
              mood: "🙏",
              time: "8:15 PM",
            },
            {
              date: "2 days ago",
              title: "Reflection",
              excerpt: "Missed one habit today but didn't let it discourage me. Tomorrow is a new day to build consistency...",
              mood: "🤔",
              time: "7:00 PM",
            },
          ].map((entry, index) => (
            <div key={index} className="card cursor-pointer hover:shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{entry.mood}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{entry.date} • {entry.time}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{entry.title}</h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{entry.excerpt}</p>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="text-primary font-semibold text-sm hover:underline">Read More →</button>
              </div>
            </div>
          ))}
        </div>

        {/* Mood Summary */}
        <div className="mt-12 card">
          <h2 className="text-2xl font-bold mb-6">Mood Tracking</h2>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const moods = ["😊", "🙏", "😴", "😊", "😊", "🤔", "😊"];
              return (
                <div key={i} className="aspect-square flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg text-2xl hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                  {moods[i]}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
