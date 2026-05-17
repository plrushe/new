"use client";

import ChallengeDayDetailsCard from "@/components/ChallengeDayDetailsCard";
import DayDetailsCard from "@/components/DayDetailsCard";
import { getDailyWinner, getMonthCalendarDays, isSuccessfulDay } from "@/lib/habits";
import { DailyEntry } from "@/types/habits";
import { useMemo, useState } from "react";

export default function CalendarMonth({ entries, friendEntries }: { entries: DailyEntry[]; friendEntries?: DailyEntry[] }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getUTCMonth());
  const [year, setYear] = useState(now.getUTCFullYear());
  const [selectedISO, setSelectedISO] = useState(now.toISOString().slice(0, 10));
  const map = useMemo(() => new Map(entries.map((e) => [e.entry_date, e])), [entries]);
  const friendMap = useMemo(() => new Map((friendEntries ?? []).map((e) => [e.entry_date, e])), [friendEntries]);
  const days = getMonthCalendarDays(month, year);
  const selectedEntry = map.get(selectedISO) ?? null;
  const selectedFriendEntry = friendMap.get(selectedISO) ?? null;
  const selectedDate = new Date(`${selectedISO}T00:00:00Z`).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  const nav = (dir: number) => {
    const d = new Date(Date.UTC(year, month + dir, 1));
    setMonth(d.getUTCMonth()); setYear(d.getUTCFullYear());
  };

  return <div className="space-y-4">
    <div className="card p-4"><div className="mb-3 flex items-center justify-between"><button onClick={()=>nav(-1)}>←</button><h2 className="font-semibold">{new Date(Date.UTC(year, month,1)).toLocaleDateString(undefined,{month:"long",year:"numeric",timeZone:"UTC"})}</h2><button onClick={()=>nav(1)}>→</button></div>
      <div className="mb-2 grid grid-cols-7 text-center text-xs text-slate-400">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=><p key={d}>{d}</p>)}</div>
      <div className="grid grid-cols-7 gap-2">{days.map((d)=>{const e = map.get(d.iso); const fe = friendMap.get(d.iso); const winner = getDailyWinner(e, fe); const hasCompare = !!friendEntries; const klass = !hasCompare ? (e ? (isSuccessfulDay(e) ? "bg-emerald-500 text-black" : "bg-rose-500") : "bg-slate-800 text-slate-300") : (winner === "me" ? "bg-emerald-500 text-black" : winner === "friend" ? "bg-rose-500" : "bg-slate-700 text-slate-200");
        return <button key={d.iso} onClick={()=>setSelectedISO(d.iso)} className={`relative aspect-square rounded-2xl text-xs ${!d.inCurrentMonth?"opacity-30":""} ${klass} ${selectedISO===d.iso?"ring-2 ring-white":""}`}><span>{d.date.getUTCDate()}</span>{hasCompare && <span className="absolute bottom-1 left-1 right-1 flex justify-center gap-1"><span className={`h-1.5 w-1.5 rounded-full ${e ? (isSuccessfulDay(e)?"bg-emerald-200":"bg-rose-200") : "bg-slate-400"}`}/><span className={`h-1.5 w-1.5 rounded-full ${fe ? (isSuccessfulDay(fe)?"bg-emerald-200":"bg-rose-200") : "bg-slate-400"}`}/></span>}</button>})}</div>
    </div>
    {friendEntries ? <ChallengeDayDetailsCard dateLabel={selectedDate} myEntry={selectedEntry} friendEntry={selectedFriendEntry} winner={getDailyWinner(selectedEntry, selectedFriendEntry)} /> : <DayDetailsCard entry={selectedEntry} dateLabel={selectedDate} />}
  </div>;
}
