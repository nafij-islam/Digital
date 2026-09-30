import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shop.nafij.com";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/products", "/categories", "/support"],
      disallow: [
        "/admin",
        "/admin/*",
        "/account",
        "/account/*",
        "/checkout",
        "/checkout/*",
        "/order-success",
        "/order-success/*",
        "/api/*",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
