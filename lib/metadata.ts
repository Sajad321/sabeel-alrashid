import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import type { SeoFields } from "@/lib/types";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export function pageMetadata(
  locale: Locale,
  path: string,
  title: { ar: string; en: string },
  description: { ar: string; en: string },
  image = "/assets/logos/sabeel-gold.png",
  seo?: SeoFields,
  siteName = "Sabeel Al-Rashid",
): Metadata {
  const pathname = path ? `/${path}` : "";
  const url = `${siteUrl}/${locale}${pathname}`;
  const resolvedTitle = seo?.title?.[locale] || title[locale];
  const resolvedDescription =
    seo?.description?.[locale] || description[locale];
  const resolvedImage = seo?.image || image;
  return {
    title: resolvedTitle,
    description: resolvedDescription,
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: url,
      languages: {
        ar: `${siteUrl}/ar${pathname}`,
        en: `${siteUrl}/en${pathname}`,
        "x-default": `${siteUrl}/ar${pathname}`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_IQ" : "en_US",
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      siteName,
      images: [resolvedImage],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
    },
  };
}
export { siteUrl };
