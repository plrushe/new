import { calculateDaySuccess, getGoalsCompletedCount } from "@/lib/habits";
import { DailyEntry } from "@/types/habits";

export default function StatusCard({ entry }: { entry: DailyEntry }) {
  const success = calculateDaySuccess(entry);
  const completed = getGoalsCompletedCount(entry);
  return <div className={`card p-5 ${success?"border-emerald-500/40 bg-emerald-950/30":"border-rose-500/40 bg-rose-950/20"}`}>
    <p className="text-3xl">{success?"✅":"❌"}</p>
    <h3 className={`mt-2 text-xl font-semibold ${success?"text-emerald-300":"text-rose-300"}`}>{success?"Successful Day!":"Failed Day"}</h3>
    <p className="mt-1 text-sm text-slate-300">{completed}/3 goals completed</p>
    <p className="mt-3 text-sm text-slate-300">{success?"Great work! Keep the momentum going.":"Reset and win tomorrow."}</p>
  </div>
}
