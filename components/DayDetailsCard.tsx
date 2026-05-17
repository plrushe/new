import { calculateDaySuccess } from "@/lib/habits";
import { DailyEntry } from "@/types/habits";

export default function DayDetailsCard({ entry, dateLabel }: { entry: DailyEntry | null; dateLabel: string }) {
  if (!entry) return <div className="card p-4 text-sm text-slate-400">No entry for this day.</div>;
  const Row = ({ n, ok }: { n: string; ok: boolean }) => <p className="flex justify-between text-sm"><span>{n}</span><span>{ok ? "✓" : "✕"}</span></p>;
  return <div className="card space-y-2 p-4">
    <h3 className="font-semibold">{dateLabel}</h3>
    <Row n="Ate within calorie limit" ok={entry.calorie_limit_met} />
    <Row n="Went to the gym" ok={entry.gym_completed} />
    <Row n="Walked 10,000 steps" ok={entry.steps_completed} />
    <p className="pt-2 font-semibold">Result: {calculateDaySuccess(entry) ? "Successful" : "Failed"}</p>
  </div>;
}
