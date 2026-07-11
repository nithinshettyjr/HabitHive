/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#10B981",
        accent: "#F59E0B",
        
        background: "var(--bg-primary)",
        "background-dark": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        card: "var(--bg-card)",
        border: "var(--border-color)",
        "surface-hover": "var(--bg-hover)",
        
        heading: "var(--text-heading)",
        subheading: "var(--text-subheading)",
        body: "var(--text-body)",
        muted: "var(--text-secondary)",
      },
      backgroundImage: {
        "hero-pattern": "url('/images/bg_home.png')",
        "dashboard-pattern": "url('/images/bg_dashboard.png')",
        "dark-pattern": "url('/images/bg_dark_mode.png')",
        "analytics-pattern": "url('/images/bg_analytics.png')",
        "ai-pattern": "url('/images/bg_ai_coach.png')",
        "habits-pattern": "url('/images/bg_habits.png')",
        "achievements-pattern": "url('/images/bg_achievements.png')",
        "profile-pattern": "url('/images/bg_profile.png')",
        "journal-pattern": "url('/images/bg_journal.png')",
        "settings-pattern": "url('/images/bg_settings.png')",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      animation: {
        "pulse-soft": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};
