"use client";

import { useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";

interface HabitGridProps {
  habits: Array<{
    id: string;
    name: string;
    category: string;
    completed: boolean[];
    target: number;
    streak: number;
    color: string;
  }>;
  onToggle: (habitId: string, dayIndex: number) => void;
}

export function HabitGrid({ habits, onToggle }: HabitGridProps) {
  const getDaysInMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="card overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-6">Monthly Habit Tracker</h2>

      <table className="w-full min-w-max">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-semibold min-w-32">Habit</th>
            {days.map((day) => (
              <th key={day} className="px-1 py-3 text-center text-xs font-semibold text-gray-600">
                {day}
              </th>
            ))}
            <th className="px-4 py-3 text-center font-semibold min-w-16">Streak</th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => (
            <tr key={habit.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-smooth">
              <td className="py-4 px-4 font-semibold">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${!habit.color?.startsWith('#') ? habit.color : ''}`}
                    style={habit.color?.startsWith('#') ? { backgroundColor: habit.color } : undefined}
                  />
                  <span>{habit.name}</span>
                </div>
              </td>
              {days.map((day, index) => (
                <td key={day} className="px-1 py-4 text-center">
                  <button
                    onClick={() => onToggle(habit.id, index)}
                    className={`w-8 h-8 rounded-lg transition-smooth flex items-center justify-center ${habit.completed[index]
                        ? "bg-secondary text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                      }`}
                  >
                    {habit.completed[index] ? <FiCheck size={16} /> : <FiX size={16} />}
                  </button>
                </td>
              ))}
              <td className="px-4 py-4 text-center font-bold text-secondary">{habit.streak}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
