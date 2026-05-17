import { requireUserWithProfileSetup } from "@/lib/supabase/profile";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  await requireUserWithProfileSetup();
  redirect("/today");
}
