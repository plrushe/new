import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "No Zero Days",
  description: "Small daily wins. Big long-term results."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto min-h-screen w-full max-w-md bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 px-4 pb-24 pt-6">{children}</main>
      </body>
    </html>
  );
}
