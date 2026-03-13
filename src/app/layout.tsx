import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AI OTC Personalized Suggestion System",
  description: "A medication-aware OTC recommendation engine with symptom interpretation, safety filtering, and explainable guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} bg-[var(--background)] font-[var(--font-sans)] text-[var(--foreground)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
