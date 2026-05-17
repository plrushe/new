"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/today", label: "Today", icon: "🏁" },
  { href: "/calendar", label: "Calendar", icon: "📅" },
  { href: "/stats", label: "Stats", icon: "📈" }
];

export default function BottomNav() {
  const pathname = usePathname();
  return <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-slate-950/95 px-3 pb-6 pt-2 backdrop-blur">
    <div className="mx-auto flex max-w-md justify-around">
      {items.map((i)=>{
        const active = pathname.startsWith(i.href);
        return <Link key={i.href} href={i.href} className={`flex min-w-20 flex-col items-center rounded-2xl px-3 py-2 text-xs ${active?"text-emerald-400":"text-slate-400"}`}><span>{i.icon}</span>{i.label}</Link>
      })}
    </div>
  </nav>
}
