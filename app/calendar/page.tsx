import BottomNav from "@/components/BottomNav";
import CalendarMonth from "@/components/CalendarMonth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/auth/sign-in");

  const { data: entries } = await supabase
    .from("daily_entries")
    .select("*")
    .eq("user_id", data.user.id)
    .order("entry_date", { ascending: true });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Calendar</h1>
      <CalendarMonth entries={entries ?? []} />
      <BottomNav />
    </div>
  );
}
