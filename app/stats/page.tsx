import BottomNav from "@/components/BottomNav";
import StatsCards from "@/components/StatsCards";
import { calculateBestStreak, calculateCurrentStreak, calculateDaySuccess, calculateMonthlySuccessRate } from "@/lib/habits";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function StatsPage(){const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user) redirect("/login");const {data:entries}=await supabase.from("daily_entries").select("*").eq("user_id",user.id).order("entry_date");const list=entries??[];const now=new Date();const successfulDays=list.filter(e=>{const d=new Date(`${e.entry_date}T00:00:00Z`);return d.getUTCMonth()===now.getUTCMonth()&&d.getUTCFullYear()===now.getUTCFullYear()&&calculateDaySuccess(e)}).length;
return <div className="space-y-4"><h1 className="text-3xl font-bold">Stats</h1><StatsCards stats={{currentStreak:calculateCurrentStreak(list),bestStreak:calculateBestStreak(list),successRate:calculateMonthlySuccessRate(list),successfulDays}}/><BottomNav/></div>}
