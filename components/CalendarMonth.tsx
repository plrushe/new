"use client";

import DayDetailsCard from "@/components/DayDetailsCard";
import { calculateDaySuccess, getMonthCalendarDays } from "@/lib/habits";
import { DailyEntry } from "@/types/habits";
import { useMemo, useState } from "react";

export default function CalendarMonth({ entries }: { entries: DailyEntry[] }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getUTCMonth());
  const [year, setYear] = useState(now.getUTCFullYear());
  const [selectedISO, setSelectedISO] = useState(now.toISOString().slice(0, 10));
  const map = useMemo(() => new Map(entries.map((e) => [e.entry_date, e])), [entries]);
  const days = getMonthCalendarDays(month, year);
  const selectedEntry = map.get(selectedISO) ?? null;
  const selectedDate = new Date(`${selectedISO}T00:00:00Z`).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  const nav = (dir: number) => {
    const d = new Date(Date.UTC(year, month + dir, 1));
    setMonth(d.getUTCMonth()); setYear(d.getUTCFullYear());
  };

  return <div className="space-y-4">
    <div className="card p-4"><div className="mb-3 flex items-center justify-between"><button onClick={()=>nav(-1)}>←</button><h2 className="font-semibold">{new Date(Date.UTC(year, month,1)).toLocaleDateString(undefined,{month:"long",year:"numeric",timeZone:"UTC"})}</h2><button onClick={()=>nav(1)}>→</button></div>
      <div className="mb-2 grid grid-cols-7 text-center text-xs text-slate-400">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=><p key={d}>{d}</p>)}</div>
      <div className="grid grid-cols-7 gap-2">{days.map((d)=>{const e = map.get(d.iso); const success = e && calculateDaySuccess(e); return <button key={d.iso} onClick={()=>setSelectedISO(d.iso)} className={`aspect-square rounded-full text-xs ${!d.inCurrentMonth?"opacity-30":""} ${e?(success?"bg-emerald-500 text-black":"bg-rose-500"):"bg-slate-800 text-slate-300"} ${selectedISO===d.iso?"ring-2 ring-white":""}`}>{d.date.getUTCDate()}</button>})}</div>
      <div className="mt-4 flex gap-4 text-xs text-slate-300"><span>🟢 Successful</span><span>🔴 Failed</span><span>⚫ No entry</span></div>
    </div>
    <DayDetailsCard entry={selectedEntry} dateLabel={selectedDate} />
  </div>;
}
