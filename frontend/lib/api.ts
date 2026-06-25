"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const useApi = () => {
  const { data: session } = useSession();

  // Build a fresh client on every call so the token is always current
  const getClient = useCallback(() => {
    const token = (session as any)?.accessToken as string | undefined;
    return axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }, [session]);

  return {
    // Auth
    signup: (data: any) => getClient().post("/auth/signup", data),
    login: (data: any) => getClient().post("/auth/login", data),

    // Habits
    getHabits: () => getClient().get("/habits"),
    createHabit: (data: any) => getClient().post("/habits", data),
    updateHabit: (id: string, data: any) => getClient().put(`/habits/${id}`, data),
    deleteHabit: (id: string) => getClient().delete(`/habits/${id}`),
    completeHabit: (id: string, data?: any) => getClient().post(`/habits/${id}/complete`, data),
    getHabitAnalytics: () => getClient().get("/habits/analytics"),

    // Journal
    getJournalEntries: () => getClient().get("/journal"),
    createJournalEntry: (data: any) => getClient().post("/journal", data),
    updateJournalEntry: (id: string, data: any) => getClient().put(`/journal/${id}`, data),
    deleteJournalEntry: (id: string) => getClient().delete(`/journal/${id}`),

    // Achievements
    getAchievements: () => getClient().get("/achievements"),
    unlockAchievement: (data: any) => getClient().post("/achievements", data),
  };
};
