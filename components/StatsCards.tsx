export default function StatsCards({ stats }: { stats: { currentStreak: number; bestStreak: number; successRate: number; successfulDays: number } }) {
  const items = [
    ["🔥", "Current Streak", stats.currentStreak],
    ["🏆", "Best Streak", stats.bestStreak],
    ["⭐", "Success Rate This Month", `${stats.successRate}%`],
    ["📊", "Successful Days This Month", stats.successfulDays]
  ];

  return <>
    <div className="grid grid-cols-2 gap-3">{items.map(([icon,label,val])=><div key={String(label)} className="card p-4"><p>{icon}</p><p className="mt-2 text-xs text-slate-400">{label}</p><p className="text-2xl font-bold text-emerald-400">{val}</p></div>)}</div>
    <div className="card mt-4 p-4"><h3 className="font-semibold">Keep going!</h3><p className="mt-1 text-sm text-slate-300">Consistency is what creates results.</p><p className="mt-3 text-2xl">⛰️🚩</p></div>
  </>
}
