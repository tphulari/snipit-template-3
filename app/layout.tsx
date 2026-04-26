import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "./landing.css";

export const metadata: Metadata = {
  title: "snipit · making the most of your memories.",
  description:
    "a tiny thermal printer for your phone. pastel prints, golden-hour vibes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
