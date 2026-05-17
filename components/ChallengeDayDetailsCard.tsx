import { DailyEntry, DailyWinner } from "@/types/habits";
import { calculateDailyPoints, isSuccessfulDay } from "@/lib/habits";

export default function ChallengeDayDetailsCard({
  dateLabel,
  myEntry,
  friendEntry,
  winner
}: {
  dateLabel: string;
  myEntry: DailyEntry | null;
  friendEntry: DailyEntry | null;
  winner: DailyWinner;
}) {
  const winnerText = winner === "me" ? "You won the day" : winner === "friend" ? "Your friend won the day" : "Day is a draw";
  const Row = ({ name, entry }: { name: string; entry: DailyEntry | null }) => <div className="rounded-xl bg-slate-900 p-3">
    <p className="text-sm font-semibold">{name}</p>
    <p className="text-xs text-slate-400">Points: {calculateDailyPoints(entry)}</p>
    <p className="text-xs text-slate-400">Successful: {entry ? (isSuccessfulDay(entry) ? "Yes" : "No") : "No data"}</p>
  </div>;

  return <div className="card space-y-3 p-4">
    <h3 className="font-semibold">{dateLabel}</h3>
    <Row name="Me" entry={myEntry} />
    <Row name="Friend" entry={friendEntry} />
    <p className="rounded-xl bg-slate-900 p-3 text-sm font-semibold">Daily winner: {winnerText}</p>
  </div>;
}
