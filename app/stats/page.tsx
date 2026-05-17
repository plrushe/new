import BottomNav from "@/components/BottomNav";
import StatsCards from "@/components/StatsCards";
import { calculateMonthlyStats } from "@/lib/habits";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function StatsPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/auth/sign-in");

  const { data: entries } = await supabase
    .from("daily_entries")
    .select("*")
    .eq("user_id", data.user.id)
    .order("entry_date", { ascending: true });

  const stats = calculateMonthlyStats(entries ?? [], new Date());

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Stats</h1>
      <StatsCards stats={stats} />
      <BottomNav />
    </div>
  );
}
