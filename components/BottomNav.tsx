"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Today" },
  { href: "/calendar", label: "Calendar" },
  { href: "/stats", label: "Stats" }
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-2 md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${active ? "bg-slate-900 text-white" : "text-slate-600"}`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
