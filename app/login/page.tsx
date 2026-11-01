
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Heart,
  Sprout,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Authentication will be connected with Better Auth later.
    console.log({ email, password, rememberMe });
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full overflow-hidden rounded-3xl border border-[#e9e9e2] bg-white shadow-xl lg:grid-cols-2">

        {/* LEFT SIDE */}
        <section className="relative flex min-h-[620px] flex-col justify-between overflow-hidden bg-[#183c2e] p-8 text-white sm:p-12 lg:p-14">

          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full border border-white/10" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                <Heart size={25} fill="white" />
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  GOODWAVE
                </h2>
                <p className="text-[10px] tracking-[2px] text-white/60">
                  SMALL ACTIONS. LASTING IMPACT.
                </p>
              </div>
            </Link>
          </div>

          <div className="relative z-10 my-16">
            <span className="inline-flex rounded-full bg-white/10 px-5 py-3 text-xs font-bold tracking-widest text-[#f09a73]">
              WELCOME BACK
            </span>

            <h1 className="mt-9 text-5xl font-bold leading-tight sm:text-6xl">
              Small Actions.
              <span className="mt-3 block text-[#ed8965]">
                Lasting Impact.
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-base leading-8 text-gray-300 sm:text-lg">
              Every positive change begins with someone who cares.
              Sign in and continue making a difference in your community.
            </p>

            <div className="mt-12 flex items-center gap-4 rounded-3xl border border-white/15 bg-white/[0.07] p-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Sprout size={30} className="text-[#a6d85d]" />
              </div>

              <div>
                <h3 className="font-bold">Be the Change</h3>
                <p className="mt-1 text-sm text-gray-300">
                  Your community needs you.
                </p>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-xs tracking-wide text-white/50">
            © {new Date().getFullYear()} GOODWAVE. Small Actions. Lasting Impact.
          </p>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-14">
          <div className="w-full max-w-lg">

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e47b52]">
                Welcome Back
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#183c2e] sm:text-4xl">
                Sign in to your account
              </h2>

              <p className="mt-4 leading-7 text-[#78847c]">
                Welcome back! Please enter your details to access your
                GOODWAVE account.
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-10 space-y-6">

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-3 block text-sm font-bold text-[#183c2e]"
                >
                  Email Address
                </label>

                <div className="flex h-16 items-center overflow-hidden rounded-2xl border border-[#e1e5e9] bg-[#fafaf7] transition focus-within:border-[#183c2e]">
                  <div className="px-5 text-gray-400">
                    <Mail size={21} />
                  </div>

                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="h-full min-w-0 flex-1 bg-white px-3 text-sm text-[#183c2e] outline-none"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-3 block text-sm font-bold text-[#183c2e]"
                >
                  Password
                </label>

                <div className="flex h-16 items-center overflow-hidden rounded-2xl border border-[#e1e5e9] bg-[#fafaf7] transition focus-within:border-[#183c2e]">
                  <div className="px-5 text-gray-400">
                    <LockKeyhole size={21} />
                  </div>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-full min-w-0 flex-1 bg-white px-3 text-sm text-[#183c2e] outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="px-5 text-gray-400 transition hover:text-[#183c2e]"
                  >
                    {showPassword ? <EyeOff size={21} /> : <Eye size={21} />}
                  </button>
                </div>
              </div>

              {/* REMEMBER & FORGOT */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 accent-[#183c2e]"
                  />
                  Remember me
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-[#e47b52] transition hover:text-[#183c2e]"
                >
                  Forgot password?
                </Link>
              </div>

              {/* SIGN IN */}
              <button
                type="submit"
                className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#183c2e] font-bold text-white transition hover:bg-[#e47b52]"
              >
                Sign In
                <ArrowRight size={20} />
              </button>
            </form>

            {/* DIVIDER */}
            <div className="my-10 flex items-center gap-5">
              <div className="h-px flex-1 bg-[#e5e7eb]" />
              <span className="text-xs font-semibold text-gray-400">
                OR CONTINUE WITH
              </span>
              <div className="h-px flex-1 bg-[#e5e7eb]" />
            </div>

            {/* SOCIAL LOGIN */}
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-[#e1e5e9] font-semibold text-[#183c2e] transition hover:bg-[#f5f7f3]"
              >
                <span className="text-xl font-bold text-[#4285F4]">G</span>
                Google
              </button>

              <button
                type="button"
                className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-[#e1e5e9] font-semibold text-[#183c2e] transition hover:bg-[#f5f7f3]"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                  aria-hidden="true"
                >
                  <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.12.08 1.71 1.15 1.71 1.15 1 .1.1 2.18 2.5 1.67.1-.72.4-1.2.72-1.48-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.61 5.24-5.1 5.52.4.35.76 1.03.76 2.08v3.09c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" />
                </svg>
                GitHub
              </button>
            </div>

            {/* REGISTER LINK */}
            <p className="mt-10 text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-[#e47b52] hover:text-[#183c2e]"
              >
                Create account
              </Link>
            </p>

          </div>
        </section>
      </div>
    </div>
  );
}
