import Link from "next/link";
import { LeaderboardRow } from "@/types/habits";

type Props = {
  currentUserRow: LeaderboardRow | null;
  topThree: LeaderboardRow[];
};

export default function LeaderboardPreviewCard({ currentUserRow, topThree }: Props) {
  return (
    <section className="card space-y-3 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Leaderboard</h2>
        <Link href="/leaderboard" className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-black">View</Link>
      </div>
      <p className="text-sm text-slate-300">
        {currentUserRow ? `You are #${currentUserRow.rank} this month` : "Join a leaderboard to see your rank"}
      </p>
      <div className="space-y-2">
        {topThree.map((member) => (
          <div key={member.user_id} className="flex items-center justify-between text-sm">
            <span>{member.display_name}</span>
            <span className="text-slate-400">{member.completed_days} days</span>
          </div>
        ))}
      </div>
    </section>
  );
}
