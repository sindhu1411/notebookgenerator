import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NB Heart Disease",
  description:
    "A Next.js notebook-style web app for cleaning and visualizing the Kaggle heart disease dataset.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
