
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Tag,
  Loader2,
  AlertCircle,
  Heart,
  ShieldCheck,
  Pencil,
  Trash2,
} from "lucide-react";

type EventData = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  createdAt?: string;
  createdBy?: string;
};

const API_URL = "http://localhost:8000/api/events";

export default function EventDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/${id}`, {
          signal: controller.signal,
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error(result.message || "Event not found.");
        }

        setEvent(result.data);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Unable to load event details.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchEvent();

    return () => controller.abort();
  }, [id]);

  const formattedDate = event?.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Date not available";

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#fafaf7]">
        <div className="flex items-center gap-3 text-sm font-semibold text-[#183c2e]">
          <Loader2 className="animate-spin" size={22} />
          Loading event details...
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#fafaf7] px-4">
        <div className="max-w-md rounded-3xl border border-[#e9e9e2] bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto text-red-500" size={38} />
          <h1 className="mt-4 text-2xl font-bold text-[#183c2e]">
            Event Not Found
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-500">
            {error || "This event may have been removed or is unavailable."}
          </p>
          <Link
            href="/events"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#183c2e] px-6 text-sm font-bold text-white transition hover:bg-[#e47b52]"
          >
            Browse Events
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        <Link
          href="/events"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#183c2e] transition hover:text-[#e47b52]"
        >
          <ArrowLeft size={17} />
          Back to Upcoming Events
        </Link>

        {/* EVENT IMAGE */}
        <div className="relative overflow-hidden rounded-3xl bg-[#e9eee8]">
          <img
            src={event.thumbnail}
            alt={event.title}
            className="h-[260px] w-full object-cover sm:h-[400px] lg:h-[470px]"
          />

          <span className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#183c2e] shadow-sm">
            {event.eventType}
          </span>
        </div>

        {/* EVENT CONTENT */}
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_310px]">

          <section className="rounded-3xl border border-[#e9e9e2] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e47b52]">
              Community Event
            </p>

            <h1 className="mt-3 text-3xl font-bold leading-tight text-[#183c2e] sm:text-4xl">
              {event.title}
            </h1>

            <div className="mt-6 flex flex-wrap gap-5 border-b border-[#edf0eb] pb-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CalendarDays size={18} className="text-[#e47b52]" />
                {formattedDate}
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-[#e47b52]" />
                {event.location}
              </div>

              <div className="flex items-center gap-2">
                <Tag size={18} className="text-[#e47b52]" />
                {event.eventType}
              </div>
            </div>

            <div className="mt-7">
              <h2 className="text-xl font-bold text-[#183c2e]">
                About This Event
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-8 text-gray-600">
                {event.description}
              </p>
            </div>

            {/* CREATOR ACTIONS - AUTH WILL BE ADDED LATER */}
            <div className="mt-8 rounded-2xl border border-dashed border-[#dce4da] bg-[#f7f9f5] p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-[#183c2e]"
                />
                <div>
                  <h3 className="font-bold text-[#183c2e]">
                    Event Management
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Edit and Delete controls will be available only to the
                    event creator after login and ownership verification
                    are connected.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled
                  title="Available after authentication is connected"
                  className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-full border border-[#dfe5df] px-4 text-sm font-semibold text-gray-400"
                >
                  <Pencil size={15} />
                  Edit Event
                </button>

                <button
                  type="button"
                  disabled
                  title="Available after authentication is connected"
                  className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-full border border-red-100 px-4 text-sm font-semibold text-gray-400"
                >
                  <Trash2 size={15} />
                  Delete Event
                </button>
              </div>
            </div>
          </section>

          {/* JOIN EVENT CARD */}
          <aside className="rounded-3xl border border-[#e9e9e2] bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9f0e9] text-[#183c2e]">
              <Heart size={23} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#183c2e]">
              Be Part of This Event
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              Join your community, connect with people and contribute to
              something meaningful.
            </p>

            <button
              type="button"
              onClick={() =>
                setNotice(
                  "Join Event will be enabled after registration and login are connected."
                )
              }
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#183c2e] px-5 text-sm font-bold text-white transition hover:bg-[#e47b52]"
            >
              <Heart size={17} />
              Join Event
            </button>

            {notice && (
              <p className="mt-3 rounded-xl bg-[#f7f9f5] p-3 text-xs leading-5 text-[#617067]">
                {notice}
              </p>
            )}

            <div className="mt-6 border-t border-[#edf0eb] pt-5">
              <div className="flex items-center gap-2 text-xs leading-5 text-gray-500">
                <ShieldCheck size={16} className="shrink-0 text-[#e47b52]" />
                Login will be required to join an event.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
