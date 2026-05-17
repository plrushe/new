import BottomNav from "@/components/BottomNav";
import TodayCard from "@/components/TodayCard";
import { createClient } from "@/lib/supabase/server";
import { isSuccessfulDay } from "@/lib/habits";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) redirect("/auth/sign-in");

  const today = new Date().toISOString().slice(0, 10);
  const { data: entry } = await supabase
    .from("daily_entries")
    .select("*")
    .eq("user_id", user.id)
    .eq("entry_date", today)
    .maybeSingle();

  const initialEntry =
    entry ??
    {
      id: "",
      user_id: user.id,
      entry_date: today,
      calorie_limit_met: false,
      gym_completed: false,
      steps_completed: false,
      is_successful: isSuccessfulDay(false, false, false),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Today</p>
          <h1 className="text-xl font-bold">{today}</h1>
        </div>
        <a href="/logout" className="text-sm font-medium text-slate-600">Log out</a>
      </div>
      <TodayCard userId={user.id} initialEntry={initialEntry} />
      <BottomNav />
    </div>
  );
}
