
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ImagePlus,
  MapPin,
  Tag,
  Type,
  FileText,
  Loader2,
  Sprout,
  XCircle,
} from "lucide-react";

import { authClient, useSession } from "@/lib/auth-client";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/events`;

const eventCategories = [
  "Donation",
  "Cleanup",
  "Plantation",
  "Winter Relief",
  "Food Drive",
  "Health Camp",
  "Education",
];

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [today, setToday] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    setToday(`${year}-${month}-${day}`);
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [imageError, setImageError] = useState(false);

  const showMessage = (
    text: string,
    type: "success" | "error"
  ) => {
    setMessage(text);
    setMessageType(type);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (!title.trim()) {
      showMessage("Please enter an event title.", "error");
      return;
    }

    if (!description.trim()) {
      showMessage("Please enter an event description.", "error");
      return;
    }

    if (!eventType) {
      showMessage("Please select an event category.", "error");
      return;
    }

    if (!thumbnail.trim()) {
      showMessage("Please provide an event thumbnail URL.", "error");
      return;
    }

    if (!location.trim()) {
      showMessage("Please enter the event location.", "error");
      return;
    }

    if (!eventDate) {
      showMessage("Please select an event date.", "error");
      return;
    }

    if (eventDate <= today) {
      showMessage("Event date must be a future date.", "error");
      return;
    }

    try {
      setLoading(true);

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication required. Please login again.");
      }

      const eventData = {
        title: title.trim(),
        description: description.trim(),
        eventType,
        thumbnail: thumbnail.trim(),
        location: location.trim(),
        eventDate,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Failed to create event.");
      }

      showMessage(
        "Your event has been created successfully!",
        "success"
      );

      setTimeout(() => {
        router.push("/manage-events");
        router.refresh();
      }, 1200);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      showMessage(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "h-13 w-full rounded-xl border border-[#e4e8e1] bg-white px-4 text-sm text-[#183c2e] outline-none transition placeholder:text-gray-400 focus:border-[#183c2e] focus:ring-2 focus:ring-[#183c2e]/10";

  const labelClass =
    "mb-2 flex items-center gap-2 text-sm font-bold text-[#183c2e]";

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafaf7]">
        <Loader2 className="animate-spin text-[#183c2e]" size={32} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/events"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#183c2e] transition hover:text-[#e47b52]"
        >
          <ArrowLeft size={17} />
          Back to Upcoming Events
        </Link>

        <div className="mb-9">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#e9f0e9] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#183c2e]">
            <Sprout size={15} />
            Make an Impact
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#183c2e] sm:text-4xl">
            Create an Event
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Bring people together for a meaningful cause. Share your event
            with the GOODWAVE community and make a difference.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_350px]">
          <section className="rounded-3xl border border-[#e9e9e2] bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-8 border-b border-[#edf0eb] pb-6">
              <h2 className="text-xl font-bold text-[#183c2e]">
                Event Information
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Fill in the details below to publish your event.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className={labelClass}>
                  <Type size={17} />
                  Event Title
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="title"
                  type="text"
                  required
                  minLength={3}
                  maxLength={100}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Community Tree Plantation"
                  className={inputClass}
                />

                <p className="mt-2 text-right text-xs text-gray-400">
                  {title.length}/100 characters
                </p>
              </div>

              <div>
                <label htmlFor="description" className={labelClass}>
                  <FileText size={17} />
                  Event Description
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  id="description"
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell people what this event is about, why it matters and how they can participate..."
                  className="w-full resize-y rounded-xl border border-[#e4e8e1] bg-white p-4 text-sm leading-7 text-[#183c2e] outline-none transition placeholder:text-gray-400 focus:border-[#183c2e] focus:ring-2 focus:ring-[#183c2e]/10"
                />

                <p className="mt-2 text-right text-xs text-gray-400">
                  {description.length}/2000 characters
                </p>
              </div>

              <div>
                <label htmlFor="eventType" className={labelClass}>
                  <Tag size={17} />
                  Event Category
                  <span className="text-red-500">*</span>
                </label>

                <select
                  id="eventType"
                  required
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="">Select an event category</option>
                  {eventCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="thumbnail" className={labelClass}>
                  <ImagePlus size={17} />
                  Thumbnail Image URL
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="thumbnail"
                  type="url"
                  required
                  value={thumbnail}
                  onChange={(e) => {
                    setThumbnail(e.target.value);
                    setImageError(false);
                  }}
                  placeholder="https://example.com/event-image.jpg"
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-gray-400">
                  Add a publicly accessible image URL for your event.
                </p>

                {thumbnail.trim() && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-[#e4e8e1] bg-[#f6f8f5]">
                    {!imageError ? (
                      <img
                        src={thumbnail}
                        alt="Event thumbnail preview"
                        onError={() => setImageError(true)}
                        className="h-52 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-52 flex-col items-center justify-center gap-2 text-sm text-red-500">
                        <XCircle size={25} />
                        Unable to load image. Check the URL.
                      </div>
                    )}

                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-xs font-semibold text-[#183c2e]">
                        Image Preview
                      </span>
                      <span className="text-xs text-gray-400">
                        {imageError ? "Invalid image" : "Preview"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="location" className={labelClass}>
                  <MapPin size={17} />
                  Event Location
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="location"
                  type="text"
                  required
                  maxLength={150}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Dhanmondi, Dhaka, Bangladesh"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="eventDate" className={labelClass}>
                  <CalendarDays size={17} />
                  Event Date
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="eventDate"
                  type="date"
                  required
                  min={today || undefined}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-gray-400">
                  Select a future date for your event.
                </p>
              </div>

              {message && (
                <div
                  role="status"
                  className={`flex items-start gap-3 rounded-xl p-4 text-sm ${
                    messageType === "success"
                      ? "border border-green-200 bg-green-50 text-green-800"
                      : "border border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {messageType === "success" ? (
                    <CheckCircle2 className="mt-0.5 shrink-0" size={19} />
                  ) : (
                    <XCircle className="mt-0.5 shrink-0" size={19} />
                  )}
                  <p>{message}</p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-[#edf0eb] pt-6 sm:flex-row sm:justify-end">
                <Link
                  href="/events"
                  className="flex h-13 items-center justify-center rounded-full border border-[#dfe5df] px-7 text-sm font-bold text-[#183c2e] transition hover:bg-[#f6f8f5]"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading || imageError || !today}
                  className="flex h-13 items-center justify-center gap-3 rounded-full bg-[#183c2e] px-8 text-sm font-bold text-white transition hover:bg-[#e47b52] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      Publish Event
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-[#e9e9e2] bg-white shadow-sm">
              <div className="bg-[#183c2e] px-6 py-5 text-white">
                <div className="flex items-center gap-2">
                  <Sprout size={19} className="text-[#a6d85d]" />
                  <h3 className="font-bold">Event Preview</h3>
                </div>
                <p className="mt-2 text-xs leading-5 text-white/70">
                  Your event information at a glance.
                </p>
              </div>

              <div className="p-5">
                <div className="mb-5 overflow-hidden rounded-2xl bg-[#f1f3ed]">
                  {thumbnail.trim() && !imageError ? (
                    <img
                      src={thumbnail}
                      alt="Event preview"
                      onError={() => setImageError(true)}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-44 flex-col items-center justify-center gap-3 text-[#9aa69d]">
                      <ImagePlus size={35} />
                      <span className="text-xs">Event image preview</span>
                    </div>
                  )}
                </div>

                {eventType && (
                  <span className="inline-flex rounded-full bg-[#e9f0e9] px-3 py-1.5 text-xs font-bold text-[#183c2e]">
                    {eventType}
                  </span>
                )}

                <h3 className="mt-4 break-words text-xl font-bold text-[#183c2e]">
                  {title || "Your Event Title"}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                  {description || "Your event description will appear here."}
                </p>

                <div className="mt-5 space-y-3 border-t border-[#edf0eb] pt-5">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin size={17} className="shrink-0 text-[#e47b52]" />
                    <span>{location || "Event location"}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CalendarDays
                      size={17}
                      className="shrink-0 text-[#e47b52]"
                    />
                    <span>
                      {eventDate
                        ? new Date(`${eventDate}T00:00:00`).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "Event date"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#e9e9e2] bg-[#f0f3ec] p-6">
              <h3 className="font-bold text-[#183c2e]">
                Tips for a great event
              </h3>

              <ul className="mt-4 space-y-4 text-sm leading-6 text-[#617067]">
                <li className="flex gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#e47b52]"
                  />
                  Choose a clear and engaging event title.
                </li>

                <li className="flex gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#e47b52]"
                  />
                  Explain the purpose and expected impact.
                </li>

                <li className="flex gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#e47b52]"
                  />
                  Add a relevant, high-quality event image.
                </li>

                <li className="flex gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#e47b52]"
                  />
                  Provide an accurate location and future date.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
