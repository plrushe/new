"use client";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage(){const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [show,setShow]=useState(false);const [error,setError]=useState("");const supabase=createClient();const router=useRouter();
const onSubmit=async(e:React.FormEvent)=>{e.preventDefault();const {error}=await supabase.auth.signUp({email,password});if(error)setError(error.message);else router.push("/today")};
return <form onSubmit={onSubmit} className="space-y-4"><h1 className="text-3xl font-bold">Sign Up</h1><p className="text-sm text-slate-400">Create your account and start today.</p><input className="w-full rounded-2xl border border-white/10 bg-slate-900 p-4" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/><div className="relative"><input className="w-full rounded-2xl border border-white/10 bg-slate-900 p-4 pr-12" placeholder="Password" type={show?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} required/><button type="button" className="absolute right-3 top-4 text-sm text-slate-400" onClick={()=>setShow(!show)}>{show?"Hide":"Show"}</button></div>{error&&<p className="text-sm text-rose-300">{error}</p>}<button className="w-full rounded-2xl bg-emerald-500 p-4 font-semibold text-black">Create Account</button><p className="text-sm text-slate-400">Already have an account? <Link href="/login" className="text-emerald-400">Log in</Link></p></form>}
