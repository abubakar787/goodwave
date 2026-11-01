 
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  UserRound,
  Mail,
  CalendarDays,
  BriefcaseBusiness,
  Users,
  Camera,
  ShieldCheck,
  Heart,
  CalendarCheck,
  Settings,
  Pencil,
  Save,
  X,
  ImagePlus,
  Loader2,
} from "lucide-react";

type ProfileData = {
  name: string;
  email: string;
  image: string;
  gender: string;
  birthDate: string;
  profession: string;
};

const initialProfile: ProfileData = {
  name: "Your Name",
  email: "your-email@example.com",
  image: "",
  gender: "",
  birthDate: "",
  profession: "",
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

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [formData, setFormData] = useState<ProfileData>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const updateField = (
    field: keyof ProfileData,
    value: string
  ) => {
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
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(profile);
    setImageError(false);
    setMessage("");
    setIsEditing(false);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    if (!formData.gender || !formData.birthDate || !formData.profession) {
      setMessage("Please complete all required profile fields.");
      return;
    }

    if (formData.birthDate > new Date().toLocaleDateString("en-CA")) {
      setMessage("Date of birth cannot be in the future.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      // Temporary frontend update.
      // Connect this to the profile API after Better Auth integration.
      setProfile({
        ...formData,
        name: formData.name.trim(),
        email: profile.email,
      });

      setIsEditing(false);
      setMessage("Profile updated successfully!");
    } finally {
      setSaving(false);
    }
  };

  const profileImage =
    profile.image && !imageError ? profile.image : "";

  const inputClass =
    "h-12 w-full rounded-xl border border-[#e4e8e1] bg-white px-4 text-sm text-[#183c2e] outline-none transition focus:border-[#183c2e] focus:ring-2 focus:ring-[#183c2e]/10";

  const profileFields = [
    {
      label: "Full Name",
      value: profile.name,
      icon: UserRound,
    },
    {
      label: "Email Address",
      value: profile.email,
      icon: Mail,
    },
    {
      label: "Gender",
      value: profile.gender || "Not added",
      icon: Users,
    },
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

        {/* BACK LINK */}
        <Link
          href="/"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#183c2e] transition hover:text-[#e47b52]"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        {/* PAGE HEADING */}
        <div className="mb-9">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e47b52]">
            My Account
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#183c2e] sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-500 sm:text-base">
            View and update your personal information.
          </p>
        </div>

        {/* SUCCESS MESSAGE */}
        {message && !isEditing && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-800">
            {message}
          </div>
        )}

        <div className="grid items-start gap-7 lg:grid-cols-[320px_1fr]">

          {/* LEFT PROFILE CARD */}
          <section className="overflow-hidden rounded-3xl border border-[#e9e9e2] bg-white shadow-sm">

            <div className="h-28 bg-[#183c2e]" />

            <div className="px-6 pb-7">

              {/* PROFILE IMAGE */}
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

                  <div className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#e47b52] text-white">
                    <Camera size={16} />
                  </div>
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

              {/* ACCOUNT NAVIGATION */}
              <div className="space-y-2">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                  Account Navigation
                </p>

                <Link
                  href="/manage-events"
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-[#183c2e] transition hover:bg-[#f2f5ef]"
                >
                  <span className="flex items-center gap-3">
                    <CalendarCheck size={18} />
                    Manage Events
                  </span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/joined-events"
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-[#183c2e] transition hover:bg-[#f2f5ef]"
                >
                  <span className="flex items-center gap-3">
                    <Heart size={18} />
                    Joined Events
                  </span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/create-event"
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-[#183c2e] transition hover:bg-[#f2f5ef]"
                >
                  <span className="flex items-center gap-3">
                    <CalendarCheck size={18} />
                    Create Event
                  </span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>

          {/* RIGHT SIDE */}
          <div className="space-y-7">

            {/* PERSONAL INFORMATION */}
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

                  {/* IMAGE URL */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#183c2e]">
                      <ImagePlus size={17} />
                      Profile Image URL
                    </label>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-[#e4e8e1] bg-[#edf2eb]">
                        {formData.image && !imageError ? (
                          <img
                            src={formData.image}
                            alt="Profile preview"
                            onError={() => setImageError(true)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#183c2e]">
                            <UserRound size={32} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <input
                          type="url"
                          value={formData.image}
                          onChange={(e) =>
                            updateField("image", e.target.value)
                          }
                          placeholder="https://example.com/photo.jpg"
                          className={inputClass}
                        />

                        {imageError && (
                          <p className="mt-2 text-xs text-red-600">
                            Could not load this image. Please check the URL.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* NAME */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#183c2e]">
                      Full Name
                    </label>

                    <input
                      type="text"
                      required
                      minLength={2}
                      value={formData.name}
                      onChange={(e) =>
                        updateField("name", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>

                  {/* EMAIL */}
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

                    <p className="mt-2 text-xs text-gray-400">
                      Email address cannot be changed here.
                    </p>
                  </div>

                  {/* GENDER */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-[#183c2e]">
                      Gender
                    </label>

                    <select
                      required
                      value={formData.gender}
                      onChange={(e) =>
                        updateField("gender", e.target.value)
                      }
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

                  {/* DATE OF BIRTH */}
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

                  {/* PROFESSION */}
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

                  {/* ERROR MESSAGE */}
                  {message && (
                    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {message}
                    </p>
                  )}

                  {/* FORM BUTTONS */}
                  <div className="flex flex-col-reverse gap-3 border-t border-[#edf0eb] pt-6 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex h-12 items-center justify-center gap-2 rounded-full border border-[#dfe5df] px-6 text-sm font-bold text-[#183c2e] transition hover:bg-[#f6f8f5]"
                    >
                      <X size={17} />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving || imageError}
                      className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#183c2e] px-7 text-sm font-bold text-white transition hover:bg-[#e47b52] disabled:cursor-not-allowed disabled:opacity-50"
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

                  <p className="mt-1 text-xs text-gray-500">
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
                    Authentication connection pending
                  </p>
                </div>

                <span className="rounded-full bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
                  Not Connected
                </span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
