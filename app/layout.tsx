import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voice Chess Pro - Play Chess with Your Voice",
  description: "Revolutionary voice-controlled chess game. Speak your moves and play chess hands-free with advanced voice recognition technology.",
  keywords: "voice chess, speech recognition, chess game, voice controlled chess, online chess",
  authors: [{ name: "Voice Chess Pro Team" }]
};

// Next.js 13+ requires viewport and themeColor to be exported separately
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7c3aed"
};
// Removed separate themeColor export; now inside metadata
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E♟%3C/text%3E%3C/svg%3E" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}