import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  user_id: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
};

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
  return data;
}

export async function ensureProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const existing = await getProfile(userId);
  if (existing) return existing;

  const { data, error } = await supabase
    .from("profiles")
    .insert({ user_id: userId, display_name: null })
    .select("*")
    .single();

  if (error) {
    const fallback = await getProfile(userId);
    return fallback;
  }

  return data;
}

export function hasDisplayName(profile: Pick<Profile, "display_name"> | null): boolean {
  if (!profile?.display_name) return false;
  return profile.display_name.trim().length >= 2;
}

export async function updateDisplayName(userId: string, displayName: string) {
  const supabase = await createClient();
  const cleaned = displayName.trim();
  return supabase.from("profiles").update({ display_name: cleaned }).eq("user_id", userId);
}

export async function requireUserWithProfileSetup() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await ensureProfile(user.id);
  if (!hasDisplayName(profile)) redirect("/setup-profile");

  return { user, profile };
}
