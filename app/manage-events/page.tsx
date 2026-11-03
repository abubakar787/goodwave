
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  Tag,
  Eye,
  Pencil,
  Trash2,
  Loader2,
  Plus,
  AlertCircle,
} from "lucide-react";

import { authClient, useSession } from "@/lib/auth-client";

type EventData = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ManageEventsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login?callbackUrl=/manage-events");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (isPending || !session) return;

    let cancelled = false;

    const fetchMyEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const { data, error: tokenError } = await authClient.token();

        if (tokenError || !data?.token) {
          throw new Error("Please login again to manage your events.");
        }

        const response = await fetch(`${API_URL}/api/my-events`, {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error(result.message || "Unable to load your events.");
        }

        if (!cancelled) {
          setEvents(Array.isArray(result.data) ? result.data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Something went wrong."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMyEvents();

    return () => {
      cancelled = true;
    };
  }, [isPending, session]);

  const handleDelete = async (eventId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(eventId);
      setError("");

      const { data, error: tokenError } = await authClient.token();

      if (tokenError || !data?.token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(`${API_URL}/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Unable to delete event.");
      }

      setEvents((previous) =>
        previous.filter((event) => event._id !== eventId)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete event."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#fafaf7]">
        <div className="flex items-center gap-3 font-semibold text-[#183c2e]">
          <Loader2 size={23} className="animate-spin" />
          Loading your events...
        </div>
      </main>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-[#fafaf7] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e47b52]">
              Your Dashboard
            </p>

            <h1 className="mt-3 text-3xl font-bold text-[#183c2e] sm:text-4xl">
              Manage Events
            </h1>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              Manage, update and organize the events you have created.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#183c2e] px-6 text-sm font-bold text-white transition hover:bg-[#e47b52]"
          >
            <Plus size={20} />
            Create New Event
          </Link>
        </div>

        {/* SUMMARY */}
        <div className="mb-8 rounded-2xl border border-[#e9e9e2] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Events Created
          </p>
          <h2 className="mt-2 text-3xl font-bold text-[#183c2e]">
            {events.length}
          </h2>
        </div>

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!error && events.length === 0 && (
          <div className="rounded-3xl border border-[#e9e9e2] bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e9f0e9] text-[#183c2e]">
              <CalendarDays size={30} />
            </div>

            <h2 className="mt-6 text-xl font-bold text-[#183c2e]">
              No Events Created Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
              You have not created any events yet. Start by creating an event
              and bring your community together.
            </p>

            <Link
              href="/create-event"
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#183c2e] px-7 text-sm font-bold text-white transition hover:bg-[#e47b52]"
            >
              <Plus size={17} />
              Create Your First Event
            </Link>
          </div>
        )}

        {/* EVENT LIST */}
        {events.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="overflow-hidden rounded-3xl border border-[#e9e9e2] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-52 overflow-hidden bg-[#e9eee8]">
                  <img
                    src={event.thumbnail}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-2 text-xs font-bold text-[#183c2e] shadow-sm">
                    {event.eventType}
                  </span>
                </div>

                <div className="p-6">
                  <h2 className="line-clamp-1 text-xl font-bold text-[#183c2e]">
                    {event.title}
                  </h2>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
                    {event.description}
                  </p>

                  <div className="mt-5 space-y-3 border-t border-[#edf0eb] pt-5 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={17} className="text-[#e47b52]" />
                      {new Date(event.eventDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={17} className="text-[#e47b52]" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Tag size={17} className="text-[#e47b52]" />
                      {event.eventType}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-2">
                    <Link
                      href={`/events/${event._id}`}
                      className="inline-flex h-10 items-center justify-center gap-1 rounded-full bg-[#e9f0e9] text-xs font-bold text-[#183c2e] transition hover:bg-[#dce8dc]"
                    >
                      <Eye size={14} />
                      View
                    </Link>

                    <Link
                      href={`/events/${event._id}`}
                      className="inline-flex h-10 items-center justify-center gap-1 rounded-full border border-[#dfe5df] text-xs font-bold text-[#183c2e] transition hover:bg-[#f6f8f5]"
                    >
                      <Pencil size={14} />
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(event._id)}
                      disabled={deletingId === event._id}
                      className="inline-flex h-10 items-center justify-center gap-1 rounded-full border border-red-100 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId === event._id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
