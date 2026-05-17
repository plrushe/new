import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-[80vh] flex-col justify-center gap-6">
      <div>
        <h1 className="text-3xl font-bold">Discipline Tracker</h1>
        <p className="mt-2 text-slate-600">
          Track calories and movement daily. Win the day by hitting calories and at least one movement goal.
        </p>
      </div>
      <div className="grid gap-3">
        <Link href="/auth/sign-up" className="rounded-xl bg-slate-900 p-4 text-center font-semibold text-white">
          Create account
        </Link>
        <Link href="/auth/sign-in" className="rounded-xl border border-slate-300 p-4 text-center font-semibold">
          Log in
        </Link>
      </div>
    </div>
  );
}
