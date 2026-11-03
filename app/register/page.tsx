
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Heart,
  Sprout,
  Check,
  X,
  ImagePlus,
  CalendarDays,
  BriefcaseBusiness,
  Users,
  Loader2,
} from "lucide-react";

import { signUp, signIn } from "@/lib/auth-client";

const DEFAULT_AVATAR = "https://i.pravatar.cc/300?img=12";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [profession, setProfession] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<
    "google" | "github" | null
  >(null);
  const [registerError, setRegisterError] = useState("");

  const profileImage =
    image.trim() && !imageError ? image.trim() : DEFAULT_AVATAR;

  const passwordRules = [
    {
      label: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      label: "One uppercase letter (A-Z)",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter (a-z)",
      valid: /[a-z]/.test(password),
    },
    {
      label: "One number (0-9)",
      valid: /[0-9]/.test(password),
    },
    {
      label: "One special character (@#$! etc.)",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const isPasswordValid = passwordRules.every(
    (rule) => rule.valid
  );

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  // Email and password registration
  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (isSubmitting || socialLoading) return;

    if (!isPasswordValid) {
      setRegisterError("Please create a strong password.");
      return;
    }

    if (!passwordsMatch) {
      setRegisterError("Passwords do not match.");
      return;
    }

    if (!gender || !birthDate || !profession) {
      setRegisterError("Please complete all required fields.");
      return;
    }

    if (birthDate > new Date().toLocaleDateString("en-CA")) {
      setRegisterError("Date of birth cannot be in the future.");
      return;
    }

    try {
      setIsSubmitting(true);
      setRegisterError("");

      const { error } = await signUp.email({
        name: fullName.trim(),
        email: email.trim(),
        password,
        image: profileImage,
        gender,
        birthDate,
        profession,
      });

      if (error) {
        setRegisterError(
          error.message || "Registration failed. Please try again."
        );
        return;
      }

      router.push("/profile");
      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);

      setRegisterError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google and GitHub registration / login
  const handleSocialSignIn = async (
    provider: "google" | "github"
  ) => {
    if (isSubmitting || socialLoading) return;

    try {
      setSocialLoading(provider);
      setRegisterError("");

      const { error } = await signIn.social({
        provider,
        callbackURL: "/profile",
      });

      if (error) {
        setRegisterError(
          error.message || `${provider} sign-in failed.`
        );
        setSocialLoading(null);
      }
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);

      setRegisterError(
        error instanceof Error
          ? error.message
          : "Social sign-in failed. Please try again."
      );

      setSocialLoading(null);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full overflow-hidden rounded-3xl border border-[#e9e9e2] bg-white shadow-xl lg:grid-cols-2">

        {/* LEFT SIDE */}
        <section className="relative flex min-h-[700px] flex-col justify-between overflow-hidden bg-[#183c2e] p-8 text-white sm:p-12 lg:p-14">
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
              JOIN OUR COMMUNITY
            </span>

            <h1 className="mt-9 text-5xl font-bold leading-tight sm:text-6xl">
              Make a Difference.
              <span className="mt-3 block text-[#ed8965]">
                Start Today.
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-base leading-8 text-gray-300 sm:text-lg">
              Become part of a community that cares. Discover meaningful
              events, connect with volunteers and create positive change
              together.
            </p>

            <div className="mt-12 flex items-center gap-4 rounded-3xl border border-white/15 bg-white/[0.07] p-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Sprout size={30} className="text-[#a6d85d]" />
              </div>

              <div>
                <h3 className="font-bold">Be the Change</h3>
                <p className="mt-1 text-sm text-gray-300">
                  Small actions create lasting impact.
                </p>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-xs tracking-wide text-white/50">
            © {new Date().getFullYear()} GOODWAVE. All rights reserved.
          </p>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-14">
          <div className="w-full max-w-lg">

            {/* HEADING */}
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e47b52]">
                Get Started
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#183c2e] sm:text-4xl">
                Create your account
              </h2>

              <p className="mt-4 leading-7 text-[#78847c]">
                Join GOODWAVE and start making a positive impact in your
                community.
              </p>
            </div>

            {/* REGISTRATION FORM */}
            <form onSubmit={handleRegister} className="mt-8 space-y-5">

              {/* PROFILE IMAGE */}
              <div>
                <label className="mb-3 block text-sm font-bold text-[#183c2e]">
                  Profile Picture
                </label>

                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[#e1e5e9] bg-[#f6f8f5]">
                    <img
                      src={profileImage}
                      alt="Profile preview"
                      onError={() => setImageError(true)}
                      onLoad={() => setImageError(false)}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#183c2e]">
                      <ImagePlus size={17} />
                      Profile Image URL
                    </div>

                    <input
                      type="url"
                      value={image}
                      onChange={(e) => {
                        setImage(e.target.value);
                        setImageError(false);
                      }}
                      placeholder="https://example.com/photo.jpg"
                      className="h-12 w-full rounded-xl border border-[#e1e5e9] px-3 text-sm text-[#183c2e] outline-none transition focus:border-[#183c2e]"
                    />

                    <p className="mt-2 text-xs text-gray-400">
                      Optional. Default avatar will be used if empty.
                    </p>
                  </div>
                </div>

                {imageError && image.trim() && (
                  <p className="mt-2 text-xs text-red-600">
                    Could not load this image. Please check the URL.
                  </p>
                )}
              </div>

              {/* FULL NAME */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-bold text-[#183c2e]"
                >
                  Full Name
                </label>

                <div className="flex h-14 items-center overflow-hidden rounded-2xl border border-[#e1e5e9] focus-within:border-[#183c2e]">
                  <div className="px-4 text-gray-400">
                    <UserRound size={20} />
                  </div>

                  <input
                    id="fullName"
                    type="text"
                    required
                    minLength={2}
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-full min-w-0 flex-1 bg-white px-3 text-sm text-[#183c2e] outline-none"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-[#183c2e]"
                >
                  Email Address
                </label>

                <div className="flex h-14 items-center overflow-hidden rounded-2xl border border-[#e1e5e9] focus-within:border-[#183c2e]">
                  <div className="px-4 text-gray-400">
                    <Mail size={20} />
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

              {/* GENDER */}
              <div>
                <label
                  htmlFor="gender"
                  className="mb-2 flex items-center gap-2 text-sm font-bold text-[#183c2e]"
                >
                  <Users size={17} />
                  Gender
                </label>

                <select
                  id="gender"
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-[#e1e5e9] bg-white px-4 text-sm text-[#183c2e] outline-none focus:border-[#183c2e]"
                >
                  <option value="">Select your gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* DATE OF BIRTH */}
              <div>
                <label
                  htmlFor="birthDate"
                  className="mb-2 flex items-center gap-2 text-sm font-bold text-[#183c2e]"
                >
                  <CalendarDays size={17} />
                  Date of Birth
                </label>

                <input
                  id="birthDate"
                  type="date"
                  required
                  max={new Date().toLocaleDateString("en-CA")}
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-[#e1e5e9] bg-white px-4 text-sm text-[#183c2e] outline-none focus:border-[#183c2e]"
                />
              </div>

              {/* PROFESSION */}
              <div>
                <label
                  htmlFor="profession"
                  className="mb-2 flex items-center gap-2 text-sm font-bold text-[#183c2e]"
                >
                  <BriefcaseBusiness size={17} />
                  Profession
                </label>

                <select
                  id="profession"
                  required
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-[#e1e5e9] bg-white px-4 text-sm text-[#183c2e] outline-none focus:border-[#183c2e]"
                >
                  <option value="">Select your profession</option>
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Developer">Developer</option>
                  <option value="Business Owner">Business Owner</option>
                  <option value="Freelancer">Freelancer</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Engineer">Engineer</option>
                  <option value="Government Employee">
                    Government Employee
                  </option>
                  <option value="Private Employee">Private Employee</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-[#183c2e]"
                >
                  Password
                </label>

                <div className="flex h-14 items-center overflow-hidden rounded-2xl border border-[#e1e5e9] focus-within:border-[#183c2e]">
                  <div className="px-4 text-gray-400">
                    <LockKeyhole size={20} />
                  </div>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="h-full min-w-0 flex-1 bg-white px-3 text-sm text-[#183c2e] outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="px-4 text-gray-400 hover:text-[#183c2e]"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* PASSWORD CONDITIONS */}
                <div className="mt-3 rounded-xl bg-[#f6f8f5] p-4">
                  <p className="mb-3 text-xs font-bold text-[#183c2e]">
                    Password must contain:
                  </p>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {passwordRules.map((rule) => (
                      <div
                        key={rule.label}
                        className={`flex items-center gap-2 text-xs ${
                          rule.valid ? "text-green-700" : "text-gray-500"
                        }`}
                      >
                        {rule.valid ? <Check size={14} /> : <X size={14} />}
                        {rule.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-bold text-[#183c2e]"
                >
                  Confirm Password
                </label>

                <div className="flex h-14 items-center overflow-hidden rounded-2xl border border-[#e1e5e9] focus-within:border-[#183c2e]">
                  <div className="px-4 text-gray-400">
                    <LockKeyhole size={20} />
                  </div>

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="h-full min-w-0 flex-1 bg-white px-3 text-sm text-[#183c2e] outline-none"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    className="px-4 text-gray-400 hover:text-[#183c2e]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                {confirmPassword.length > 0 && (
                  <p
                    className={`mt-2 flex items-center gap-2 text-xs ${
                      passwordsMatch ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    {passwordsMatch ? <Check size={14} /> : <X size={14} />}
                    {passwordsMatch
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </p>
                )}
              </div>

              {/* REGISTRATION ERROR */}
              {registerError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {registerError}
                </div>
              )}

              {/* CREATE ACCOUNT */}
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  socialLoading !== null ||
                  !isPasswordValid ||
                  !passwordsMatch ||
                  !fullName.trim() ||
                  !email.trim() ||
                  !gender ||
                  !birthDate ||
                  !profession
                }
                className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#183c2e] font-bold text-white transition hover:bg-[#e47b52] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* SOCIAL REGISTER */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#e5e7eb]" />
              <span className="text-xs font-semibold text-gray-400">
                OR SIGN UP WITH
              </span>
              <div className="h-px flex-1 bg-[#e5e7eb]" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {/* GOOGLE */}
              <button
                type="button"
                onClick={() => handleSocialSignIn("google")}
                disabled={socialLoading !== null || isSubmitting}
                className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-[#e1e5e9] font-semibold text-[#183c2e] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {socialLoading === "google" ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <span className="text-xl font-bold text-[#4285F4]">G</span>
                )}
                Google
              </button>

              {/* GITHUB */}
              <button
                type="button"
                onClick={() => handleSocialSignIn("github")}
                disabled={socialLoading !== null || isSubmitting}
                className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-[#e1e5e9] font-semibold text-[#183c2e] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {socialLoading === "github" ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.12.08 1.71 1.15 1.71 1.15 1 .1.1 2.18 2.5 1.67.1-.72.4-1.2.72-1.48-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.61 5.24-5.1 5.52.4.35.76 1.03.76 2.08v3.09c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" />
                  </svg>
                )}
                GitHub
              </button>
            </div>

            {/* LOGIN LINK */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#e47b52] hover:text-[#183c2e]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
