import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobClean Notebook",
  description:
    "A Next.js notebook-style web app that teaches fake job data cleaning and visualization.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
