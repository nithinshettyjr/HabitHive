"use client";

import { useState } from "react";
import { FiX, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (habit: any) => void;
  submitting?: boolean;
}

export function CreateHabitModal({ isOpen, onClose, onSubmit, submitting = false }: CreateHabitModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Custom",
    description: "",
    color: "#4F46E5",
    targetPerMonth: 30,
  });

  const categories = [
    "Health",
    "Fitness",
    "Learning",
    "Productivity",
    "Finance",
    "Mindfulness",
    "Custom",
  ];

  const colors = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#EC4899", "#8B5CF6"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      category: "Custom",
      description: "",
      color: "#4F46E5",
      targetPerMonth: 30,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="card w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Habit</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Habit Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">Habit Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Morning Exercise"
              className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Why is this habit important to you?"
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-semibold mb-2">Color</label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-lg border-2 ${
                    formData.color === color
                      ? "border-gray-800 dark:border-white"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Target per Month */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Target per Month: {formData.targetPerMonth} days
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={formData.targetPerMonth}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  targetPerMonth: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Habit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
