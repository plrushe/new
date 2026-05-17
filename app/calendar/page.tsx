import BottomNav from "@/components/BottomNav";
import CalendarMonth from "@/components/CalendarMonth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: entries } = await supabase.from("daily_entries").select("*").eq("user_id", user.id).order("entry_date");
  const { data: memberships } = await supabase.from("challenge_members").select("challenge_id,user_id").eq("user_id", user.id).limit(1);

  let friendEntries: any[] = [];
  if (memberships?.[0]) {
    const challengeId = memberships[0].challenge_id;
    const { data: members } = await supabase.from("challenge_members").select("user_id").eq("challenge_id", challengeId);
    const friendId = members?.find((m) => m.user_id !== user.id)?.user_id;
    if (friendId) {
      const { data } = await supabase.from("daily_entries").select("*").eq("user_id", friendId).order("entry_date");
      friendEntries = data ?? [];
    }
  }

  return <div className="space-y-4"><h1 className="text-3xl font-bold">Calendar</h1><CalendarMonth entries={entries ?? []} friendEntries={friendEntries} /><BottomNav/></div>;
}
