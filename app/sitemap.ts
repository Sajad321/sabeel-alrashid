import type { MetadataRoute } from "next";
import { articles } from "@/lib/content";
import { siteUrl } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "about",
    "brands",
    "franchise",
    "careers",
    "careers/apply",
    "news",
    "contact",
    ...articles.map((article) => `news/${article.slug}`),
  ];
  return pages.flatMap((path) =>
    ["ar", "en"].map((locale) => {
      const suffix = path ? `/${path}` : "";
      return {
        url: `${siteUrl}/${locale}${suffix}`,
        lastModified: new Date(),
        changeFrequency: path.startsWith("news")
          ? ("weekly" as const)
          : ("monthly" as const),
        priority: path === "" ? 1 : 0.7,
        alternates: {
          languages: {
            ar: `${siteUrl}/ar${suffix}`,
            en: `${siteUrl}/en${suffix}`,
          },
        },
      };
    }),
  );
}
