import SetupProfileForm from "@/components/SetupProfileForm";
import { ensureProfile, getCurrentUser, hasDisplayName } from "@/lib/supabase/profile";
import { redirect } from "next/navigation";

export default async function SetupProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await ensureProfile(user.id);
  if (hasDisplayName(profile)) redirect("/today");

  return (
    <div className="flex min-h-[82vh] items-center justify-center">
      <div className="w-full rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-xl shadow-black/20">
        <SetupProfileForm />
      </div>
    </div>
  );
}
