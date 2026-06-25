"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiArrowRight, FiCheck, FiBarChart2, FiAward } from "react-icons/fi";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 dark:from-background-dark dark:via-background-dark dark:to-primary/10">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-poppins font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Transform Your Daily Actions Into Lifelong Success
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Track habits, build consistency, visualize growth, and achieve your goals with HabitHive.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <>
                <Link href="/dashboard" className="btn-primary flex items-center justify-center space-x-2 text-lg">
                  <span>Go to Dashboard</span>
                  <FiArrowRight />
                </Link>
                <Link href="/habits" className="btn-ghost flex items-center justify-center space-x-2 text-lg">
                  <span>View Habits</span>
                  <FiArrowRight />
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/signup" className="btn-primary flex items-center justify-center space-x-2 text-lg">
                  <span>Start Tracking</span>
                  <FiArrowRight />
                </Link>
                <Link href="/auth/signin" className="btn-ghost flex items-center justify-center space-x-2 text-lg">
                  <span>Sign In</span>
                  <FiArrowRight />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {[
            {
              icon: <FiCheck className="text-secondary" size={32} />,
              title: "Smart Tracking",
              description: "Track up to 99 habits with intelligent categorization and daily monitoring",
            },
            {
              icon: <FiBarChart2 className="text-primary" size={32} />,
              title: "Analytics",
              description: "Beautiful visualizations of your progress and consistency patterns",
            },
            {
              icon: <FiAward className="text-accent" size={32} />,
              title: "Achievements",
              description: "Unlock badges and celebrate milestones in your growth journey",
            },
            {
              icon: <FiCheck className="text-primary" size={32} />,
              title: "Printable Templates",
              description: "Download PDF trackers and journal templates for offline use",
            },
          ].map((feature, index) => (
            <div key={index} className="card">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-gray-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">10K+</h3>
              <p className="text-gray-600 dark:text-gray-400">Active Users</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-secondary mb-2">50M+</h3>
              <p className="text-gray-600 dark:text-gray-400">Habits Tracked</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-accent mb-2">98%</h3>
              <p className="text-gray-600 dark:text-gray-400">User Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Join thousands of users building better habits every day.</p>
        {!session && (
          <Link href="/auth/signup" className="btn-primary inline-flex items-center space-x-2 text-lg">
            <span>Get Started Free</span>
            <FiArrowRight />
          </Link>
        )}
      </section>

      <Footer />
    </div>
  );
}
