"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiCheck, FiX, FiTrash2, FiAlertTriangle } from "react-icons/fi";

// ── Delete Confirmation Modal ─────────────────────────────────────────────────

interface DeleteModalProps {
  habitName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteModal({ habitName, isDeleting, onConfirm, onCancel }: DeleteModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isDeleting, onCancel]);

  // Focus Cancel button when modal opens
  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  const modal = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        onClick={(e) => {
          if (e.target === e.currentTarget && !isDeleting) onCancel();
        }}
      >
        {/* Dialog */}
        <div
          className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          style={{
            background: "var(--bg-card)",
            animation: "modalPop 0.22s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {/* Red accent top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-red-400 to-red-600" />

          <div className="p-6">
            {/* Icon + title */}
            <div className="flex items-start gap-4 mb-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                <FiAlertTriangle className="text-red-600 dark:text-red-400" size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-heading mb-1">
                  Delete Habit?
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  You are about to permanently delete{" "}
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    &ldquo;{habitName}&rdquo;
                  </span>
                  , including all its completion history and streak data.
                  <br />
                  <span className="font-semibold">This action cannot be undone.</span>
                </p>
              </div>
            </div>

            {/* Warning box */}
            <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 mb-6 flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
              <FiTrash2 size={14} className="flex-shrink-0" />
              <span>All progress for <strong>{habitName}</strong> will be lost forever.</span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                ref={cancelRef}
                id="modal-cancel-delete"
                onClick={onCancel}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm
                           bg-bg-secondary border border-border hover:bg-border
                           text-heading transition-all duration-150
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                id="modal-confirm-delete"
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm
                           bg-red-600 hover:bg-red-700 active:bg-red-800
                           text-white transition-all duration-150
                           disabled:opacity-60 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <FiTrash2 size={15} />
                    Yes, Delete It
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.88) translateY(16px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </>
  );

  return typeof window !== "undefined" ? createPortal(modal, document.body) : null;
}

// ── HabitGrid ─────────────────────────────────────────────────────────────────

interface HabitGridProps {
  habits: Array<{
    id: string;
    name: string;
    category: string;
    completed: (string | null)[];
    target: number;
    streak: number;
    color: string;
  }>;
  onToggle: (habitId: string, dayIndex: number) => void;
  onDelete: (habitId: string) => Promise<void>;
}

export function HabitGrid({ habits, onToggle, onDelete }: HabitGridProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const getDaysInMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  };
  const daysInMonth = getDaysInMonth();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleDeleteClick = (habitId: string) => setPendingDeleteId(habitId);
  const handleCancelDelete = () => { if (!deleting) setPendingDeleteId(null); };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    setDeleting(true);
    try {
      await onDelete(pendingDeleteId);
    } finally {
      setDeleting(false);
      setPendingDeleteId(null);
    }
  };

  const pendingHabit = habits.find((h) => h.id === pendingDeleteId);

  return (
    <>
      {/* Delete confirmation modal (rendered via portal) */}
      {pendingDeleteId && pendingHabit && (
        <DeleteModal
          habitName={pendingHabit.name}
          isDeleting={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      <div className="card overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-6">Monthly Habit Tracker</h2>

        <table className="w-full min-w-max">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 top-0 bg-card z-20 text-left py-4 px-4 font-bold min-w-44 text-heading shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] dark:shadow-none">Habit</th>
              {days.map((day) => (
                <th key={day} className="sticky top-0 bg-card z-10 px-1 py-4 text-center text-xs font-bold text-muted">
                  {day}
                </th>
              ))}
              <th className="sticky top-0 bg-card z-10 px-4 py-4 text-center font-bold min-w-16 text-heading">Streak</th>
              <th className="sticky top-0 bg-card z-10 px-2 py-4 text-center font-bold min-w-10" />
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => {
              const isBeingDeleted = deleting && pendingDeleteId === habit.id;

              return (
                <tr
                  key={habit.id}
                  className="border-b border-border group hover:bg-bg-secondary transition-all duration-200"
                  style={{ opacity: isBeingDeleted ? 0.4 : 1, transition: "opacity 0.25s" }}
                >
                  {/* Habit name */}
                  <td className="sticky left-0 bg-card z-10 group-hover:bg-bg-secondary transition-colors py-4 px-4 font-semibold shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] dark:shadow-none text-heading">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          !habit.color?.startsWith("#") ? habit.color : ""
                        }`}
                        style={habit.color?.startsWith("#") ? { backgroundColor: habit.color } : undefined}
                      />
                      <span className="truncate max-w-[140px]">{habit.name}</span>
                    </div>
                  </td>

                  {/* Day checkboxes */}
                  {days.map((day, index) => (
                    <td key={day} className="px-1 py-4 text-center">
                      <button
                        onClick={() => onToggle(habit.id, index)}
                        disabled={isBeingDeleted}
                        className={`w-8 h-8 rounded-lg transition-all duration-150 flex items-center justify-center
                          ${
                            habit.completed[index]
                              ? "bg-secondary text-white shadow-sm"
                              : "bg-border text-muted hover:bg-bg-secondary"
                          }
                          disabled:cursor-not-allowed`}
                      >
                        {habit.completed[index] ? <FiCheck size={16} /> : <FiX size={16} />}
                      </button>
                    </td>
                  ))}

                  {/* Streak */}
                  <td className="px-4 py-4 text-center font-bold text-secondary">
                    {habit.streak}
                  </td>

                  {/* Delete trigger — appears on row hover */}
                  <td className="px-2 py-4 text-center">
                    <button
                      id={`delete-habit-${habit.id}`}
                      title="Delete this habit"
                      disabled={isBeingDeleted}
                      onClick={() => handleDeleteClick(habit.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                        text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30
                        disabled:cursor-not-allowed
                        opacity-0 group-hover:opacity-100
                      `}
                    >
                      {isBeingDeleted ? (
                        <span className="inline-block w-3.5 h-3.5 border-2 border-red-400/40 border-t-red-500 rounded-full animate-spin" />
                      ) : (
                        <FiTrash2 size={15} />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
