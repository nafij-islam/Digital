import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shop.nafij.com";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://digital-backend-vert.vercel.app/api/v1";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const res = await fetch(`${apiUrl}/products?limit=100`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json = await res.json();
      const products = json.data?.products || json.products || [];
      const productRoutes: MetadataRoute.Sitemap = products.map((prod: any) => ({
        url: `${baseUrl}/products/${prod.slug}`,
        lastModified: prod.updatedAt ? new Date(prod.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
      return [...staticRoutes, ...productRoutes];
    }
  } catch {
    // If backend is offline at build time, gracefully return static sitemap
  }

  return staticRoutes;
}
