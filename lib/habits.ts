import { CalendarDay, DailyEntry } from "@/types/habits";

import { isSuccessfulDay } from "@/lib/leaderboard";

export function calculateDaySuccess(entry: Pick<DailyEntry, "calorie_limit_met" | "gym_completed" | "steps_completed">): boolean {
  return isSuccessfulDay(entry);
}

export function getGoalsCompletedCount(entry: Pick<DailyEntry, "calorie_limit_met" | "gym_completed" | "steps_completed">): number {
  return Number(entry.calorie_limit_met) + Number(entry.gym_completed) + Number(entry.steps_completed);
}

const toUTCDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
const toISO = (d: Date) => d.toISOString().slice(0, 10);

export function calculateCurrentStreak(entries: DailyEntry[]): number {
  const successful = new Set(entries.filter(calculateDaySuccess).map((e) => e.entry_date));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 3650; i += 1) {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i));
    if (successful.has(toISO(d))) streak += 1;
    else break;
  }
  return streak;
}

export function calculateBestStreak(entries: DailyEntry[]): number {
  const dates = entries.filter(calculateDaySuccess).map((e) => e.entry_date).sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const iso of dates) {
    const curr = toUTCDate(iso);
    if (!prev) run = 1;
    else run = (curr.getTime() - prev.getTime()) / 86400000 === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = curr;
  }
  return best;
}

export function calculateMonthlySuccessRate(entries: DailyEntry[]): number {
  const now = new Date();
  const monthEntries = entries.filter((e) => {
    const d = toUTCDate(e.entry_date);
    return d.getUTCFullYear() === now.getUTCFullYear() && d.getUTCMonth() === now.getUTCMonth();
  });
  if (!monthEntries.length) return 0;
  const successful = monthEntries.filter(calculateDaySuccess).length;
  return Math.round((successful / monthEntries.length) * 100);
}

export function getMonthCalendarDays(month: number, year: number): CalendarDay[] {
  const first = new Date(Date.UTC(year, month, 1));
  const mondayIndex = (first.getUTCDay() + 6) % 7;
  const start = new Date(Date.UTC(year, month, 1 - mondayIndex));
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + i));
    return { date, iso: toISO(date), inCurrentMonth: date.getUTCMonth() === month };
  });
}
