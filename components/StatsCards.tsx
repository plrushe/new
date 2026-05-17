import { MonthlyStats } from "@/types";

export default function StatsCards({ stats }: { stats: MonthlyStats }) {
  const items = [
    ["Current streak", `${stats.currentStreak} days`],
    ["Best streak", `${stats.bestStreak} days`],
    ["Success rate", `${stats.successRate}%`],
    ["Successful days", `${stats.successfulDays}`]
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs text-slate-500">{label}</p>
          <p className="mt-1 text-lg font-semibold">{value}</p>
        </div>
      ))}
    </div>
  );
}
