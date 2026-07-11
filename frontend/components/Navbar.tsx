"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, useSession, signOut } from "next-auth/react";
import { FiMenu, FiX, FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "@/components/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl border-b border-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-poppins font-bold text-2xl text-heading group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105" />
            <span>HabitHive</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link href="/dashboard" className="text-muted hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/habits" className="text-muted hover:text-primary transition-colors">
              Habits
            </Link>
            <Link href="/analytics" className="text-muted hover:text-primary transition-colors">
              Analytics
            </Link>
            <Link href="/suggestions" className="text-muted hover:text-primary transition-colors">
              Suggestions
            </Link>
            <Link href="/library" className="text-muted hover:text-primary transition-colors">
              Library
            </Link>
            <Link href="/achievements" className="text-muted hover:text-primary transition-colors">
              Achievements
            </Link>
          </div>

          {/* Theme Toggle + Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
              title={theme === "dark" ? "Switch to Light" : "Switch to Dark"}
            >
              {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{session.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
                >
                  <FiLogOut size={16} /> <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => signIn()}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors px-3 py-2"
                >
                  Sign In
                </button>
                <Link href="/auth/signup" className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-primary/20">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: Theme toggle + Menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 transition-colors"
            >
              {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 transition-colors"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-border"
            >
              <div className="py-4 space-y-1">
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-base font-medium text-body hover:bg-bg-secondary rounded-lg">
                  Dashboard
                </Link>
                <Link href="/habits" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-base font-medium text-body hover:bg-bg-secondary rounded-lg">
                  Habits
                </Link>
                <Link href="/analytics" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-base font-medium text-body hover:bg-bg-secondary rounded-lg">
                  Analytics
                </Link>
                <Link href="/suggestions" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-base font-medium text-body hover:bg-bg-secondary rounded-lg">
                  Suggestions
                </Link>
                <Link href="/library" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-base font-medium text-body hover:bg-bg-secondary rounded-lg">
                  Library
                </Link>
                <Link href="/achievements" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-base font-medium text-body hover:bg-bg-secondary rounded-lg">
                  Achievements
                </Link>
                {session ? (
                  <button
                    onClick={() => { setIsOpen(false); signOut(); }}
                    className="w-full text-left px-4 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="pt-2 mt-2 border-t border-border px-4 space-y-2">
                    <button
                      onClick={() => { setIsOpen(false); signIn(); }}
                      className="w-full text-center px-4 py-2 text-base font-medium text-body hover:bg-bg-secondary rounded-lg border border-border"
                    >
                      Sign In
                    </button>
                    <Link href="/auth/signup" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2 text-base font-medium bg-primary text-white rounded-lg shadow-sm">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
