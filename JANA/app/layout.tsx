import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notebook Data Studio",
  description:
    "A Next.js notebook-style web app for switching between heart disease and fake job cleaning demos.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
