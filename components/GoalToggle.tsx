"use client";

type Props = { title: string; icon: string; checked: boolean; onToggle: () => void };

export default function GoalToggle({ title, icon, checked, onToggle }: Props) {
  return <button onClick={onToggle} className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-slate-800/60 p-4 text-left">
    <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-700/80 text-xl">{icon}</div>
    <p className="flex-1 text-sm font-medium text-slate-100">{title}</p>
    <div className={`grid h-9 w-9 place-items-center rounded-lg border ${checked?"border-emerald-400 bg-emerald-500 text-black":"border-white/20 bg-slate-900"}`}>{checked?"✓":""}</div>
  </button>
}
