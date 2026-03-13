import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "OTC Wellness AI",
  description: "A presentation-ready AI wellness SaaS for OTC product guidance.",
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
