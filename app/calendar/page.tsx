import BottomNav from "@/components/BottomNav";
import CalendarMonth from "@/components/CalendarMonth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CalendarPage(){const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user) redirect("/login");const {data:entries}=await supabase.from("daily_entries").select("*").eq("user_id",user.id).order("entry_date");
return <div className="space-y-4"><h1 className="text-3xl font-bold">Calendar</h1><CalendarMonth entries={entries??[]} /><BottomNav/></div>}
