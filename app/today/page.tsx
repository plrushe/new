import BottomNav from "@/components/BottomNav";
import LeaderboardPreviewCard from "@/components/LeaderboardPreviewCard";
import TodayGoalsCard from "@/components/TodayGoalsCard";
import { calculateCurrentStreak } from "@/lib/habits";
import { getCurrentMonthDateRange, getCurrentUserRank, rankLeaderboardMembers } from "@/lib/leaderboard";
import { createClient } from "@/lib/supabase/server";
import { DailyEntry } from "@/types/habits";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function TodayPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: entry }, { data: entries }, { data: member }] = await Promise.all([
    supabase.from("daily_entries").select("*").eq("user_id", user.id).eq("entry_date", today).maybeSingle(),
    supabase.from("daily_entries").select("*").eq("user_id", user.id).order("entry_date"),
    supabase.from("leaderboard_members").select("leaderboard_id").eq("user_id", user.id).order("joined_at").limit(1).maybeSingle()
  ]);
  const initialEntry: DailyEntry = entry ?? { id:"", user_id:user.id, entry_date:today, calorie_limit_met:false, gym_completed:false, steps_completed:false, created_at:new Date().toISOString(), updated_at:new Date().toISOString() };
  const streak = calculateCurrentStreak(entries ?? []);

  let previewTop: any[] = [];
  let currentUserRow = null;
  if (member?.leaderboard_id) {
    const { data: members } = await supabase.from("leaderboard_members").select("user_id, joined_at").eq("leaderboard_id", member.leaderboard_id);
    const userIds = (members ?? []).map((m) => m.user_id);
    const { data: profiles } = await supabase.from("profiles").select("user_id, display_name").in("user_id", userIds);
    const { startDate, endDate } = getCurrentMonthDateRange();
    const { data: boardEntries } = await supabase.from("daily_entries").select("user_id, entry_date, calorie_limit_met, gym_completed, steps_completed").in("user_id", userIds).gte("entry_date", startDate).lte("entry_date", endDate);
    const byUser = new Map<string, any[]>();
    (boardEntries ?? []).forEach((e) => { const list = byUser.get(e.user_id) ?? []; list.push(e); byUser.set(e.user_id, list); });
    const ranked = rankLeaderboardMembers((members ?? []).map((m) => ({ user_id: m.user_id, joined_at: m.joined_at, display_name: profiles?.find((p) => p.user_id === m.user_id)?.display_name ?? "Member", completed_days: (byUser.get(m.user_id) ?? []).filter((e) => e.calorie_limit_met && (e.gym_completed || e.steps_completed)).length })));
    previewTop = ranked.slice(0, 3);
    currentUserRow = getCurrentUserRank(ranked, user.id);
  }

  return <div className="space-y-4"><header className="flex items-start justify-between"><div><h1 className="text-3xl font-bold">Today</h1><p className="text-sm text-slate-400">{new Date(`${today}T00:00:00Z`).toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long",timeZone:"UTC"})}</p></div><div className="rounded-full border border-white/15 bg-slate-900 px-3 py-1 text-sm">🔥 {streak}</div></header>
  <TodayGoalsCard userId={user.id} initialEntry={initialEntry} />
  <LeaderboardPreviewCard currentUserRow={currentUserRow} topThree={previewTop} />
  <Link href="/calendar" className="card flex items-center justify-between p-4"><span>View Calendar</span><span>›</span></Link>
  <BottomNav /></div>;
}
