import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "./landing.css";

export const metadata: Metadata = {
  title: "snipit",
  description:
    "a tiny thermal printer for your phone. pastel prints, golden-hour vibes.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/photos/favicon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/photos/apple-touch-icon.png",
  },
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