import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Discipline Tracker",
  description: "Daily weight loss and discipline tracker"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto min-h-screen w-full max-w-md p-4 pb-20">{children}</main>
      </body>
    </html>
  );
}
