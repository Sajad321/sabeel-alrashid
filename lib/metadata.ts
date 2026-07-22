import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export function pageMetadata(
  locale: Locale,
  path: string,
  title: { ar: string; en: string },
  description: { ar: string; en: string },
  image = "/assets/logos/sabeel-gold.png",
): Metadata {
  const pathname = path ? `/${path}` : "";
  const url = `${siteUrl}/${locale}${pathname}`;
  return {
    title: title[locale],
    description: description[locale],
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
      title: title[locale],
      description: description[locale],
      url,
      siteName: "Sabeel Al-Rashid",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: title[locale],
      description: description[locale],
    },
  };
}
export { siteUrl };
