import { DailyEntry, MonthlyStats } from "@/types";

export function isSuccessfulDay(calorie: boolean, gym: boolean, steps: boolean): boolean {
  return calorie && (gym || steps);
}

export function completedGoalCount(entry: Pick<DailyEntry, "calorie_limit_met" | "gym_completed" | "steps_completed">): number {
  return Number(entry.calorie_limit_met) + Number(entry.gym_completed) + Number(entry.steps_completed);
}

export function calculateStreaks(entries: DailyEntry[]): { currentStreak: number; bestStreak: number } {
  const successDates = new Set(entries.filter((e) => e.is_successful).map((e) => e.entry_date));
  const sorted = [...successDates].sort();

  let bestStreak = 0;
  let running = 0;
  let prevDate: Date | null = null;

  for (const d of sorted) {
    const curr = new Date(`${d}T00:00:00Z`);
    if (!prevDate) {
      running = 1;
    } else {
      const diff = (curr.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      running = diff === 1 ? running + 1 : 1;
    }
    bestStreak = Math.max(bestStreak, running);
    prevDate = curr;
  }

  let currentStreak = 0;
  const today = new Date();
  for (let i = 0; i < 3650; i += 1) {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - i);
    const iso = date.toISOString().slice(0, 10);
    if (successDates.has(iso)) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  return { currentStreak, bestStreak };
}

export function calculateMonthlyStats(entries: DailyEntry[], month: Date): MonthlyStats {
  const y = month.getUTCFullYear();
  const m = month.getUTCMonth();
  const monthEntries = entries.filter((e) => {
    const d = new Date(`${e.entry_date}T00:00:00Z`);
    return d.getUTCFullYear() === y && d.getUTCMonth() === m;
  });

  const successfulDays = monthEntries.filter((e) => e.is_successful).length;
  const successRate = monthEntries.length ? Math.round((successfulDays / monthEntries.length) * 100) : 0;
  const streaks = calculateStreaks(entries);

  return {
    currentStreak: streaks.currentStreak,
    bestStreak: streaks.bestStreak,
    successRate,
    successfulDays
  };
}

export function statusMessage(success: boolean): string {
  return success
    ? "Strong discipline today. Keep stacking successful days."
    : "Reset now: nail calories and one movement goal before sleep.";
}
