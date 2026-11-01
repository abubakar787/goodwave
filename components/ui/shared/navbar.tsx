 
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Heart, Menu, ArrowRight } from "lucide-react";

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

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-[#fafaf7]/95 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">

        {/* Logo */}
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

        {/* Desktop Navigation */}
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

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 md:flex">
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
        </div>

        {/* Mobile Navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="flex h-10 w-10 items-center justify-center rounded-md border md:hidden">
            <Menu size={22} />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>

          <SheetContent side="right" className="w-[300px] bg-[#fafaf7]">
            <div className="mt-10 flex flex-col gap-6">
              <div className="mb-3 flex items-center gap-2">
                <Heart className="text-[#173f32]" />
                <span className="text-xl font-bold text-[#173f32]">
                  GOODWAVE
                </span>
              </div>

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

              <div className="border-t" />

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
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
