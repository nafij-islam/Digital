import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DigiVault — Premium Digital Tools & Subscriptions Marketplace",
  description:
    "Buy genuine Canva Pro, ChatGPT Plus, JetBrains, Windows 11 keys, and digital subscriptions in Bangladesh with instant bKash & Nagad payments.",
  keywords: [
    "digital subscriptions",
    "canva pro bangladesh",
    "chatgpt plus bkash",
    "windows 11 key",
    "jetbrains all products",
    "software license bd",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="font-sans antialiased bg-[#F8FAFC] text-slate-900 min-h-screen flex flex-col selection:bg-blue-500 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
