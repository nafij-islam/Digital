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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=localStorage.getItem("dg_appearance_settings");if(d){var s=JSON.parse(d);if(s&&s.backgroundColor){document.documentElement.style.setProperty("--site-bg",s.backgroundColor);if(s.surfaceColor)document.documentElement.style.setProperty("--site-surface",s.surfaceColor);if(s.primaryColor)document.documentElement.style.setProperty("--site-primary",s.primaryColor);if(s.secondaryColor)document.documentElement.style.setProperty("--site-secondary",s.secondaryColor);}}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className="font-sans antialiased text-[#101828] min-h-screen flex flex-col selection:bg-blue-600 selection:text-white"
        style={{ backgroundColor: "var(--site-bg, #F3F5F9)" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
