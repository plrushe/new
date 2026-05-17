"use client";

import GoalToggle from "@/components/GoalToggle";
import StatusCard from "@/components/StatusCard";
import { completedGoalCount, isSuccessfulDay } from "@/lib/habits";
import { createClient } from "@/lib/supabase/client";
import { DailyEntry } from "@/types";
import { useMemo, useState } from "react";

type Props = {
  userId: string;
  initialEntry: DailyEntry;
};

export default function TodayCard({ userId, initialEntry }: Props) {
  const [entry, setEntry] = useState(initialEntry);
  const supabase = createClient();

  const completed = useMemo(() => completedGoalCount(entry), [entry]);
  const success = useMemo(
    () => isSuccessfulDay(entry.calorie_limit_met, entry.gym_completed, entry.steps_completed),
    [entry]
  );

  async function updateField<K extends keyof DailyEntry>(field: K, value: DailyEntry[K]) {
    const next = { ...entry, [field]: value };
    next.is_successful = isSuccessfulDay(next.calorie_limit_met, next.gym_completed, next.steps_completed);
    setEntry(next);

    await supabase.from("daily_entries").upsert(
      {
        user_id: userId,
        entry_date: next.entry_date,
        calorie_limit_met: next.calorie_limit_met,
        gym_completed: next.gym_completed,
        steps_completed: next.steps_completed,
        is_successful: next.is_successful
      },
      { onConflict: "user_id,entry_date" }
    );
  }

  return (
    <div className="space-y-3 rounded-2xl bg-slate-100 p-4">
      <h2 className="text-lg font-semibold">Today&apos;s Goals</h2>
      <GoalToggle
        label="Ate within calorie limit"
        checked={entry.calorie_limit_met}
        onChange={(v) => updateField("calorie_limit_met", v)}
      />
      <GoalToggle
        label="Went to the gym"
        checked={entry.gym_completed}
        onChange={(v) => updateField("gym_completed", v)}
      />
      <GoalToggle
        label="Walked 10,000 steps"
        checked={entry.steps_completed}
        onChange={(v) => updateField("steps_completed", v)}
      />
      <StatusCard isSuccessful={success} completed={completed} />
    </div>
  );
}
