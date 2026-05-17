import { DailyEntry, LeaderboardRow } from "@/types/habits";

export function isSuccessfulDay(entry: Pick<DailyEntry, "calorie_limit_met" | "gym_completed" | "steps_completed">): boolean {
  return entry.calorie_limit_met && (entry.gym_completed || entry.steps_completed);
}

export function getCurrentMonthDateRange() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));
  return { startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10) };
}

export function getCompletedDaysForRange(entries: DailyEntry[], startDate?: string, endDate?: string): number {
  return entries.filter((entry) => {
    if (!isSuccessfulDay(entry)) return false;
    if (startDate && entry.entry_date < startDate) return false;
    if (endDate && entry.entry_date > endDate) return false;
    return true;
  }).length;
}

export function rankLeaderboardMembers(members: Omit<LeaderboardRow, "rank">[]): LeaderboardRow[] {
  return members
    .sort((a, b) => b.completed_days - a.completed_days || new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime())
    .map((member, index) => ({ ...member, rank: index + 1 }));
}

export function getCurrentUserRank(members: LeaderboardRow[], currentUserId: string) {
  return members.find((member) => member.user_id === currentUserId) ?? null;
}
