import BottomNav from "@/components/BottomNav";
import { getCurrentMonthDateRange, getCurrentUserRank, rankLeaderboardMembers } from "@/lib/leaderboard";
import { createClient } from "@/lib/supabase/server";
import { DailyEntry, LeaderboardRow } from "@/types/habits";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const generateInviteCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();
async function createLeaderboard(formData: FormData) { "use server"; const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return; const name = String(formData.get("name") ?? "").trim(); if (!name) return; const invite_code = generateInviteCode(); const { data: leaderboard } = await supabase.from("leaderboards").insert({ name, invite_code, created_by: user.id }).select("id").single(); if (leaderboard) await supabase.from("leaderboard_members").insert({ leaderboard_id: leaderboard.id, user_id: user.id }); revalidatePath("/leaderboard"); }
async function joinLeaderboard(formData: FormData) { "use server"; const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return; const inviteCode = String(formData.get("invite_code") ?? "").trim().toUpperCase(); const { data: board } = await supabase.from("leaderboards").select("id").eq("invite_code", inviteCode).maybeSingle(); if (board) await supabase.from("leaderboard_members").upsert({ leaderboard_id: board.id, user_id: user.id }, { onConflict: "leaderboard_id,user_id" }); revalidatePath("/leaderboard"); }

export default async function LeaderboardPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range } = await searchParams;
  const selectedRange = range === "all" ? "all" : "month";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: memberRow } = await supabase.from("leaderboard_members").select("leaderboard_id").eq("user_id", user.id).order("joined_at").limit(1).maybeSingle();

  if (!memberRow) return <div className="space-y-4"><h1 className="text-3xl font-bold">Leaderboard</h1><div className="card space-y-4 p-4"><p className="text-slate-300">You are not in a leaderboard yet.</p><form action={createLeaderboard} className="space-y-2"><label className="text-sm text-slate-400">Create a leaderboard</label><input name="name" required className="w-full rounded-xl border border-white/15 bg-slate-900 p-3" placeholder="Weekend Warriors" /><button className="w-full rounded-xl bg-emerald-500 p-3 font-semibold text-black">Create</button></form><form action={joinLeaderboard} className="space-y-2"><label className="text-sm text-slate-400">Join with invite code</label><input name="invite_code" required className="w-full rounded-xl border border-white/15 bg-slate-900 p-3 uppercase" placeholder="ABC123" /><button className="w-full rounded-xl border border-white/15 bg-slate-900 p-3 font-semibold">Join</button></form></div><BottomNav/></div>;

  const { data: board } = await supabase.from("leaderboards").select("id,name,invite_code").eq("id", memberRow.leaderboard_id).single();
  const { data: members } = await supabase.from("leaderboard_members").select("user_id, joined_at").eq("leaderboard_id", memberRow.leaderboard_id);
  const userIds = (members ?? []).map((m) => m.user_id);
  const { data: profiles } = await supabase.from("profiles").select("user_id, display_name").in("user_id", userIds);
  const { startDate, endDate } = getCurrentMonthDateRange();
  const entryQuery = supabase.from("daily_entries").select("user_id, entry_date, calorie_limit_met, gym_completed, steps_completed").in("user_id", userIds);
  const { data: entries } = selectedRange === "month" ? await entryQuery.gte("entry_date", startDate).lte("entry_date", endDate) : await entryQuery;
  const entriesByUser = new Map<string, DailyEntry[]>();
  (entries ?? []).forEach((entry) => { const list = entriesByUser.get(entry.user_id) ?? []; list.push(entry as DailyEntry); entriesByUser.set(entry.user_id, list); });

  const rows = rankLeaderboardMembers((members ?? []).map((m) => ({ user_id: m.user_id, display_name: profiles?.find((p) => p.user_id === m.user_id)?.display_name ?? "Member", joined_at: m.joined_at, completed_days: (entriesByUser.get(m.user_id) ?? []).filter((e) => e.calorie_limit_met && (e.gym_completed || e.steps_completed)).length })));
  const currentUser = getCurrentUserRank(rows as LeaderboardRow[], user.id);

  return <div className="space-y-4 pb-3"><h1 className="text-3xl font-bold">Leaderboard</h1><div className="card space-y-2 p-4"><p className="text-xl font-semibold">{board?.name}</p><p className="text-sm text-slate-400">Invite code: <span className="font-mono text-slate-200">{board?.invite_code}</span></p></div><div className="grid grid-cols-2 gap-2"><a href="/leaderboard?range=month" className={`rounded-xl p-3 text-center ${selectedRange === "month" ? "bg-emerald-500 text-black" : "bg-slate-900"}`}>This Month</a><a href="/leaderboard?range=all" className={`rounded-xl p-3 text-center ${selectedRange === "all" ? "bg-emerald-500 text-black" : "bg-slate-900"}`}>All Time</a></div><div className="space-y-2">{rows.map((row) => <div key={row.user_id} className={`rounded-2xl border p-3 ${row.rank === 1 ? "border-yellow-300 bg-yellow-500/10" : row.rank <= 3 ? "border-white/25 bg-white/5" : "border-white/10 bg-slate-900"}`}><div className="flex items-center justify-between"><p className="font-semibold">#{row.rank} {row.display_name} {row.user_id === user.id ? <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">You</span> : null}</p><p className="text-slate-300">{row.completed_days} days</p></div></div>)}</div>{currentUser ? <p className="text-center text-sm text-slate-400">You are #{currentUser.rank} with {currentUser.completed_days} days.</p> : null}<BottomNav /></div>;
}
