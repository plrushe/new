import { statusMessage } from "@/lib/habits";

type Props = { isSuccessful: boolean; completed: number };

export default function StatusCard({ isSuccessful, completed }: Props) {
  return (
    <div className={`rounded-2xl p-4 text-white ${isSuccessful ? "bg-success" : "bg-danger"}`}>
      <p className="text-lg font-semibold">{isSuccessful ? "Successful day" : "Failed day"}</p>
      <p className="text-sm">{completed}/3 goals completed</p>
      <p className="mt-2 text-sm opacity-95">{statusMessage(isSuccessful)}</p>
    </div>
  );
}
