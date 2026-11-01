
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  CalendarDays,
  MapPin,
  Compass,
  Sprout,
  Loader2,
} from "lucide-react";

export default function JoinedEventsPage() {
  // Authentication and joined-events API will be connected later.
  // No demo events are displayed because the current user is not authenticated.

  const joinedEvents: never[] = [];
  const loading = false;

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

          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-sm font-semibold text-[#183c2e]">
              <Loader2 size={22} className="animate-spin" />
              Loading your events...
            </div>
          ) : joinedEvents.length === 0 ? (
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
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {joinedEvents.map((event) => (
                <div key={event._id}>
                  {/* Event cards will be rendered from the authenticated API. */}
                </div>
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
