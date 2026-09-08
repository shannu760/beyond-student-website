"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Scissors, Calendar, Image, User } from "lucide-react";

const tabs = [
  { label: "Home", href: "/", icon: Home },
  { label: "Services", href: "/services", icon: Scissors },
  { label: "Book", href: "/booking", icon: Calendar, primary: true },
  { label: "Portfolio", href: "/portfolio", icon: Image },
  { label: "Profile", href: "/account", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-rich-black/98 backdrop-blur-md border-t border-border md:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          if (tab.primary) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center gap-1 -mt-6"
              >
                <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center shadow-lg animate-pulse-gold">
                  <Icon className="w-6 h-6 text-charcoal" />
                </div>
                <span className="text-[10px] font-semibold text-gold uppercase tracking-wider">
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-1 py-1"
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-gold" : "text-text-muted"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-gold" : "text-text-muted"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
