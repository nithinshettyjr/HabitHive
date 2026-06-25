"use client";

import { create } from "zustand";

interface HabitStore {
  habits: any[];
  setHabits: (habits: any[]) => void;
  addHabit: (habit: any) => void;
  updateHabit: (id: string, habit: any) => void;
  removeHabit: (id: string) => void;
}

export const useHabitStore = create<HabitStore>((set) => ({
  habits: [],
  setHabits: (habits) => set({ habits }),
  addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
  updateHabit: (id, habit) =>
    set((state) => ({
      habits: state.habits.map((h) => (h.id === id ? { ...h, ...habit } : h)),
    })),
  removeHabit: (id) =>
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
    })),
}));

interface UserStore {
  user: any;
  setUser: (user: any) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
