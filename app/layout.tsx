import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Spirit Guide — Midnight Sanctuary",
  description:
    "A sanctuary for the inner life. Rituals, meditation and reflection designed to help you return to what is real.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
