import BottomNav from "@/components/BottomNav";
import {
  calculateMonthlyChallengeScore,
  calculateUserStreak,
  calculateWeeklyChallengeScore,
  getDailyWinner,
  isSuccessfulDay
} from "@/lib/habits";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const inviteCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

export default async function ChallengePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: myProfile } = await supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle();
  const { data: myMembership } = await supabase.from("challenge_members").select("challenge_id").eq("user_id", user.id).limit(1).maybeSingle();

  if (!myMembership) {
    return <div className="space-y-4">
      <h1 className="text-3xl font-bold">Challenge</h1>
      <div className="card space-y-3 p-4">
        <h2 className="text-lg font-semibold">Create 1v1 Challenge</h2>
        <form action={createChallenge} className="space-y-2">
          <input name="name" required placeholder="Challenge name" className="w-full rounded-xl border border-white/15 bg-slate-900 p-3" />
          <input name="display_name" required defaultValue={myProfile?.display_name ?? ""} placeholder="Your display name" className="w-full rounded-xl border border-white/15 bg-slate-900 p-3" />
          <button className="w-full rounded-xl bg-emerald-500 p-3 font-semibold text-black">Create challenge</button>
        </form>
      </div>
      <div className="card space-y-3 p-4">
        <h2 className="text-lg font-semibold">Join with Invite Code</h2>
        <form action={joinChallenge} className="space-y-2">
          <input name="code" required placeholder="Invite code" className="w-full rounded-xl border border-white/15 bg-slate-900 p-3 uppercase" />
          <input name="display_name" required defaultValue={myProfile?.display_name ?? ""} placeholder="Your display name" className="w-full rounded-xl border border-white/15 bg-slate-900 p-3" />
          <button className="w-full rounded-xl bg-sky-500 p-3 font-semibold text-black">Join challenge</button>
        </form>
      </div>
      <BottomNav />
    </div>;
  }

  const { data: challenge } = await supabase.from("challenges").select("*").eq("id", myMembership.challenge_id).maybeSingle();
  const { data: members } = await supabase.from("challenge_members").select("user_id").eq("challenge_id", myMembership.challenge_id);
  const ids = members?.map((m) => m.user_id) ?? [];
  const friendId = ids.find((id) => id !== user.id);
  const { data: profiles } = await supabase.from("profiles").select("user_id,display_name").in("user_id", ids);
  const { data: myEntries } = await supabase.from("daily_entries").select("*").eq("user_id", user.id).order("entry_date");
  const { data: friendEntries } = friendId ? await supabase.from("daily_entries").select("*").eq("user_id", friendId).order("entry_date") : { data: [] as any[] };

  const myMonth = calculateMonthlyChallengeScore(myEntries ?? []);
  const friendMonth = calculateMonthlyChallengeScore(friendEntries ?? []);
  const myWeek = calculateWeeklyChallengeScore(myEntries ?? []);
  const friendWeek = calculateWeeklyChallengeScore(friendEntries ?? []);
  const myStreak = calculateUserStreak(myEntries ?? []);
  const friendStreak = calculateUserStreak(friendEntries ?? []);
  const todayISO = new Date().toISOString().slice(0, 10);
  const myToday = (myEntries ?? []).find((e) => e.entry_date === todayISO);
  const friendToday = (friendEntries ?? []).find((e) => e.entry_date === todayISO);
  const diff = myMonth - friendMonth;
  const message = diff > 0 ? `You are winning by ${diff} points` : diff < 0 ? `Your friend is winning by ${Math.abs(diff)} points` : "You are currently tied";
  const myName = profiles?.find((p) => p.user_id === user.id)?.display_name ?? "Me";
  const friendName = profiles?.find((p) => p.user_id === friendId)?.display_name ?? "Friend";

  return <div className="space-y-4">
    <h1 className="text-3xl font-bold">Challenge</h1>
    <div className="card space-y-2 p-4">
      <p className="text-lg font-semibold">{challenge?.name}</p>
      <p className="text-sm text-slate-400">Invite code: <span className="font-semibold text-emerald-400">{challenge?.invite_code}</span></p>
      <p className="rounded-xl bg-slate-900 p-3 text-sm font-semibold">{message}</p>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="card p-4"><p className="text-sm text-slate-400">{myName}</p><p className="text-2xl font-bold text-emerald-400">{myMonth}</p><p className="text-xs">Month</p><p className="mt-2 text-xl font-bold">{myWeek}</p><p className="text-xs">Week</p><p className="mt-2 text-sm">🔥 {myStreak}</p><p className="text-xs">Today: {myToday ? (isSuccessfulDay(myToday) ? "Successful" : "Failed") : "No data"}</p></div>
      <div className="card p-4"><p className="text-sm text-slate-400">{friendName}</p><p className="text-2xl font-bold text-rose-400">{friendMonth}</p><p className="text-xs">Month</p><p className="mt-2 text-xl font-bold">{friendWeek}</p><p className="text-xs">Week</p><p className="mt-2 text-sm">🔥 {friendStreak}</p><p className="text-xs">Today: {friendToday ? (isSuccessfulDay(friendToday) ? "Successful" : "Failed") : "No data"}</p></div>
    </div>
    <div className="card p-4 text-sm">Today winner: {getDailyWinner(myToday, friendToday) === "me" ? "You" : getDailyWinner(myToday, friendToday) === "friend" ? "Friend" : "Draw"}</div>
    <BottomNav />
  </div>;
}

async function createChallenge(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const name = String(formData.get("name") ?? "1v1 Challenge");
  const displayName = String(formData.get("display_name") ?? "Player");
  await supabase.from("profiles").upsert({ user_id: user.id, display_name }, { onConflict: "user_id" });
  const { data: created } = await supabase.from("challenges").insert({ name, invite_code: inviteCode(), created_by: user.id }).select("id").single();
  if (created) await supabase.from("challenge_members").insert({ challenge_id: created.id, user_id: user.id });
  revalidatePath("/challenge");
}

async function joinChallenge(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const code = String(formData.get("code") ?? "").toUpperCase();
  const displayName = String(formData.get("display_name") ?? "Player");
  await supabase.from("profiles").upsert({ user_id: user.id, display_name }, { onConflict: "user_id" });
  const { data: challenge } = await supabase.from("challenges").select("id").eq("invite_code", code).maybeSingle();
  if (!challenge) return;
  const { count } = await supabase.from("challenge_members").select("id", { count: "exact", head: true }).eq("challenge_id", challenge.id);
  if ((count ?? 0) >= 2) return;
  await supabase.from("challenge_members").insert({ challenge_id: challenge.id, user_id: user.id });
  revalidatePath("/challenge");
}
