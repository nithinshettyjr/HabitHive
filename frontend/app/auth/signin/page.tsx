"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else if (result?.ok) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-hero-pattern dark:bg-dark-pattern bg-cover bg-center bg-fixed bg-no-repeat flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted">Sign in to continue to DailyFlow</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-field pl-11 py-3"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-11 py-3"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3 mt-6">
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => signIn("google")}
              className="w-full py-3 px-4 border border-border rounded-xl hover:bg-surface-hover font-semibold transition-all duration-200 flex justify-center items-center gap-2 text-heading"
            >
              Continue with Google
            </button>
          </div>

          <p className="mt-6 text-center text-muted">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
