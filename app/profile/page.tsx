
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  UserRound,
  Mail,
  CalendarDays,
  BriefcaseBusiness,
  Users,
  ShieldCheck,
  Heart,
  CalendarCheck,
  Settings,
  Pencil,
  Save,
  X,
  ImagePlus,
  Loader2,
  LogOut,
} from "lucide-react";

import { authClient, useSession } from "@/lib/auth-client";

type ProfileData = {
  name: string;
  email: string;
  image: string;
  gender: string;
  birthDate: string;
  profession: string;
};

const professions = [
  "Student",
  "Teacher",
  "Developer",
  "Business Owner",
  "Freelancer",
  "Doctor",
  "Engineer",
  "Government Employee",
  "Private Employee",
  "Other",
];

const inputClass =
  "h-12 w-full rounded-xl border border-[#e4e8e1] bg-white px-4 text-sm text-[#183c2e] outline-none transition focus:border-[#183c2e] focus:ring-2 focus:ring-[#183c2e]/10";

export default function ProfilePage() {
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    image: "",
    gender: "",
    birthDate: "",
    profession: "",
  });

  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    email: "",
    image: "",
    gender: "",
    birthDate: "",
    profession: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Read logged-in user's information from Better Auth
  useEffect(() => {
    if (!session?.user) return;

    const user = session.user as typeof session.user & {
      gender?: string;
      birthDate?: string;
      profession?: string;
    };

    const userProfile: ProfileData = {
      name: user.name || "",
      email: user.email || "",
      image: user.image || "",
      gender: user.gender || "",
      birthDate: user.birthDate || "",
      profession: user.profession || "",
    };

    setProfile(userProfile);
    setFormData(userProfile);
  }, [session]);

  // Redirect logged-out users to login
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  const updateField = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "image") {
      setImageError(false);
    }
  };

  const handleEdit = () => {
    setFormData(profile);
    setMessage("");
    setError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(profile);
    setImageError(false);
    setMessage("");
    setError("");
    setIsEditing(false);
  };

  // Save profile information to Better Auth / MongoDB
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.gender || !formData.birthDate || !formData.profession) {
      setError("Please complete all required fields.");
      return;
    }

    const today = new Date().toLocaleDateString("en-CA");

    if (formData.birthDate > today) {
      setError("Date of birth cannot be in the future.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const { error: updateError } = await authClient.updateUser({
        name: formData.name.trim(),
        image: formData.image.trim() || null,
        gender: formData.gender,
        birthDate: formData.birthDate,
        profession: formData.profession,
      });

      if (updateError) {
        setError(updateError.message || "Could not update profile.");
        return;
      }

      const updatedProfile = {
        ...formData,
        name: formData.name.trim(),
        image: formData.image.trim(),
      };

      setProfile(updatedProfile);
      setFormData(updatedProfile);
      setIsEditing(false);
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace("/login");
    router.refresh();
  };

  if (isPending || !session?.user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#183c2e]" />
      </div>
    );
  }

  const profileImage = profile.image && !imageError ? profile.image : "";

  const profileFields = [
    { label: "Full Name", value: profile.name, icon: UserRound },
    { label: "Email Address", value: profile.email, icon: Mail },
    { label: "Gender", value: profile.gender || "Not added", icon: Users },
    {
      label: "Date of Birth",
      value: profile.birthDate || "Not added",
      icon: CalendarDays,
    },
    {
      label: "Profession",
      value: profile.profession || "Not added",
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <main className="min-h-screen bg-[#fafaf7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#183c2e] transition hover:text-[#e47b52]"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="mb-9">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e47b52]">
            My Account
          </p>

          <h1 className="mt-3 text-3xl font-bold text-[#183c2e] sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-3 text-sm text-gray-500 sm:text-base">
            View and update your personal information.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800">
            {message}
          </div>
        )}

        <div className="grid items-start gap-7 lg:grid-cols-[320px_1fr]">
          {/* LEFT PROFILE CARD */}
          <section className="overflow-hidden rounded-3xl border border-[#e9e9e2] bg-white shadow-sm">
            <div className="h-28 bg-[#183c2e]" />

            <div className="px-6 pb-7">
              <div className="-mt-14 flex justify-center">
                <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#edf2eb] text-[#183c2e] shadow-sm">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      onError={() => setImageError(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound size={48} />
                  )}
                </div>
              </div>

              <div className="mt-5 text-center">
                <h2 className="break-words text-xl font-bold text-[#183c2e]">
                  {profile.name}
                </h2>

                <p className="mt-2 break-all text-sm text-gray-500">
                  {profile.email}
                </p>

                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#e9f0e9] px-4 py-2 text-xs font-bold text-[#183c2e]">
                  <ShieldCheck size={15} />
                  GOODWAVE Member
                </span>
              </div>

              <div className="my-7 border-t border-[#edf0eb]" />

              <div className="space-y-2">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                  Account Navigation
                </p>

                {[
                  {
                    href: "/manage-events",
                    label: "Manage Events",
                    icon: CalendarCheck,
                  },
                  {
                    href: "/joined-events",
                    label: "Joined Events",
                    icon: Heart,
                  },
                  {
                    href: "/create-event",
                    label: "Create Event",
                    icon: CalendarCheck,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-[#183c2e] transition hover:bg-[#f2f5ef]"
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={18} />
                        {item.label}
                      </span>
                      <ArrowRight size={16} />
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* RIGHT SIDE */}
          <div className="space-y-7">
            <section className="rounded-3xl border border-[#e9e9e2] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#edf0eb] pb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#183c2e]">
                    Personal Information
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Your account details and personal information.
                  </p>
                </div>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-[#183c2e] px-5 text-sm font-bold text-white transition hover:bg-[#e47b52]"
                  >
                    <Pencil size={16} />
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdate} className="mt-7 space-y-6">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#183c2e]">
                      <ImagePlus size={17} />
                      Profile Image URL
                    </label>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border bg-[#edf2eb]">
                        {formData.image && !imageError ? (
                          <img
                            src={formData.image}
                            alt="Profile preview"
                            onError={() => setImageError(true)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[#183c2e]">
                            <UserRound size={32} />
                          </div>
                        )}
                      </div>

                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => updateField("image", e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#183c2e]">
                      Full Name
                    </label>
                    <input
                      required
                      minLength={2}
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#183c2e]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      readOnly
                      className={`${inputClass} cursor-not-allowed bg-gray-100 text-gray-500`}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#183c2e]">
                      Gender
                    </label>
                    <select
                      required
                      value={formData.gender}
                      onChange={(e) => updateField("gender", e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#183c2e]">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      required
                      max={new Date().toLocaleDateString("en-CA")}
                      value={formData.birthDate}
                      onChange={(e) =>
                        updateField("birthDate", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#183c2e]">
                      Profession
                    </label>
                    <select
                      required
                      value={formData.profession}
                      onChange={(e) =>
                        updateField("profession", e.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="">Select profession</option>
                      {professions.map((profession) => (
                        <option key={profession} value={profession}>
                          {profession}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-col-reverse gap-3 border-t border-[#edf0eb] pt-6 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex h-12 items-center justify-center gap-2 rounded-full border px-6 text-sm font-bold text-[#183c2e] hover:bg-[#f6f8f5]"
                    >
                      <X size={17} />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving || imageError}
                      className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#183c2e] px-7 text-sm font-bold text-white hover:bg-[#e47b52] disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <Loader2 size={17} className="animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save size={17} />
                          Update Profile
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-7 grid gap-6 sm:grid-cols-2">
                  {profileFields.map((field) => {
                    const Icon = field.icon;

                    return (
                      <div
                        key={field.label}
                        className="rounded-2xl border border-[#edf0eb] bg-[#fafbf8] p-5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9f0e9] text-[#183c2e]">
                            <Icon size={19} />
                          </div>
                          <p className="text-xs font-semibold text-gray-500">
                            {field.label}
                          </p>
                        </div>

                        <p className="mt-4 break-words text-sm font-bold text-[#183c2e]">
                          {field.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* ACCOUNT INFORMATION */}
            <section className="rounded-3xl border border-[#e9e9e2] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9f0e9] text-[#183c2e]">
                  <Settings size={21} />
                </div>

                <div>
                  <h2 className="font-bold text-[#183c2e]">
                    Account Information
                  </h2>
                  <p className="mt-1 text-xl text-gray-500">
                    Your GOODWAVE account status.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0eb] pt-5">
                <div>
                  <p className="text-sm font-semibold text-[#183c2e]">
                    Account Status
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Your account is connected to GOODWAVE.
                  </p>
                </div>

                <span className="rounded-full bg-green-50 px-3 py-2 text-xs font-bold text-green-700">
                  Connected
                </span>
              </div>

              <div className="mt-5 border-t border-[#edf0eb] pt-5">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-red-200 px-5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={17} />
                  Sign Out
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
