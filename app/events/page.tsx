 
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient, useSession } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Heart,
  Settings,
  Eye,
  MapPin,
  CalendarDays,
  Loader2,
} from "lucide-react";

type Event = {
  _id: string;
  title: string;
  description?: string;
  eventType: string;
  thumbnail?: string;
  location: string;
  eventDate: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

const fallbackImage =
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EventsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [events, setEvents] = useState<Event[]>([]);
  const [myEventIds, setMyEventIds] = useState<string[]>([]);
  const [joinedEventIds, setJoinedEventIds] = useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [joiningId, setJoiningId] = useState<string | null>(null);

  // Fetch all upcoming events
  useEffect(() => {
    let cancelled = false;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/events`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load events.");
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Invalid events response.");
        }

        if (!cancelled) {
          setEvents(result.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load events."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch user's own events and joined events
  useEffect(() => {
    if (isPending || !session) {
      setMyEventIds([]);
      setJoinedEventIds([]);
      return;
    }

    let cancelled = false;

    const fetchUserEvents = async () => {
      try {
        const { data, error: tokenError } = await authClient.token();

        if (tokenError || !data?.token) {
          return;
        }

        const headers = {
          Authorization: `Bearer ${data.token}`,
        };

        const [myEventsResponse, joinedEventsResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/my-events`, {
              headers,
              cache: "no-store",
            }),
            fetch(`${API_URL}/api/joined-events`, {
              headers,
              cache: "no-store",
            }),
          ]);

        const myEventsResult = await myEventsResponse.json();
        const joinedEventsResult = await joinedEventsResponse.json();

        if (cancelled) return;

        if (
          myEventsResponse.ok &&
          Array.isArray(myEventsResult.data)
        ) {
          setMyEventIds(
            myEventsResult.data.map(
              (event: Event) => event._id
            )
          );
        }

        if (
          joinedEventsResponse.ok &&
          Array.isArray(joinedEventsResult.data)
        ) {
          setJoinedEventIds(
            joinedEventsResult.data
              .map((item: any) => {
                // Supports either eventId or populated event data
                return (
                  item.event?._id ||
                  item.eventId ||
                  item._id
                );
              })
              .filter(Boolean)
          );
        }
      } catch (err) {
        console.error("User events fetching error:", err);
      }
    };

    fetchUserEvents();

    return () => {
      cancelled = true;
    };
  }, [session, isPending]);

  // Filter events
  const filteredEvents = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return events.filter((event) => {
      const isUpcoming =
        event.eventDate &&
        new Date(event.eventDate).getTime() > Date.now();

      const matchesCategory =
        selectedCategory === "ALL" ||
        event.eventType?.toLowerCase() ===
          selectedCategory.toLowerCase();

      const matchesSearch =
        event.title?.toLowerCase().includes(search) ||
        event.location?.toLowerCase().includes(search) ||
        event.description?.toLowerCase().includes(search);

      return (
        isUpcoming &&
        matchesCategory &&
        matchesSearch
      );
    });
  }, [events, selectedCategory, searchTerm]);

  const resetFilters = () => {
    setSelectedCategory("ALL");
    setSearchTerm("");
  };

  // Join Event
  const handleJoinEvent = async (eventId: string) => {
    if (isPending) return;

    if (!session) {
      router.push(
        `/login?callbackUrl=${encodeURIComponent("/events")}`
      );
      return;
    }

    if (joinedEventIds.includes(eventId)) {
      setActionMessage("You have already joined this event.");
      return;
    }

    try {
      setJoiningId(eventId);
      setActionMessage("");

      const { data, error: tokenError } = await authClient.token();

      if (tokenError || !data?.token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(
        `${API_URL}/api/events/${eventId}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${data.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Unable to join this event."
        );
      }

      setJoinedEventIds((previous) => [
        ...previous,
        eventId,
      ]);

      setActionMessage(
        "Successfully joined the event!"
      );
    } catch (err) {
      setActionMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafaf7] text-[#183c2e]">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#183c2e] px-5 py-20 text-white sm:py-24 lg:px-8">
        <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-[#e47b52]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <Badge className="border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f3a17e] hover:bg-white/10">
            Future Community Drives
          </Badge>

          <div className="mt-8 flex flex-col justify-between gap-10 md:flex-row md:items-center">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
                Upcoming Events
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                Discover meaningful community activities, connect
                with volunteers and become part of something
                meaningful. Every small action creates a big impact.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-white/70">
                <span className="rounded-full border border-white/20 px-4 py-2">
                  Make a difference
                </span>

                <span className="rounded-full border border-white/20 px-4 py-2">
                  Meet your community
                </span>
              </div>
            </div>

            <Link href="/create-event">
              <Button
                size="lg"
                className="h-14 rounded-full bg-[#e47b52] px-8 text-base font-semibold text-white hover:bg-[#cf6842]"
              >
                <span className="mr-2 text-xl">+</span>
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Events Listing */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">

        {/* Section Heading */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e47b52]">
              Find Your Opportunity
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Explore All Events
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#78847c] sm:text-base">
              Find an event and make a positive difference.
            </p>
          </div>

          <p className="text-sm font-medium text-[#78847c]">
            {loading
              ? "Loading events..."
              : `${filteredEvents.length} events found`}
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-9 flex flex-wrap gap-2.5">
          {categories.map((category) => (
            <Button
              key={category}
              type="button"
              variant={
                selectedCategory === category
                  ? "default"
                  : "outline"
              }
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "rounded-full bg-[#183c2e] px-5 text-white hover:bg-[#285541]"
                  : "rounded-full border-[#e5e8e2] bg-white px-5 text-[#52675b] hover:border-[#183c2e] hover:bg-[#eef2ed]"
              }
            >
              {category === "ALL" ? "All Events" : category}
            </Button>
          ))}
        </div>

        {/* Search and Reset */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#78847c]">
              ⌕
            </span>

            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events, locations or descriptions..."
              className="h-12 rounded-xl border-[#e5e8e2] bg-white pl-11 text-[#183c2e] shadow-sm placeholder:text-[#9aa49d] focus-visible:ring-[#183c2e]"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={resetFilters}
            className="h-12 rounded-xl border-[#e5e8e2] bg-white px-6 text-[#52675b] hover:bg-[#eef2ed]"
          >
            Reset Filters
          </Button>
        </div>

        {/* Action Message */}
        {actionMessage && (
          <div
            role="status"
            className="mt-5 rounded-xl border border-[#dce8dc] bg-[#eef5ed] px-5 py-3 text-sm font-medium text-[#183c2e]"
          >
            {actionMessage}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={index}
                className="overflow-hidden rounded-2xl border-[#e9e9e2] bg-white"
              >
                <Skeleton className="h-60 w-full rounded-none bg-[#e9eee8]" />

                <CardContent className="space-y-4 p-6">
                  <Skeleton className="h-5 w-2/3 bg-[#e9eee8]" />
                  <Skeleton className="h-4 w-full bg-[#e9eee8]" />
                  <Skeleton className="h-4 w-4/5 bg-[#e9eee8]" />
                  <Skeleton className="mt-5 h-10 w-full bg-[#e9eee8]" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <Card className="mt-10 rounded-2xl border-red-100 bg-white">
            <CardContent className="flex flex-col items-center px-6 py-16 text-center">
              <span className="text-5xl">⚠️</span>

              <h3 className="mt-5 text-2xl font-bold text-[#183c2e]">
                Something Went Wrong
              </h3>

              <p className="mt-3 max-w-md text-sm leading-7 text-[#78847c]">
                {error}
              </p>

              <Button
                onClick={() => window.location.reload()}
                className="mt-6 rounded-full bg-[#183c2e] px-7 hover:bg-[#285541]"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <Card className="mt-10 rounded-2xl border-[#e9e9e2] bg-white">
            <CardContent className="flex flex-col items-center px-6 py-16 text-center">
              <span className="text-6xl">🌱</span>

              <h3 className="mt-6 text-2xl font-bold text-[#183c2e]">
                No Events Found
              </h3>

              <p className="mt-3 max-w-md text-sm leading-7 text-[#78847c]">
                We couldn't find any upcoming events matching your
                search. Try another category or search keyword.
              </p>

              <Button
                onClick={resetFilters}
                className="mt-7 rounded-full bg-[#183c2e] px-7 hover:bg-[#285541]"
              >
                Show All Events
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Event Cards */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
              const isOwner = myEventIds.includes(event._id);
              const isJoined = joinedEventIds.includes(event._id);
              const isJoining = joiningId === event._id;

              return (
                <Card
                  key={event._id}
                  className="group overflow-hidden rounded-2xl border-[#e9e9e2] bg-white py-0 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={event.thumbnail || fallbackImage}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <Badge className="absolute left-4 top-4 border-0 bg-white px-4 py-2 text-xs font-semibold text-[#315c46] shadow-sm hover:bg-white">
                      {event.eventType}
                    </Badge>

                    <div className="absolute bottom-4 left-4 rounded-lg bg-[#183c2e]/90 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm">
                      <CalendarDays className="mr-1 inline-block h-3.5 w-3.5" />
                      {formatDate(event.eventDate)}
                    </div>
                  </div>

                  {/* Card Content */}
                  <CardContent className="p-6">
                    <h3 className="line-clamp-1 text-xl font-bold text-[#183c2e]">
                      {event.title}
                    </h3>

                    <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-[#78847c]">
                      {event.description ||
                        "Join us and become part of a positive change in your community."}
                    </p>

                    <div className="mt-5 flex items-center gap-2 border-t border-[#eeeeea] pt-5 text-sm text-[#78847c]">
                      <MapPin size={16} className="shrink-0" />
                      <span className="line-clamp-1">
                        {event.location}
                      </span>
                    </div>

                    {/* Event Actions */}
                    <div className="mt-5 grid grid-cols-3 gap-2">

                      {/* JOIN */}
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleJoinEvent(event._id)}
                        disabled={isJoining || isJoined || isOwner}
                        className="rounded-full bg-[#e47b52] px-2 text-white hover:bg-[#cf6842] disabled:opacity-60"
                      >
                        {isJoining ? (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        ) : (
                          <Heart className="mr-1 h-4 w-4" />
                        )}
                        {isOwner
                          ? "Your Event"
                          : isJoined
                            ? "Joined"
                            : "Join"}
                      </Button>

                      {/* MANAGE */}
                      {isOwner ? (
                        <Link
                          href="/manage-events"
                          className="inline-flex h-9 items-center justify-center gap-1 rounded-full border border-[#e5e8e2] px-2 text-xs font-medium text-[#183c2e] transition hover:bg-[#eef2ed]"
                        >
                          <Settings className="h-4 w-4" />
                          Manage
                        </Link>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled
                          title="You can only manage your own events."
                          className="cursor-not-allowed rounded-full border-[#e5e8e2] px-2 text-[#9aa49d]"
                        >
                          <Settings className="mr-1 h-4 w-4" />
                          Manage
                        </Button>
                      )}

                      {/* VIEW */}
                      <Link
                        href={`/events/${event._id}`}
                        className="inline-flex h-9 items-center justify-center gap-1 rounded-full px-2 text-xs font-semibold text-[#315c46] transition hover:bg-[#eef2ed] hover:text-[#e47b52]"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#e9eee7] px-5 py-16 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e47b52]">
              Be The Change
            </p>

            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              Have an idea to help your community?
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#68766e] sm:text-base">
              Create an event and inspire others to make a difference.
            </p>
          </div>

          <Link href="/create-event">
            <Button
              size="lg"
              className="h-12 rounded-full bg-[#183c2e] px-8 text-white hover:bg-[#285541]"
            >
              + Create an Event
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
