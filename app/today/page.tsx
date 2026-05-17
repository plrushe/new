import { createClient } from "@/lib/supabase/server";
import { requireUserWithProfileSetup } from "@/lib/supabase/profile";
import BottomNav from "@/components/BottomNav";
import TodayGoalsCard from "@/components/TodayGoalsCard";
import { calculateCurrentStreak } from "@/lib/habits";
import { DailyEntry } from "@/types/habits";
import Link from "next/link";
import { getSiteLeaderboard } from "@/lib/supabase/leaderboard";

export default async function TodayPage() {
  const { user } = await requireUserWithProfileSetup();
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: entry }, { data: entries }, leaderboard] = await Promise.all([
    supabase.from("daily_entries").select("*").eq("user_id", user.id).eq("entry_date", today).maybeSingle(),
    supabase.from("daily_entries").select("*").eq("user_id", user.id).order("entry_date"),
    getSiteLeaderboard()
  ]);
  const initialEntry: DailyEntry = entry ?? { id:"", user_id:user.id, entry_date:today, calorie_limit_met:false, gym_completed:false, steps_completed:false, created_at:new Date().toISOString(), updated_at:new Date().toISOString() };
  const streak = calculateCurrentStreak(entries ?? []);
  return <div className="space-y-4"><header className="flex items-start justify-between"><div><h1 className="text-3xl font-bold">Today</h1><p className="text-sm text-slate-400">{new Date(`${today}T00:00:00Z`).toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long",timeZone:"UTC"})}</p></div><div className="rounded-full border border-white/15 bg-slate-900 px-3 py-1 text-sm">🔥 {streak}</div></header>
  <TodayGoalsCard userId={user.id} initialEntry={initialEntry} />
  <Link href="/calendar" className="card flex items-center justify-between p-4"><span>View Calendar</span><span>›</span></Link>
  <section className="card space-y-3 p-4">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Leaderboard</h2>
      <Link href="/leaderboard" className="text-sm text-emerald-300">View Leaderboard</Link>
    </div>
    <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
      {(() => {
        const myRow = leaderboard.find((row) => row.user_id === user.id);
        return <p className="text-sm text-slate-300">Your rank: <span className="font-semibold text-white">#{myRow?.rank ?? "-"}</span> · Completed days: <span className="font-semibold text-white">{myRow?.completed_days ?? 0}</span></p>;
      })()}
    </div>
    <ul className="space-y-2">
      {leaderboard.slice(0, 3).map((row) => <li key={row.user_id} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm"><span className="text-slate-200">#{row.rank} {row.display_name}</span><span className="text-slate-300">{row.completed_days} days</span></li>)}
    </ul>
  </section>
  <BottomNav /></div>;
}
