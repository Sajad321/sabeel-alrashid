import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata, siteUrl } from "@/lib/metadata";
import { getArticles } from "@/lib/sanity/data";
import { localize } from "@/lib/types";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/json-ld";
export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = (await getArticles()).find((a) => a.slug === slug);
  if (!article) return {};
  return {
    ...pageMetadata(
      locale,
      `news/${slug}`,
      article.title,
      article.excerpt,
      article.image,
    ),
    openGraph: {
      type: "article",
      title: localize(article.title, locale),
      description: localize(article.excerpt, locale),
      publishedTime: article.date,
      images: [article.image],
    },
  };
}
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = (await getArticles()).find((a) => a.slug === slug);
  if (!article) notFound();
  const ar = locale === "ar";
  return (
    <section className="section">
      <div className="container article">
        <nav className="breadcrumb">
          <Link href="/">{ar ? "الرئيسية" : "Home"}</Link>
          <span>/</span>
          <Link href="/news">{ar ? "الأخبار" : "News"}</Link>
          <span>/</span>
          <span>{localize(article.category, locale)}</span>
        </nav>
        <div className="article__meta">
          <time dateTime={article.date}>
            {new Intl.DateTimeFormat(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(article.date))}
          </time>
          <span>·</span>
          <span>{localize(article.category, locale)}</span>
        </div>
        <h1 className="h1">{localize(article.title, locale)}</h1>
        <div className="article__hero">
          <img src={article.image} alt="" />
        </div>
        <div className="article__body">
          {article.body.map((p, i) => (
            <p key={i}>{localize(p, locale)}</p>
          ))}
        </div>
        <div className="article__back">
          <Link className="btn btn--outline" href="/news">
            {ar ? "العودة إلى الأخبار" : "Back to news"} ←
          </Link>
        </div>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: localize(article.title, locale),
          description: localize(article.excerpt, locale),
          datePublished: article.date,
          image: [article.image],
          author: { "@type": "Organization", name: "Sabeel Al-Rashid" },
          publisher: {
            "@type": "Organization",
            name: "Sabeel Al-Rashid",
            logo: {
              "@type": "ImageObject",
              url: `${siteUrl}/assets/logos/sabeel-gold.png`,
            },
          },
          mainEntityOfPage: `${siteUrl}/${locale}/news/${article.slug}`,
        }}
      />
    </section>
  );
}
