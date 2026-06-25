"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, useSession, signOut } from "next-auth/react";
import { FiMenu, FiX, FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="glass sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-poppins font-bold text-2xl text-primary">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg" />
            <span>HabitHive</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="hover:text-primary transition-smooth font-semibold">
              Dashboard
            </Link>
            <Link href="/habits" className="hover:text-primary transition-smooth font-semibold">
              Habits
            </Link>
            <Link href="/analytics" className="hover:text-primary transition-smooth font-semibold">
              Analytics
            </Link>
            <Link href="/journal" className="hover:text-primary transition-smooth font-semibold">
              Journal
            </Link>
            <Link href="/achievements" className="hover:text-primary transition-smooth font-semibold">
              Achievements
            </Link>
          </div>

          {/* Theme Toggle + Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-smooth"
              title={theme === "dark" ? "Switch to Light" : "Switch to Dark"}
            >
              {theme === "dark" ? (
                <FiSun size={20} className="text-yellow-400" />
              ) : (
                <FiMoon size={20} className="text-gray-600" />
              )}
            </button>
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold">{session.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 btn-ghost"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => signIn()}
                  className="btn-ghost"
                >
                  Sign In
                </button>
                <Link href="/auth/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Theme toggle + Menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {theme === "dark" ? (
                <FiSun size={20} className="text-yellow-400" />
              ) : (
                <FiMoon size={20} className="text-gray-600" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              Dashboard
            </Link>
            <Link href="/habits" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              Habits
            </Link>
            <Link href="/analytics" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              Analytics
            </Link>
            <Link href="/journal" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              Journal
            </Link>
            <Link href="/achievements" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              Achievements
            </Link>
            {session ? (
              <button
                onClick={() => signOut()}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => signIn()}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  Sign In
                </button>
                <Link href="/auth/signup" className="block px-4 py-2 bg-primary text-white rounded-lg text-center">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
