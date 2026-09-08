import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "BARBER STUDIO | Premium Grooming & Online Booking",
  description:
    "Premium grooming, experienced barbers, and effortless online booking. Look sharp. Feel confident.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="bg-rich-black text-text-primary font-body antialiased">
        <Navbar />
        <main className="min-h-screen pb-16 md:pb-0">{children}</main>
        <Footer />
        <MobileNav />
        <WhatsAppButton />
      </body>
    </html>
  );
}
