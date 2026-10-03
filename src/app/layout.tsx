import type { Metadata } from "next";
import { allFontVariablesClass } from "@/lib/fonts";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://shop.nafij.com"),
  title: {
    default: "shop.nafij — Premium Digital Tools & Subscriptions Marketplace",
    template: "%s | shop.nafij",
  },
  description:
    "Buy genuine Canva Pro, ChatGPT Plus, Gemini Advanced, JetBrains, Windows 11 keys, and digital subscriptions with instant automated delivery.",
  keywords: [
    "shop.nafij",
    "digital subscriptions",
    "canva pro bangladesh",
    "chatgpt plus bkash",
    "gemini advanced",
    "software license bd",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shop.nafij.com",
    siteName: "shop.nafij",
    title: "shop.nafij — Premium Digital Tools & Subscriptions Marketplace",
    description:
      "Buy genuine Canva Pro, ChatGPT Plus, Gemini Advanced, JetBrains, Windows 11 keys, and digital subscriptions with instant automated delivery.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={allFontVariablesClass}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=localStorage.getItem("dg_appearance_settings");if(d){var s=JSON.parse(d);if(s){var root=document.documentElement;if(s.backgroundColor)root.style.setProperty("--site-bg",s.backgroundColor);if(s.surfaceColor)root.style.setProperty("--site-surface",s.surfaceColor);if(s.primaryColor)root.style.setProperty("--site-primary",s.primaryColor);if(s.secondaryColor)root.style.setProperty("--site-secondary",s.secondaryColor);if(s.productCardHeightMode==="AUTO")root.style.setProperty("--product-card-height","auto");else if(s.productCardHeightMode==="CUSTOM"&&s.productCardHeight)root.style.setProperty("--product-card-height",s.productCardHeight+"px");else root.style.setProperty("--product-card-height","390px");}}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className="font-serif antialiased text-[#F5F5FA] min-h-screen flex flex-col selection:bg-[#5754D8] selection:text-white bg-[#29294D]"
        style={{
          fontFamily: '"Times New Roman", Times, Baskerville, Georgia, serif',
          backgroundColor: "var(--site-bg, #29294D)",
          color: "var(--text-main, #F5F5FA)",
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
