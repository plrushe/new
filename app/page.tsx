import Link from "next/link";

export default function LandingPage() {
  const features = ["Tick your daily goals", "Track your progress", "Build unstoppable discipline"];
  return <div className="flex min-h-[82vh] flex-col justify-between py-6">
    <div className="space-y-6 text-center"><p className="text-6xl">✅</p><h1 className="text-4xl font-bold">No Zero Days</h1><p className="text-slate-300">Small daily wins. Big long-term results.</p>
      <div className="space-y-3 text-left">{features.map((f)=><div key={f} className="card flex items-center gap-3 p-4"><span className="text-emerald-400">✓</span><p>{f}</p></div>)}</div></div>
    <div className="space-y-3"><Link href="/signup" className="block rounded-2xl bg-emerald-500 p-4 text-center font-semibold text-black">Get Started</Link><Link href="/login" className="block rounded-2xl border border-white/15 bg-slate-900 p-4 text-center font-semibold">Log In</Link><p className="pt-2 text-center text-xs text-slate-500">Stay consistent. See results.</p></div>
  </div>;
}
