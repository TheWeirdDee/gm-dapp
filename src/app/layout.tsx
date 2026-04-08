import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gm | Own Your Social Graph",
  description: "Say GM. Build streaks. Earn reputation. Own your social graph.",
  other: {
    "talentapp:project_verification": "5fe4a4a6b2e2883341806ae777a787c8b6ba28c5bb5ce5dca7df48a40a6ec9fcbcfcb7976960fef765b210965dfa0c98bf527a2cb453bc6f2abe28632aaaca3a",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-background)]">
        <Providers>
          <main className="flex-1 w-full">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
