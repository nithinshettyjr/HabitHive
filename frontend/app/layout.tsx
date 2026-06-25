import type { Metadata } from "next";
import { AuthProvider } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "HabitHive - Smart Habit & Life Tracking Platform",
  description: "Transform your daily actions into lifelong success with HabitHive",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
