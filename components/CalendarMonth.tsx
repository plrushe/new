"use client";

import { DailyEntry } from "@/types";
import { useMemo, useState } from "react";

function color(entry?: DailyEntry) {
  if (!entry) return "bg-slate-200";
  return entry.is_successful ? "bg-green-500" : "bg-red-500";
}

export default function CalendarMonth({ entries }: { entries: DailyEntry[] }) {
  const [selected, setSelected] = useState<DailyEntry | null>(null);
  const map = useMemo(() => new Map(entries.map((e) => [e.entry_date, e])), [entries]);

  const today = new Date();
  const year = today.getUTCFullYear();
  const month = today.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const days = Array.from({ length: daysInMonth }, (_, idx) => {
    const date = new Date(Date.UTC(year, month, idx + 1)).toISOString().slice(0, 10);
    return { date, entry: map.get(date) };
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => (
          <button
            key={d.date}
            className={`aspect-square rounded-lg text-xs text-white ${color(d.entry)}`}
            onClick={() => setSelected(d.entry ?? null)}
          >
            {Number(d.date.slice(-2))}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        {selected ? (
          <div className="space-y-1 text-sm">
            <p className="font-semibold">{selected.entry_date}</p>
            <p>Calories: {selected.calorie_limit_met ? "Yes" : "No"}</p>
            <p>Gym: {selected.gym_completed ? "Yes" : "No"}</p>
            <p>Steps: {selected.steps_completed ? "Yes" : "No"}</p>
            <p>Status: {selected.is_successful ? "Successful" : "Failed"}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Tap a day to view details.</p>
        )}
      </div>
    </div>
  );
}
