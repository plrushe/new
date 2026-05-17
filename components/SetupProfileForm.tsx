"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MIN_LEN = 2;
const MAX_LEN = 20;

function validateDisplayName(input: string): string | null {
  const cleaned = input.trim();
  if (!cleaned) return "Display name is required.";
  if (cleaned.length < MIN_LEN) return "Display name must be at least 2 characters.";
  if (cleaned.length > MAX_LEN) return "Display name must be 20 characters or fewer.";
  return null;
}

export default function SetupProfileForm() {
  const supabase = createClient();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateDisplayName(displayName);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    const cleaned = displayName.trim();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      router.replace("/login");
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ display_name: cleaned })
      .eq("user_id", user.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.replace("/today");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="text-3xl font-bold">Choose your display name</h1>
      <p className="text-sm text-slate-400">This is the name that will appear in the app.</p>
      <input
        className="w-full rounded-2xl border border-white/10 bg-slate-900 p-4 text-lg"
        placeholder="Enter display name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        maxLength={MAX_LEN}
        autoFocus
      />
      {error && <p className="text-sm text-rose-300">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-2xl bg-emerald-500 p-4 text-lg font-semibold text-black disabled:opacity-70"
      >
        {saving ? "Saving..." : "Continue"}
      </button>
    </form>
  );
}
