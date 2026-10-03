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
            __html: `(function(){try{var d=localStorage.getItem("dg_appearance_settings");if(d){var s=JSON.parse(d);if(s){var r=document.documentElement;if(s.backgroundColor){r.style.setProperty("--site-bg",s.backgroundColor);document.body&&(document.body.style.backgroundColor=s.backgroundColor);}if(s.surfaceColor)r.style.setProperty("--site-surface",s.surfaceColor);if(s.primaryColor)r.style.setProperty("--site-primary",s.primaryColor);if(s.secondaryColor)r.style.setProperty("--site-secondary",s.secondaryColor);if(s.navbarBgColor)r.style.setProperty("--site-navbar-bg",s.navbarBgColor);if(s.navbarTextColor)r.style.setProperty("--site-navbar-text",s.navbarTextColor);if(s.navbarBorderColor)r.style.setProperty("--site-navbar-border",s.navbarBorderColor);if(s.cardBgColor)r.style.setProperty("--site-card-bg",s.cardBgColor);if(s.cardBorderColor)r.style.setProperty("--site-card-border",s.cardBorderColor);if(s.cardHoverBorderColor)r.style.setProperty("--site-card-hover-border",s.cardHoverBorderColor);if(s.textMainColor){r.style.setProperty("--site-text-main",s.textMainColor);r.style.setProperty("--text-main",s.textMainColor);}if(s.textSecondaryColor){r.style.setProperty("--site-text-secondary",s.textSecondaryColor);r.style.setProperty("--text-secondary",s.textSecondaryColor);}if(s.textMutedColor){r.style.setProperty("--site-text-muted",s.textMutedColor);r.style.setProperty("--text-muted",s.textMutedColor);}if(s.baseFontSize){r.style.setProperty("--site-base-font-size",s.baseFontSize+"px");r.style.fontSize=s.baseFontSize+"px";}if(s.detailsBgColor)r.style.setProperty("--site-details-bg",s.detailsBgColor);if(s.detailsBayBgColor)r.style.setProperty("--site-details-bay-bg",s.detailsBayBgColor);if(s.detailsBorderColor)r.style.setProperty("--site-details-border",s.detailsBorderColor);if(s.detailsAccentColor)r.style.setProperty("--site-details-accent",s.detailsAccentColor);if(s.detailsPriceColor)r.style.setProperty("--site-details-price",s.detailsPriceColor);if(s.detailsBtnBgColor)r.style.setProperty("--site-details-btn-bg",s.detailsBtnBgColor);if(s.detailsBtnTextColor)r.style.setProperty("--site-details-btn-text",s.detailsBtnTextColor);if(s.productCardHeightMode==="AUTO")r.style.setProperty("--product-card-height","auto");else if(s.productCardHeightMode==="CUSTOM"&&s.productCardHeight)r.style.setProperty("--product-card-height",s.productCardHeight+"px");else r.style.setProperty("--product-card-height","400px");}}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className="font-sans antialiased text-[#F8FAFC] min-h-screen flex flex-col selection:bg-[#6366F1] selection:text-white bg-[#0B0F19]"
        style={{
          backgroundColor: "var(--site-bg, #0B0F19)",
          color: "var(--text-main, #F8FAFC)",
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
