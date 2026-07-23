import { Suspense } from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/page-hero";
import { NewsBrowser } from "@/components/news-browser";
import { getArticles, getPage } from "@/lib/sanity/data";
import { pageHeroProps } from "@/lib/page-content";
const heroFallback = {
  eyebrow: { ar: "غرفة الأخبار", en: "Newsroom" },
  title: { ar: "الأخبار والإعلام", en: "News & Media" },
  description: { ar: "آخر ما لدى مجموعة سبيل الراشد.", en: "The latest from across the Sabeel Al-Rashid group." },
  image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1900&q=75&auto=format&fit=crop",
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPage("newsPage");
  return pageMetadata(
    locale,
    "news",
    { ar: "الأخبار والإعلام", en: "News & Media" },
    {
      ar: "آخر أخبار مجموعة سبيل الراشد وعلاماتها.",
      en: "Latest news from Sabeel Al-Rashid and its brands.",
    }, undefined, page?.seo,
  );
}
export default async function News({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";
  const [articles, page] = await Promise.all([getArticles(), getPage("newsPage")]);
  const hero = pageHeroProps(page, locale, heroFallback);
  return (
    <>
      <PageHero
        locale={locale}
        {...hero}
      />
      <section className="section">
        <div className="container">
          <Suspense fallback={<p>{ar ? "جارٍ التحميل…" : "Loading…"}</p>}>
            <NewsBrowser articles={articles} locale={locale} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
