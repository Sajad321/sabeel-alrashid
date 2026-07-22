import { Suspense } from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/page-hero";
import { NewsBrowser } from "@/components/news-browser";
import { getArticles } from "@/lib/sanity/data";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    locale,
    "news",
    { ar: "الأخبار والإعلام", en: "News & Media" },
    {
      ar: "آخر أخبار مجموعة سبيل الراشد وعلاماتها.",
      en: "Latest news from Sabeel Al-Rashid and its brands.",
    },
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
  const articles = await getArticles();
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={ar ? "غرفة الأخبار" : "Newsroom"}
        title={ar ? "الأخبار والإعلام" : "News & Media"}
        description={
          ar
            ? "آخر ما لدى مجموعة سبيل الراشد."
            : "The latest from across the Sabeel Al-Rashid group."
        }
        image="https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1900&q=75&auto=format&fit=crop"
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
