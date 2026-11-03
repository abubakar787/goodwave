
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  explore: [
    { label: "Home", href: "/" },
    { label: "Upcoming Events", href: "/events" },
    { label: "Create Event", href: "/create-event" },
  ],
  account: [
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
    { label: "Joined Events", href: "/joined-events" },
  ],
};

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#153d30] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold tracking-tight">
                GOOD<span className="text-[#f17b50]">WAVE</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-white/70">
              Connecting people through meaningful community activities.
              Small actions can create a lasting impact.
            </p>

            <p className="text-sm font-medium text-[#f17b50]">
              Small Actions. Lasting Impact.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Explore</h3>
            <ul className="space-y-3 text-sm text-white/70">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-[#f17b50]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Your Account</h3>
            <ul className="space-y-3 text-sm text-white/70">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-[#f17b50]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Join Our Community</h3>
            <p className="mb-5 text-sm leading-7 text-white/70">
              Be part of a community that believes in helping others and
              creating positive change.
            </p>

            <Link
  href="/events"
  className="inline-flex items-center justify-center rounded-full bg-[#f17b50] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#df6940]"
>
  Explore Events
</Link>
          </div>
        </div>

        <Separator className="my-10 bg-white/20" />

        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-white/60 md:flex-row md:text-left">
          
          <p>
            © {new Date().getFullYear()} GOODWAVE. All rights reserved.
          </p>

          <p>Made for people who want to make a difference.</p>
        </div>
      </div>
    </footer>
  );
}
