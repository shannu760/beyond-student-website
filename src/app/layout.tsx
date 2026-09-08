import type { Metadata } from "next";
import { Source_Serif_4, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";
import { SmoothScroll } from "@/components/SmoothScroll";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600", "700"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BEYOND — Academic Growth Network & Student Operating Workspace",
  description: "A structured, distraction-free academic workspace for serious students connecting syllabus planning, topic diagnostics, quiet study rooms, and verified opportunities.",
  keywords: [
    "BEYOND",
    "Student Growth Network",
    "JEE Preparation",
    "NEET Preparation",
    "Study Rooms",
    "Academic Guidance",
    "Topic Mastery",
    "National Scholarships"
  ],
  authors: [{ name: "BEYOND Academic Team" }],
  openGraph: {
    title: "BEYOND — Academic Growth Network & Student Operating Workspace",
    description: "Build the discipline to know where you stand, and exactly what to study next.",
    type: "website",
    locale: "en_US",
    siteName: "BEYOND",
  },
  icons: {
    icon: [
      { url: "/images/profile-logo.png", type: "image/png" },
      { url: "/favicon.ico" }
    ],
    shortcut: "/images/profile-logo.png",
    apple: "/images/profile-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourceSerif.variable} ${plusJakarta.variable}`}>
      <body className="font-sans bg-[#F7F5F0] text-[#1A2219] antialiased selection:bg-[#283826] selection:text-[#F7F5F0]">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
