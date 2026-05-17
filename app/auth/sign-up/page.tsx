"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (!error) router.push("/dashboard");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <input className="w-full rounded-xl border p-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" className="w-full rounded-xl border p-3" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="w-full rounded-xl bg-slate-900 p-3 font-semibold text-white">Sign up</button>
    </form>
  );
}
