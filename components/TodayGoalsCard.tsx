"use client";

import GoalToggle from "@/components/GoalToggle";
import { createClient } from "@/lib/supabase/client";
import { DailyEntry, EntryGoalKey } from "@/types/habits";
import StatusCard from "@/components/StatusCard";
import { useState } from "react";

export default function TodayGoalsCard({ userId, initialEntry }: { userId: string; initialEntry: DailyEntry }) {
  const [entry, setEntry] = useState(initialEntry);
  const supabase = createClient();

  const updateGoal = async (key: EntryGoalKey) => {
    const next = { ...entry, [key]: !entry[key] };
    setEntry(next);
    await supabase.from("daily_entries").upsert({
      user_id: userId,
      entry_date: next.entry_date,
      calorie_limit_met: next.calorie_limit_met,
      gym_completed: next.gym_completed,
      steps_completed: next.steps_completed
    }, { onConflict: "user_id,entry_date" });
  };

  return <div className="card space-y-3 p-4">
    <h2 className="text-lg font-semibold">Today&apos;s Goals</h2>
    <p className="text-sm text-slate-400">Tick your goals for today</p>
    <GoalToggle title="Ate within calorie limit" icon="🍽️" checked={entry.calorie_limit_met} onToggle={() => updateGoal("calorie_limit_met")} />
    <GoalToggle title="Went to the gym" icon="🏋️" checked={entry.gym_completed} onToggle={() => updateGoal("gym_completed")} />
    <GoalToggle title="Walked 10,000 steps" icon="👟" checked={entry.steps_completed} onToggle={() => updateGoal("steps_completed")} />
    <StatusCard entry={entry} />
  </div>
}
