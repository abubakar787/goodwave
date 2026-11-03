
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient, useSession } from "@/lib/auth-client";

import {
  ArrowLeft,
  Heart,
  CalendarDays,
  MapPin,
  Compass,
  Sprout,
  Loader2,
  Eye,
  AlertCircle,
} from "lucide-react";

type EventData = {
  _id: string;
  title: string;
  description?: string;
  eventType?: string;
  thumbnail?: string;
  location?: string;
  eventDate: string;
};

type JoinedRecord = {
  event?: EventData;
  eventId?: string | { _id: string };
  _id?: string;
  title?: string;
  description?: string;
  eventType?: string;
  thumbnail?: string;
  location?: string;
  eventDate?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const fallbackImage =
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function JoinedEventsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [joinedEvents, setJoinedEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(
        "/login?callbackUrl=/joined-events"
      );
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (isPending || !session) return;

    let cancelled = false;

    const fetchJoinedEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const { data, error: tokenError } =
          await authClient.token();

        if (tokenError || !data?.token) {
          throw new Error("Please login again to view your joined events.");
        }

        const response = await fetch(
          `${API_URL}/api/joined-events`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error(
            result.message || "Unable to load joined events."
          );
        }

        if (!Array.isArray(result.data)) {
          throw new Error("Invalid joined events response.");
        }

        // Supports both populated event objects and flattened records.
        const normalizedEvents = result.data
          .map((record: JoinedRecord) => {
            const event = record.event || record;

            const eventId =
              event._id ||
              (typeof record.eventId === "object"
                ? record.eventId?._id
                : record.eventId);

            if (!eventId || !event.title || !event.eventDate) {
              return null;
            }

            return {
              ...event,
              _id: String(eventId),
            } as EventData;
          })
          .filter(
            (event: EventData | null): event is EventData =>
              event !== null
          )
          .sort(
            (a: EventData, b: EventData) =>
              new Date(a.eventDate).getTime() -
              new Date(b.eventDate).getTime()
          );

        if (!cancelled) {
          setJoinedEvents(normalizedEvents);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchJoinedEvents();

    return () => {
      cancelled = true;
    };
  }, [session, isPending]);

  if (isPending || (!session && loading)) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#fafaf7]">
        <Loader2
          size={25}
          className="animate-spin text-[#183c2e]"
        />
        <span className="ml-3 font-semibold text-[#183c2e]">
          Loading your account...
        </span>
      </main>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-[#fafaf7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* BACK LINK */}
        <Link
          href="/"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#183c2e] transition hover:text-[#e47b52]"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        {/* PAGE HEADER */}
        <section className="relative overflow-hidden rounded-3xl bg-[#183c2e] px-6 py-10 text-white sm:px-10 sm:py-14">
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-36 right-40 h-72 w-72 rounded-full border border-white/10" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#f3a17e]">
              <Heart size={15} />
              My Activities
            </div>

            <h1 className="mt-6 text-3xl font-bold sm:text-4xl lg:text-5xl">
              Joined Events
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
              All the community events you have joined will appear here.
              Keep track of your participation and continue making a
              positive impact.
            </p>

            <div className="mt-7 inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-3">
              <Heart size={20} className="text-[#f3a17e]" />
              <div>
                <p className="text-2xl font-bold">
                  {joinedEvents.length}
                </p>
                <p className="text-xs text-white/60">
                  Events Joined
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* EVENT LIST */}
        <section className="mt-10">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#183c2e]">
                Your Events
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Events you have joined from the GOODWAVE community.
              </p>
            </div>

            <Link
              href="/events"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#183c2e] px-5 text-sm font-bold text-white transition hover:bg-[#e47b52]"
            >
              <Compass size={17} />
              Explore Events
            </Link>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="flex min-h-64 items-center justify-center gap-3 text-sm font-semibold text-[#183c2e]">
              <Loader2 size={22} className="animate-spin" />
              Loading your events...
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
            >
              <AlertCircle size={20} className="shrink-0" />
              <div>
                <p className="font-semibold">
                  Unable to load your joined events
                </p>
                <p className="mt-1">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 font-bold underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && joinedEvents.length === 0 && (
            <div className="rounded-3xl border border-dashed border-[#dce4da] bg-white px-6 py-16 text-center sm:px-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e9f0e9] text-[#183c2e]">
                <Heart size={34} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#183c2e]">
                No Joined Events Yet
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
                You have not joined any events yet. Explore upcoming
                community activities and become part of something meaningful.
              </p>

              <Link
                href="/events"
                className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#e47b52] px-7 text-sm font-bold text-white transition hover:bg-[#d96b43]"
              >
                Explore Upcoming Events
                <Compass size={17} />
              </Link>
            </div>
          )}

          {/* JOINED EVENT CARDS */}
          {!loading && !error && joinedEvents.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {joinedEvents.map((event) => (
                <article
                  key={event._id}
                  className="overflow-hidden rounded-3xl border border-[#e9e9e2] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-56 overflow-hidden bg-[#e9eee8]">
                    <img
                      src={event.thumbnail || fallbackImage}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />

                    {event.eventType && (
                      <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#183c2e] shadow-sm">
                        {event.eventType}
                      </span>
                    )}

                    <span className="absolute bottom-4 left-4 rounded-lg bg-[#183c2e]/90 px-3 py-2 text-xs font-semibold text-white">
                      <CalendarDays className="mr-1 inline-block h-3.5 w-3.5" />
                      {formatDate(event.eventDate)}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="line-clamp-1 text-xl font-bold text-[#183c2e]">
                      {event.title}
                    </h3>
 
                    <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-gray-500">
                      {event.description ||
                        "Be part of this meaningful community event."}
                    </p>



                    <div className="mt-5 flex items-center gap-2 border-t border-[#edf0eb] pt-5 text-sm text-gray-500">
                      <MapPin
                        size={17}
                        className="shrink-0 text-[#e47b52]"
                      />
                      <span className="line-clamp-1">
                        {event.location || "Location not specified"}
                      </span>
                    </div>
                    <div className="mt-6 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#e9f0e9] px-4 py-2 text-xs font-bold text-[#183c2e]">
                        <Heart size={14} />
                        Joined
                      </span>


                      <Link
                        href={`/events/${event._id}`}
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-[#183c2e] px-5 text-sm font-bold text-white transition hover:bg-[#e47b52]"
                      >
                        <Eye size={16} />
                        View Event
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* BOTTOM MESSAGE */}
        <section className="mt-10 flex flex-col items-center gap-3 rounded-3xl bg-[#eef2eb] px-6 py-8 text-center">
          <Sprout size={28} className="text-[#183c2e]" />

          <h3 className="text-lg font-bold text-[#183c2e]">
            Every Participation Matters
          </h3>

          <p className="max-w-lg text-sm leading-6 text-gray-500">
            Your time and effort can make a real difference. Find an event
            that inspires you and take the first step.
          </p>
        </section>
      </div>
    </main>
  );
}
