import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/settings", "/signin", "/signup", "/forgot-password", "/api"],
    },
    sitemap: [
      `${SITE_URL}/sitemap/0.xml`,
      `${SITE_URL}/sitemap/1.xml`,
      `${SITE_URL}/sitemap/2.xml`,
    ],
    host: SITE_URL,
  };
}
