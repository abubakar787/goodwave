 
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Event = {
  _id: string;
  title: string;
  description?: string;
  eventType: string;
  thumbnail?: string;
  location: string;
  eventDate: string;
};

const categories = [
  "ALL",
  "Donation",
  "Cleanup",
  "Plantation",
  "Winter Relief",
  "Food Drive",
  "Health Camp",
  "Education",
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Upcoming Events from Backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/events"
        );

        if (!response.ok) {
          throw new Error("Failed to load events");
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setEvents(result.data);
        } else {
          throw new Error("Invalid events response");
        }
      } catch (error) {
        console.error("Events fetching error:", error);
        setError("Unable to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter Events by Category and Search
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const isUpcoming =
        event.eventDate &&
        new Date(event.eventDate).getTime() > Date.now();

      const matchesCategory =
        selectedCategory === "ALL" ||
        event.eventType?.toLowerCase() ===
          selectedCategory.toLowerCase();

      const search = searchTerm.trim().toLowerCase();

      const matchesSearch =
        event.title.toLowerCase().includes(search) ||
        event.location.toLowerCase().includes(search);

      return isUpcoming && matchesCategory && matchesSearch;
    });
  }, [events, selectedCategory, searchTerm]);

  return (
    <main className="min-h-screen bg-[#fafaf7] text-[#183c2e]">

      {/* HERO SECTION */}
      <section className="bg-[#183c2e] px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f09a73]">
            Future Community Drives
          </p>

          <div className="mt-5 flex flex-col justify-between gap-7 md:flex-row md:items-center">

            <div>
              <h1 className="text-4xl font-black sm:text-6xl">
                Upcoming Events
              </h1>

              <p className="mt-5 max-w-2xl leading-7 text-gray-300">
                Discover meaningful community activities, connect
                with volunteers and become part of something
                meaningful. Every small action creates a big impact.
              </p>
            </div>

            <Link
              href="/create-event"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#e47b52] px-7 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-[#c9613b]"
            >
              <span className="text-xl">+</span>
              Create Event
            </Link>

          </div>
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">

        {/* SECTION TITLE */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e47b52]">
              Find Your Opportunity
            </p>

            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              Explore All Events
            </h2>

            <p className="mt-3 text-sm text-[#78847c]">
              Find an event and make a positive difference.
            </p>
          </div>

          <div className="text-sm font-semibold text-[#78847c]">
            {loading ? "Loading events..." : `${filteredEvents.length} events found`}
          </div>

        </div>

        {/* CATEGORY FILTER */}
        <div className="mt-10 flex flex-wrap gap-3">

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                selectedCategory === category
                  ? "bg-[#183c2e] text-white shadow-lg"
                  : "border border-[#e5e8e2] bg-white text-[#52675b] hover:border-[#183c2e] hover:text-[#183c2e]"
              }`}
            >
              {category === "ALL" ? "All" : category}
            </button>
          ))}

        </div>

        {/* SEARCH BAR */}
        <div className="mt-7 flex flex-col gap-4 sm:flex-row">

          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-[#e5e8e2] bg-white px-5 py-4 shadow-sm">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#78847c]"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events or areas..."
              className="w-full bg-transparent text-sm text-[#183c2e] outline-none placeholder:text-[#9aa49d]"
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-sm font-bold text-[#e47b52]"
              >
                Clear
              </button>
            )}

          </div>

          <button
            onClick={() => {
              setSelectedCategory("ALL");
              setSearchTerm("");
            }}
            className="rounded-2xl border border-[#e5e8e2] bg-white px-7 py-4 text-sm font-bold transition hover:bg-[#e8eee7]"
          >
            Reset Filters
          </button>

        </div>

        {/* LOADING SKELETON */}
        {loading ? (

          <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-[420px] animate-pulse rounded-3xl bg-[#e9eee8]"
              />
            ))}

          </div>

        ) : error ? (

          /* ERROR MESSAGE */
          <div className="mt-12 rounded-3xl bg-white p-12 text-center shadow-sm">

            <div className="text-5xl">⚠️</div>

            <h3 className="mt-5 text-2xl font-bold">
              Something Went Wrong
            </h3>

            <p className="mt-3 text-[#78847c]">
              {error}
            </p>

          </div>

        ) : filteredEvents.length === 0 ? (

          /* EMPTY STATE */
          <div className="mt-12 rounded-3xl bg-white px-6 py-16 text-center shadow-sm">

            <div className="text-6xl">🌱</div>

            <h3 className="mt-6 text-2xl font-black">
              No Events Found
            </h3>

            <p className="mx-auto mt-3 max-w-md leading-7 text-[#78847c]">
              We couldn't find any upcoming events matching your
              search. Try another category or search keyword.
            </p>

            <button
              onClick={() => {
                setSelectedCategory("ALL");
                setSearchTerm("");
              }}
              className="mt-7 rounded-full bg-[#183c2e] px-7 py-3 font-bold text-white transition hover:bg-[#e47b52]"
            >
              Show All Events
            </button>

          </div>

        ) : (

          /* EVENT CARDS */
          <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">

            {filteredEvents.map((event) => (

              <article
                key={event._id}
                className="group overflow-hidden rounded-3xl border border-[#e9e9e2] bg-white transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >

                {/* EVENT IMAGE */}
                <div className="relative overflow-hidden">

                  <img
                    src={
                      event.thumbnail ||
                      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800"
                    }
                    alt={event.title}
                    className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#315c46] shadow">
                    {event.eventType}
                  </span>

                  <span className="absolute bottom-4 left-4 rounded-lg bg-[#183c2e]/90 px-3 py-2 text-xs font-semibold text-white">
                    📅{" "}
                    {new Date(event.eventDate).toLocaleDateString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>

                </div>

                {/* EVENT INFORMATION */}
                <div className="p-6">

                  <h3 className="line-clamp-1 text-xl font-black text-[#183c2e]">
                    {event.title}
                  </h3>

                  <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-[#78847c]">
                    {event.description ||
                      "Join us and become part of a positive change in your community."}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-[#eeeeea] pt-5">

                    <span className="text-sm text-[#78847c]">
                      📍 {event.location}
                    </span>

                    <Link
                      href={`/events/${event._id}`}
                      className="font-bold text-[#315c46] transition hover:text-[#e47b52]"
                    >
                      View Event →
                    </Link>

                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

      {/* BOTTOM CTA */}
      <section className="bg-[#e9eee7] px-5 py-16 lg:px-8">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 md:flex-row md:items-center">

          <div>
            <h2 className="text-3xl font-black">
              Have an idea to help your community?
            </h2>

            <p className="mt-3 text-[#68766e]">
              Create an event and inspire others to make a difference.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex items-center justify-center rounded-full bg-[#183c2e] px-8 py-4 font-bold text-white transition hover:bg-[#e47b52]"
          >
            + Create an Event
          </Link>

        </div>

      </section>

    </main>
  );
}
