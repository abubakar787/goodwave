import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import Navbar from "@/components/ui/shared/navbar";
import Footer from "@/components/ui/shared/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GOODWAVE | Small Actions. Lasting Impact.",
    template: "%s | GOODWAVE",
  },
  description:
    "Discover community events, connect with volunteers and create a positive impact with GOODWAVE.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
  className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}    >
      <body className="flex min-h-screen flex-col bg-[#fafaf7]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
