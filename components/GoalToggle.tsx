"use client";

type GoalToggleProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function GoalToggle({ label, checked, onChange }: GoalToggleProps) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-base font-medium shadow-sm">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-6 w-6 accent-slate-900"
      />
    </label>
  );
}
