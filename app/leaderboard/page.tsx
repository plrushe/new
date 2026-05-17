import BottomNav from "@/components/BottomNav";
import { requireUserWithProfileSetup } from "@/lib/supabase/profile";
import { getSiteLeaderboard } from "@/lib/supabase/leaderboard";

export default async function LeaderboardPage() {
  const { user } = await requireUserWithProfileSetup();
  const leaderboard = await getSiteLeaderboard();

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-sm text-slate-400">Completed days across all users</p>
      </header>

      <section className="card overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
        <ul className="divide-y divide-white/10">
          {leaderboard.map((row) => {
            const isCurrentUser = row.user_id === user.id;
            const topThreeClass = row.rank <= 3 ? "bg-emerald-500/5" : "";
            const currentUserClass = isCurrentUser ? "bg-emerald-500/15" : "";

            return (
              <li
                key={row.user_id}
                className={`flex items-center justify-between px-4 py-3 ${topThreeClass} ${currentUserClass}`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="w-8 shrink-0 text-sm font-semibold text-slate-300">#{row.rank}</span>
                  <div className="truncate text-base font-medium">
                    {row.display_name}
                    {isCurrentUser ? (
                      <span className="ml-2 rounded-full border border-emerald-300/40 bg-emerald-300/10 px-2 py-0.5 text-xs text-emerald-200">
                        You
                      </span>
                    ) : null}
                  </div>
                </div>
                <span className="text-sm text-slate-300">{row.completed_days} days</span>
              </li>
            );
          })}
        </ul>
      </section>

      <BottomNav />
    </div>
  );
}
