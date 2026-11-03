 
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  X,
  Save,
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
  organizerId?: string;
  organizerEmail?: string;
  createdAt?: string;
};

type EventForm = {
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const eventCategories = [
  "Donation",
  "Cleanup",
  "Plantation",
  "Winter Relief",
  "Food Drive",
  "Health Camp",
  "Education",
];

function getLocalDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getEventForm(event: EventData): EventForm {
  return {
    title: event.title || "",
    description: event.description || "",
    eventType: event.eventType || "",
    thumbnail: event.thumbnail || "",
    location: event.location || "",
    eventDate: event.eventDate
      ? String(event.eventDate).slice(0, 10)
      : "",
  };
}

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const { data: session, isPending } = useSession();

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState<
    "success" | "error"
  >("success");

  const [isJoined, setIsJoined] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState<EventForm>({
    title: "",
    description: "",
    eventType: "",
    thumbnail: "",
    location: "",
    eventDate: "",
  });

  const currentUserId = session?.user?.id;

  // Only the event creator can manage the event.
  const isOwner = Boolean(
    event?.organizerId &&
    currentUserId &&
    event.organizerId === currentUserId
  );

  const showNotice = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setNotice(message);
    setNoticeType(type);
  };

  // Get Better Auth JWT token.
  const getToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error(
        "Your session has expired. Please login again."
      );
    }

    return data.token;
  };

  // Fetch event details.
  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/events/${id}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error(
            result.message || "Event not found."
          );
        }

        const eventData: EventData = result.data;

        setEvent(eventData);
        setForm(getEventForm(eventData));
      } catch (err) {
        if (
          err instanceof Error &&
          err.name !== "AbortError"
        ) {
          setError(
            err.message || "Unable to load event details."
          );
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

  // Check whether the current user has joined.
useEffect(() => {
  if (!id || isPending || !session) {
    return;
  }

  let cancelled = false;

  const checkJoinStatus = async () => {
    try {
      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/events/${id}/join-status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) return;

      if (!cancelled) {
        setIsJoined(
          Boolean(result.data?.joined ?? result.joined)
        );
      }
    } catch {
      if (!cancelled) {
        setIsJoined(false);
      }
    }
  };

  checkJoinStatus();

  return () => {
    cancelled = true;
  };
}, [id, session, isPending]);

  const formattedDate = event?.eventDate
    ? new Date(event.eventDate).toLocaleDateString(
        "en-GB",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : "Date not available";

  // Join event.
  const handleJoin = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/events/${id}`);
      return;
    }

    try {
      setJoinLoading(true);
      setNotice("");

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/events/${id}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Unable to join this event."
        );
      }

      setIsJoined(true);

      showNotice(
        "You have successfully joined this event!"
      );
    } catch (err) {
      showNotice(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
        "error"
      );
    } finally {
      setJoinLoading(false);
    }
  };

  // Update event.
  const handleUpdate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!isOwner) {
      showNotice(
        "You are not authorized to update this event.",
        "error"
      );
      return;
    }

    if (
      !form.title.trim() ||
      !form.description.trim()
    ) {
      showNotice(
        "Please fill in the required fields.",
        "error"
      );
      return;
    }

    if (
      !form.eventType ||
      !form.thumbnail.trim() ||
      !form.location.trim() ||
      !form.eventDate
    ) {
      showNotice(
        "Please complete all event fields.",
        "error"
      );
      return;
    }

    if (form.eventDate <= getLocalDate()) {
      showNotice(
        "Event date must be a future date.",
        "error"
      );
      return;
    }

    try {
      setEditLoading(true);
      setNotice("");

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/events/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: form.title.trim(),
            description: form.description.trim(),
            eventType: form.eventType,
            thumbnail: form.thumbnail.trim(),
            location: form.location.trim(),
            eventDate: form.eventDate,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to update event."
        );
      }

      setEvent((previous) =>
        previous
          ? {
              ...previous,
              ...form,
              title: form.title.trim(),
              description: form.description.trim(),
              thumbnail: form.thumbnail.trim(),
              location: form.location.trim(),
              eventDate: form.eventDate,
            }
          : previous
      );

      setEditMode(false);

      showNotice("Event updated successfully!");
    } catch (err) {
      showNotice(
        err instanceof Error
          ? err.message
          : "Unable to update event.",
        "error"
      );
    } finally {
      setEditLoading(false);
    }
  };

  // Delete event.
  const handleDelete = async () => {
    if (!isOwner) {
      showNotice(
        "You are not authorized to delete this event.",
        "error"
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(true);
      setNotice("");

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/events/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to delete event."
        );
      }

      router.push("/events");
      router.refresh();
    } catch (err) {
      showNotice(
        err instanceof Error
          ? err.message
          : "Unable to delete event.",
        "error"
      );

      setDeleteLoading(false);
    }
  };

  if (loading || isPending) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#fafaf7]">
        <div className="flex items-center gap-3 text-sm font-semibold text-[#183c2e]">
          <Loader2
            className="animate-spin"
            size={22}
          />
          Loading event details...
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#fafaf7] px-4">
        <div className="max-w-md rounded-3xl border border-[#e9e9e2] bg-white p-8 text-center shadow-sm">
          <AlertCircle
            className="mx-auto text-red-500"
            size={38}
          />

          <h1 className="mt-4 text-2xl font-bold text-[#183c2e]">
            Event Not Found
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {error ||
              "This event may have been removed or is unavailable."}
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
                <CalendarDays
                  size={18}
                  className="text-[#e47b52]"
                />
                {formattedDate}
              </div>

              <div className="flex items-center gap-2">
                <MapPin
                  size={18}
                  className="text-[#e47b52]"
                />
                {event.location}
              </div>

              <div className="flex items-center gap-2">
                <Tag
                  size={18}
                  className="text-[#e47b52]"
                />
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

            {/* EVENT MANAGEMENT - OWNER ONLY */}
            {isOwner && (
              <div className="mt-8 rounded-2xl border border-[#dce4da] bg-[#f7f9f5] p-5">
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
                      You are the creator of this event. You can
                      edit or delete it.
                    </p>
                  </div>
                </div>

                {!editMode ? (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setNotice("");
                        setForm(getEventForm(event));
                        setEditMode(true);
                      }}
                      className="inline-flex h-10 items-center gap-2 rounded-full border border-[#dfe5df] px-4 text-sm font-semibold text-[#183c2e] transition hover:bg-white"
                    >
                      <Pencil size={15} />
                      Edit Event
                    </button>

                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      className="inline-flex h-10 items-center gap-2 rounded-full border border-red-200 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      {deleteLoading ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={15} />
                      )}

                      {deleteLoading
                        ? "Deleting..."
                        : "Delete Event"}
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleUpdate}
                    className="mt-5 space-y-4"
                  >
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#183c2e]">
                        Event Title
                      </label>

                      <input
                        required
                        minLength={3}
                        maxLength={100}
                        value={form.title}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            title: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-[#dfe5df] bg-white p-3 text-sm outline-none focus:border-[#183c2e]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#183c2e]">
                        Description
                      </label>

                      <textarea
                        required
                        minLength={10}
                        maxLength={2000}
                        rows={4}
                        value={form.description}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            description: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-[#dfe5df] bg-white p-3 text-sm outline-none focus:border-[#183c2e]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#183c2e]">
                        Event Category
                      </label>

                      <select
                        required
                        value={form.eventType}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            eventType: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-[#dfe5df] bg-white p-3 text-sm outline-none focus:border-[#183c2e]"
                      >
                        <option value="">
                          Select category
                        </option>

                        {eventCategories.map((category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#183c2e]">
                        Thumbnail URL
                      </label>

                      <input
                        required
                        type="url"
                        value={form.thumbnail}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            thumbnail: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-[#dfe5df] bg-white p-3 text-sm outline-none focus:border-[#183c2e]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#183c2e]">
                        Location
                      </label>

                      <input
                        required
                        maxLength={150}
                        value={form.location}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            location: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-[#dfe5df] bg-white p-3 text-sm outline-none focus:border-[#183c2e]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#183c2e]">
                        Event Date
                      </label>

                      <input
                        required
                        type="date"
                        min={getLocalDate()}
                        value={form.eventDate}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            eventDate: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-[#dfe5df] bg-white p-3 text-sm outline-none focus:border-[#183c2e]"
                      />
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={editLoading}
                        className="inline-flex h-11 items-center gap-2 rounded-full bg-[#183c2e] px-5 text-sm font-bold text-white transition hover:bg-[#e47b52] disabled:opacity-60"
                      >
                        {editLoading ? (
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <Save size={16} />
                        )}

                        {editLoading
                          ? "Saving..."
                          : "Save Changes"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setForm(getEventForm(event));
                          setEditMode(false);
                          setNotice("");
                        }}
                        className="inline-flex h-11 items-center gap-2 rounded-full border border-[#dfe5df] px-5 text-sm font-semibold text-[#183c2e]"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
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
              Join your community, connect with people and
              contribute to something meaningful.
            </p>

            <button
              type="button"
              onClick={handleJoin}
              disabled={joinLoading || isJoined}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#183c2e] px-5 text-sm font-bold text-white transition hover:bg-[#e47b52] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {joinLoading ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Heart size={17} />
              )}

              {joinLoading
                ? "Joining..."
                : isJoined
                  ? "Already Joined"
                  : "Join Event"}
            </button>

            {notice && (
              <p
                role="status"
                className={`mt-3 rounded-xl p-3 text-xs leading-5 ${
                  noticeType === "success"
                    ? "bg-[#f0f7ef] text-green-800"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {notice}
              </p>
            )}

            <div className="mt-6 border-t border-[#edf0eb] pt-5">
              <div className="flex items-center gap-2 text-xs leading-5 text-gray-500">
                <ShieldCheck
                  size={16}
                  className="shrink-0 text-[#e47b52]"
                />
                Login is required to join an event.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
