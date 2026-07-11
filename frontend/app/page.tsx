"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiArrowRight, FiCheck, FiBarChart2, FiAward, FiStar, FiZap } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Home() {
  const { data: session } = useSession();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  return (
    <div className="min-h-screen bg-hero-pattern dark:bg-dark-pattern bg-cover bg-center bg-fixed bg-no-repeat font-inter overflow-hidden">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 md:pt-36 md:pb-40">
        {/* Background glow effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-white/20 dark:bg-primary/20 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="text-center z-10 relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              HabitHive 2.0 is now live
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-5xl md:text-7xl lg:text-8xl font-poppins font-bold tracking-tight mb-6 text-heading"
            >
              Build Better Habits. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                Transform Your Life.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-lg md:text-xl text-muted mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Track your daily routines, analyze your progress, and build unstoppable momentum.
              The ultimate habit tracker designed for the modern achiever.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
              {session ? (
                <Link href="/dashboard" className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-3.5 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                  <span>Go to Dashboard</span>
                  <FiArrowRight />
                </Link>
              ) : (
                <>
                  <Link href="/auth/signup" className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-3.5 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                    <span>Get Started for Free</span>
                    <FiArrowRight />
                  </Link>
                  <a href="#features" className="btn-ghost flex items-center justify-center gap-2 text-base px-8 py-3.5 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <span>Explore Features</span>
                  </a>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Abstract UI Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="relative mt-20 max-w-4xl mx-auto w-full h-[400px] flex items-center justify-center"
        >
          {/* Main central card */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute z-20 w-80 bg-white dark:bg-[#1E293B] shadow-2xl rounded-2xl p-5 border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><FiStar size={20} /></div>
              <div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md mb-1.5" />
                <div className="h-3 w-16 bg-gray-100 dark:bg-card rounded-md" />
              </div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-card/50">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-secondary text-white flex items-center justify-center"><FiCheck size={12} /></div>
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded-md" />
                  </div>
                  <div className="h-4 w-8 bg-primary/20 rounded-md" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Floating side card 1 */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
            className="absolute z-10 -left-4 md:left-12 top-10 w-48 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-md shadow-xl rounded-2xl p-4 border border-border"
          >
            <div className="h-16 w-full flex items-end gap-1.5 opacity-80">
              <div className="w-full bg-primary/40 rounded-t-sm" style={{ height: "40%" }} />
              <div className="w-full bg-primary/60 rounded-t-sm" style={{ height: "60%" }} />
              <div className="w-full bg-primary rounded-t-sm" style={{ height: "100%" }} />
              <div className="w-full bg-secondary rounded-t-sm" style={{ height: "80%" }} />
            </div>
          </motion.div>

          {/* Floating side card 2 */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
            className="absolute z-30 -right-4 md:right-12 bottom-10 w-56 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-md shadow-xl rounded-2xl p-4 border border-border flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent"><FiZap size={18} /></div>
            <div>
              <p className="text-sm font-bold text-heading">New Milestone!</p>
              <p className="text-xs text-gray-500">30 Day Streak Hit</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats Section ── */}
      <section className="border-y border-border/50 bg-white/50 dark:bg-[#1E293B]/30 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            {[
              { label: "Active Users", value: "10K+", color: "text-primary" },
              { label: "Habits Completed", value: "50M+", color: "text-secondary" },
              { label: "Current Streaks", value: "1.2M+", color: "text-accent" },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeIn} className="flex flex-col items-center">
                <h3 className={`text-4xl lg:text-5xl font-poppins font-black mb-2 tracking-tight ${stat.color}`}>
                  {stat.value}
                </h3>
                <p className="text-sm font-medium text-muted uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-poppins font-bold mb-4">Everything you need to succeed.</h2>
          <p className="text-muted max-w-2xl mx-auto">No clutter. Just powerful tools designed to help you build habits that actually stick.</p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            {
              icon: <FiCheck size={24} />,
              color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
              title: "Smart Tracking",
              description: "Easily log your daily progress with one click. Simple, fast, and satisfying.",
            },
            {
              icon: <FiBarChart2 size={24} />,
              color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10",
              title: "Advanced Analytics",
              description: "Visualize your journey with GitHub-style heatmaps and completion trends.",
            },
            {
              icon: <FiAward size={24} />,
              color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
              title: "Gamification",
              description: "Earn XP, level up, and unlock achievements as you build consistency.",
            },
            {
              icon: <FiStar size={24} />,
              color: "text-pink-500 bg-pink-50 dark:bg-pink-500/10",
              title: "AI Habit Coach",
              description: "Get personalized insights and motivational suggestions tailored to you.",
            },
            {
              icon: <FiZap size={24} />,
              color: "text-cyan-500 bg-cyan-50 dark:bg-cyan-500/10",
              title: "Curated Habit Library",
              description: "Add pre-built routines like '30-Day Fitness' directly to your dashboard.",
            },
            {
              icon: <FiCheck size={24} />,
              color: "text-purple-500 bg-purple-50 dark:bg-purple-500/10",
              title: "Privacy First",
              description: "Your data is secure, private, and fully exportable at any time.",
            },
          ].map((feature, index) => (
            <motion.div key={index} variants={fadeIn} className="card group hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-gray-50 dark:bg-[#151E2E] border-y border-border py-24 text-center overflow-hidden relative">
        {/* Decorative background circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-poppins font-bold mb-6 tracking-tight">Ready to transform your routine?</h2>
          <p className="text-lg text-muted mb-10">Join thousands of users who have already taken control of their time and goals.</p>
          {!session && (
            <Link href="/auth/signup" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all">
              <span>Start Tracking for Free</span>
              <FiArrowRight />
            </Link>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
