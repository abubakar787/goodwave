
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Heart,
  Menu,
  ArrowRight,
  UserRound,
  CalendarCheck,
  LogOut,
  ChevronDown,
  Settings,
  Users,
} from "lucide-react";

import { authClient, useSession } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Upcoming Events", href: "/events" },
];

type UserProfile = {
  name: string;
  email: string;
  image?: string | null;
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const [open, setOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const user = session?.user as UserProfile | undefined;

  const handleSignOut = async () => {
    try {
      await authClient.signOut();

      setProfileMenuOpen(false);
      setOpen(false);

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const accountLinks = [
    {
      label: "My Profile",
      href: "/profile",
      icon: UserRound,
    },
    {
      label: "Create Event",
      href: "/create-event",
      icon: CalendarCheck,
    },
    {
      label: "Manage Events",
      href: "/manage-events",
      icon: Settings,
    },
    {
      label: "Joined Events",
      href: "/joined-events",
      icon: Users,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#e9e9e2] bg-[#fafaf7]/95 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#173f32] text-white">
            <Heart size={23} fill="currentColor" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#173f32]">
              GOODWAVE
            </h1>

            <p className="text-[10px] tracking-[2px] text-gray-500">
              SMALL ACTIONS. LASTING IMPACT.
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition ${
                pathname === link.href
                  ? "text-[#e77b52]"
                  : "text-gray-700 hover:text-[#e77b52]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* DESKTOP AUTH AREA */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200" />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                aria-expanded={profileMenuOpen}
                className="flex items-center gap-3 rounded-full border border-[#e9e9e2] bg-white py-1.5 pl-2 pr-3 transition hover:border-[#173f32]"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e9f0e9] text-[#173f32]">
                    <UserRound size={19} />
                  </div>
                )}

                <span className="max-w-28 truncate text-sm font-semibold text-[#173f32]">
                  {user.name}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-[#173f32] transition ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* PROFILE DROPDOWN */}
              {profileMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close profile menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setProfileMenuOpen(false)}
                  />

                  <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-[#e9e9e2] bg-white p-2 shadow-xl">
                    <div className="flex items-center gap-3 border-b border-[#edf0eb] px-3 py-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e9f0e9] text-[#173f32]">
                          <UserRound size={22} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#173f32]">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="py-2">
                      {accountLinks.map((item) => {
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#f2f5ef] hover:text-[#173f32]"
                          >
                            <Icon size={17} />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>

                    <div className="border-t border-[#edf0eb] pt-2">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut size={17} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-[#173f32]">
                  Login
                </Button>
              </Link>

              <Link href="/register">
                <Button className="rounded-full bg-[#e77b52] px-6 text-white hover:bg-[#d96b43]">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE NAVIGATION */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="flex h-10 w-10 items-center justify-center rounded-md border border-[#e9e9e2] text-[#173f32] md:hidden">
            <Menu size={22} />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>

          <SheetContent side="right" className="w-[300px] bg-[#fafaf7]">
            <div className="mt-10 flex flex-col gap-6">

              {/* MOBILE LOGO */}
              <div className="mb-3 flex items-center gap-2">
                <Heart className="text-[#173f32]" />

                <span className="text-xl font-bold text-[#173f32]">
                  GOODWAVE
                </span>
              </div>

              {/* PUBLIC LINKS */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`font-semibold ${
                    pathname === link.href
                      ? "text-[#e77b52]"
                      : "text-[#173f32]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-[#e9e9e2]" />

              {/* MOBILE AUTH */}
              {isPending ? (
                <p className="text-sm text-gray-500">Loading account...</p>
              ) : user ? (
                <>
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e9f0e9] text-[#173f32]">
                        <UserRound size={22} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate font-bold text-[#173f32]">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {accountLinks.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 font-semibold text-[#173f32] hover:text-[#e77b52]"
                      >
                        <Icon size={18} />
                        {item.label}
                      </Link>
                    );
                  })}

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-3 border-t border-[#e9e9e2] pt-5 text-left font-bold text-red-600"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>

                  <Link href="/register" onClick={() => setOpen(false)}>
                    <Button className="w-full rounded-full bg-[#e77b52] hover:bg-[#d96b43]">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
