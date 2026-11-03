 
"use client";

import { useEffect, useState } from "react";
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

const galleryImages = [
  {
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=700",
    title: "Community Volunteering",
  },
  {
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=700",
    title: "Protect Our Planet",
  },
  {
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=700",
    title: "Helping Each Other",
  },
  {
    image:
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=700",
    title: "Working Together",
  },
];

const features = [
  {
    number: "01",
    icon: "🔎",
    title: "Discover Events",
    description:
      "Explore meaningful community events and find opportunities to make a difference.",
  },
  {
    number: "02",
    icon: "🤝",
    title: "Join a Community",
    description:
      "Connect with like-minded people and participate in activities around you.",
  },
  {
    number: "03",
    icon: "🌱",
    title: "Create Impact",
    description:
      "Organize your own initiatives and inspire others to build a better future.",
  },
];

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
       const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const response = await fetch(
  `${API_URL}/api/events?limit=6`
);

        if (!response.ok) {
          throw new Error("Could not load events");
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const upcoming = result.data
            .filter(
              (event: Event) =>
                event.eventDate &&
                new Date(event.eventDate).getTime() > Date.now()
            )
            .sort(
              (a: Event, b: Event) =>
                new Date(a.eventDate).getTime() -
                new Date(b.eventDate).getTime()
            );

          setEvents(upcoming.slice(0, 6));
        }
      } catch (error) {
        console.error("Event fetching error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const locationsCount = new Set(
    events.map((event) => event.location)
  ).size;

  const categoriesCount = new Set(
    events.map((event) => event.eventType)
  ).size;

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return;

    setSubscribed(true);
    setEmail("");
  };

  return (
    <div className="overflow-hidden bg-[#fafaf7] font-sans text-[#183c2e]">
      {/* HERO BANNER */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e8eee7] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#315c46]">
            <span className="h-2 w-2 rounded-full bg-[#e47b52]" />
            Together, We Make a Difference
          </span>

          <h1 className="mt-8 text-5xl font-black leading-[1.12] tracking-tight sm:text-6xl lg:text-[76px]">
            Small Actions.
            <span className="mt-2 block text-[#e47b52]">
              Lasting Impact.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-[#68766e]">
            A better world starts with people like you. Discover local
            initiatives, join community events, support people in need
            and make every action count.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/events"
              className="rounded-full bg-[#183c2e] px-8 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-[#e47b52]"
            >
              Explore Events <span className="ml-2">→</span>
            </Link>

            <Link
              href="/register"
              className="rounded-full border border-[#183c2e] px-8 py-4 font-bold transition hover:bg-[#e8eee7]"
            >
              Get Involved
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-10 border-t border-[#e5e8e2] pt-8">
            <div>
              <h3 className="text-3xl font-black">
                {events.length}
              </h3>
              <p className="mt-1 text-sm text-[#78847c]">
                Upcoming Events
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-black">
                {locationsCount}
              </h3>
              <p className="mt-1 text-sm text-[#78847c]">
                Event Locations
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-black">
                {categoriesCount}
              </h3>
              <p className="mt-1 text-sm text-[#78847c]">
                Event Categories
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200"
            alt="Volunteers working together"
            className="h-[420px] w-full rounded-[30px] object-cover shadow-2xl sm:h-[520px]"
          />

          <div className="absolute -bottom-6 left-4 rounded-2xl bg-white p-5 shadow-xl sm:-left-8 sm:p-6">
            <p className="text-sm font-medium text-gray-500">
              Your action matters
            </p>
            <h3 className="mt-1 text-xl font-black">
              Be the Change 🌱
            </h3>
          </div>

          <div className="absolute right-5 top-5 rounded-full bg-white/90 px-5 py-3 text-sm font-bold shadow-lg">
            💚 Spread Kindness
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#183c2e] px-5 py-24 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f09a73]">
              Simple Steps, Real Change
            </p>

            <h2 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
              How GOODWAVE
              <br />
              Makes It Happen.
            </h2>

            <p className="mt-5 leading-7 text-gray-300">
              Making a positive impact should be simple. We connect
              people with opportunities to create meaningful change.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="rounded-3xl border border-white/15 bg-white/[0.06] p-8 transition hover:-translate-y-2 hover:bg-white/[0.1]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{feature.icon}</span>
                  <span className="text-sm font-bold text-[#f09a73]">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-8 text-2xl font-bold">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e47b52]">
                Be Part of Something Good
              </p>

              <h2 className="mt-4 text-4xl font-black sm:text-5xl">
                Recent Upcoming Events
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-[#78847c]">
                Discover opportunities to volunteer, support your
                community and make a difference together.
              </p>
            </div>

            <Link
              href="/events"
              className="font-bold text-[#315c46] transition hover:text-[#e47b52]"
            >
              Explore All Events →
            </Link>
          </div>

          {loading ? (
            <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-[420px] animate-pulse rounded-3xl bg-[#e9eee8]"
                />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="mt-12 rounded-3xl bg-white p-12 text-center shadow-sm">
              <div className="text-5xl">🌱</div>

              <h3 className="mt-5 text-2xl font-bold">
                No Upcoming Events Yet
              </h3>

              <p className="mt-3 text-gray-500">
                Be the first to create an event and inspire your
                community.
              </p>

              <Link
                href="/login"
                className="mt-7 inline-block rounded-full bg-[#183c2e] px-7 py-3 font-bold text-white"
              >
                Create an Event
              </Link>
            </div>
          ) : (
            <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <article
                  key={event._id}
                  className="group overflow-hidden rounded-3xl border border-[#e9e9e2] bg-white transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
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
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-[#e47b52]">
                      <span>📅</span>

                      <span className="font-semibold">
                        {new Date(
                          event.eventDate
                        ).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="mt-4 line-clamp-1 text-xl font-bold text-[#183c2e]">
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
                        View Details →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* COMMUNITY GALLERY */}
      <section className="bg-[#f0f2eb] px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e47b52]">
              Moments That Matter
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              A Community in Action.
            </h2>

            <p className="mt-5 leading-7 text-[#78847c]">
              Every smile, every helping hand and every small action
              creates a story worth sharing.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {galleryImages.map((item, index) => (
              <div
                key={item.title}
                className={`group relative overflow-hidden rounded-3xl ${
                  index === 1 || index === 2 ? "mt-8" : ""
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-110 sm:h-80"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <h3 className="absolute bottom-5 left-4 right-3 text-sm font-bold text-white sm:left-6 sm:text-lg">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY CTA */}
      <section className="px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 overflow-hidden rounded-[35px] bg-[#e9eee7] p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e47b52]">
              Together We Are Stronger
            </p>

            <h2 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
              Your Community.
              <br />
              Your Opportunity.
              <br />
              <span className="text-[#e47b52]">Your Impact.</span>
            </h2>

            <p className="mt-6 max-w-lg leading-7 text-[#68766e]">
              Join GOODWAVE and become part of a growing community
              of people who care about the future. Start with one
              small action today.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-block rounded-full bg-[#183c2e] px-8 py-4 font-bold text-white transition hover:bg-[#e47b52]"
            >
              Become a Volunteer →
            </Link>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1000"
              alt="People celebrating community"
              className="h-[350px] w-full rounded-3xl object-cover sm:h-[420px]"
            />
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-[#183c2e] px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-4xl">✉️</span>

          <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-[#f09a73]">
            Stay Connected
          </p>

          <h2 className="mt-4 text-4xl font-black sm:text-5xl">
            Good Things Are Happening.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-300">
            Get community stories, upcoming events and opportunities
            to make a positive impact delivered to your inbox.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="mx-auto mt-9 flex max-w-xl flex-col gap-3 rounded-2xl bg-white p-2 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="min-w-0 flex-1 rounded-xl px-5 py-4 text-[#183c2e] outline-none"
            />

            <button
              type="submit"
              className="rounded-xl bg-[#e47b52] px-7 py-4 font-bold text-white transition hover:bg-[#c9613b]"
            >
              Subscribe →
            </button>
          </form>

          {subscribed && (
            <p className="mt-4 font-semibold text-[#b9e8c9]">
              Thank you for subscribing!
            </p>
          )}

          <p className="mt-5 text-xs text-gray-400">
            No spam. Just positive stories and meaningful opportunities.
          </p>
        </div>
      </section>
    </div>
  );
}
