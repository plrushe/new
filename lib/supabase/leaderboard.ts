import { createClient } from "@/lib/supabase/server";
import { LeaderboardRow } from "@/types/leaderboard";

export async function getSiteLeaderboard(): Promise<LeaderboardRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_site_leaderboard");

  if (error || !data) {
    return [];
  }

  return data as LeaderboardRow[];
}
