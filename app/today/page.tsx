import BottomNav from "@/components/BottomNav";
import TodayGoalsCard from "@/components/TodayGoalsCard";
import { calculateCurrentStreak } from "@/lib/habits";
import { createClient } from "@/lib/supabase/server";
import { DailyEntry } from "@/types/habits";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function TodayPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: entry }, { data: entries }] = await Promise.all([
    supabase.from("daily_entries").select("*").eq("user_id", user.id).eq("entry_date", today).maybeSingle(),
    supabase.from("daily_entries").select("*").eq("user_id", user.id).order("entry_date")
  ]);
  const initialEntry: DailyEntry = entry ?? { id:"", user_id:user.id, entry_date:today, calorie_limit_met:false, gym_completed:false, steps_completed:false, created_at:new Date().toISOString(), updated_at:new Date().toISOString() };
  const streak = calculateCurrentStreak(entries ?? []);
  return <div className="space-y-4"><header className="flex items-start justify-between"><div><h1 className="text-3xl font-bold">Today</h1><p className="text-sm text-slate-400">{new Date(`${today}T00:00:00Z`).toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long",timeZone:"UTC"})}</p></div><div className="rounded-full border border-white/15 bg-slate-900 px-3 py-1 text-sm">🔥 {streak}</div></header>
  <TodayGoalsCard userId={user.id} initialEntry={initialEntry} />
  <Link href="/calendar" className="card flex items-center justify-between p-4"><span>View Calendar</span><span>›</span></Link>
  <BottomNav /></div>;
}
