"use client";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { CmsArticle } from "@/lib/types";
import { localize } from "@/lib/types";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

export function NewsBrowser({
  articles,
  locale,
}: {
  articles: CmsArticle[];
  locale: "ar" | "en";
}) {
  const params = useSearchParams(),
    router = useRouter(),
    path = usePathname();
  const category = params.get("category") || "all",
    year = params.get("year") || "all",
    sort = params.get("sort") || "desc";
  const categories = Array.from(
    new Map(
      articles.map((a) => [a.categoryKey, localize(a.category, locale)]),
    ).entries(),
  );
  const years = Array.from(
    new Set(articles.map((article) => article.date.slice(0, 4))),
  ).sort((a, b) => b.localeCompare(a));
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value === "all") next.delete(key);
    else next.set(key, value);
    router.replace(`${path}${next.size ? `?${next}` : ""}`);
  };
  const shown = useMemo(
    () =>
      articles
        .filter(
          (a) =>
            (category === "all" || a.categoryKey === category) &&
            (year === "all" || a.date.startsWith(year)),
        )
        .sort(
          (a, b) => (sort === "desc" ? -1 : 1) * a.date.localeCompare(b.date),
        ),
    [articles, category, year, sort],
  );
  return (
    <>
      <div className="news-controls">
        <div className="filter-row">
          <button
            className={`filter ${category === "all" ? "is-active" : ""}`}
            onClick={() => update("category", "all")}
          >
            {locale === "ar" ? "الكل" : "All"}
          </button>
          {categories.map(([key, label]) => (
            <button
              key={key}
              className={`filter ${category === key ? "is-active" : ""}`}
              onClick={() => update("category", key)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="newsbar">
          <select
            aria-label={locale === "ar" ? "السنة" : "Year"}
            value={year}
            onChange={(e) => update("year", e.target.value)}
          >
            <option value="all">
              {locale === "ar" ? "كل السنوات" : "All years"}
            </option>
            {years.map((availableYear) => (
              <option key={availableYear} value={availableYear}>
                {availableYear}
              </option>
            ))}
          </select>
          <select
            aria-label={locale === "ar" ? "الترتيب" : "Sort"}
            value={sort}
            onChange={(e) => update("sort", e.target.value)}
          >
            <option value="desc">
              {locale === "ar" ? "الأحدث أولاً" : "Newest first"}
            </option>
            <option value="asc">
              {locale === "ar" ? "الأقدم أولاً" : "Oldest first"}
            </option>
          </select>
        </div>
      </div>
      <div className="newsgrid">
        {shown.map((article) => (
          <Link
            className="ncard"
            href={`/news/${article.slug}`}
            key={article.slug}
          >
            <div className="ncard__media">
              <img
                src={article.image.src}
                alt={
                  article.image.alt
                    ? localize(article.image.alt, locale)
                    : localize(article.title, locale)
                }
              />
            </div>
            <div className="ncard__body">
              <h3>{localize(article.title, locale)}</h3>
              <time className="ncard__date" dateTime={article.date}>
                {new Intl.DateTimeFormat(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(article.date))}
              </time>
            </div>
          </Link>
        ))}
        {!shown.length && (
          <p className="empty-state">
            {locale === "ar" ? "لا توجد أخبار مطابقة." : "No matching news."}
          </p>
        )}
      </div>
    </>
  );
}
