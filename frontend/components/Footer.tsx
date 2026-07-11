"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-800/50 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pb-8">
          {/* Brand & Address Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 font-poppins font-bold text-2xl text-primary">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg" />
              <span>HabitHive</span>
            </Link>
            <div className="space-y-3 text-muted text-sm">
              <p className="flex items-center gap-2 hover:text-primary transition-smooth">
                <span className="text-base">📍</span> Bengaluru, Karnataka, India
              </p>
              <p className="flex items-center gap-2">
                <span className="text-base">📧</span>
                <a href="mailto:support@habithive.com" className="hover:text-primary transition-smooth">
                  support@habithive.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-base">📞</span>
                <a href="tel:+91XXXXXX" className="hover:text-primary transition-smooth">
                  +91 XXXXX XXXXX
                </a>
              </p>
            </div>
          </div>

          

          {/* Follow Us Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-heading font-poppins">Follow Us</h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-muted">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary transition-smooth font-medium"
              >
                <span>📸</span> Instagram
              </a>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary transition-smooth font-medium"
              >
                <span>💼</span> LinkedIn
              </a>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary transition-smooth font-medium"
              >
                <span>🐦</span> X
              </a>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary transition-smooth font-medium"
              >
                <span>▶️</span> YouTube
              </a>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-gray-200/50 dark:border-gray-800/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted">
            © 2026 HabitHive. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
