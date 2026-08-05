import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { HeroCarousel } from "@/components/hero-carousel";
import { Reveal } from "@/components/reveal";
import { Counter } from "@/components/counter";
import { BranchMap } from "@/components/branch-map";
import { Link } from "@/i18n/navigation";
import {
  getArticles,
  getBranches,
  getBrands,
  getDivisions,
  getHomePage,
} from "@/lib/sanity/data";
import { localize } from "@/lib/types";
import { pageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1900&q=80&auto=format&fit=crop",
    eyebrow: { ar: "مجموعة سبيل الراشد", en: "Sabeel Al-Rashid Group" },
    title: {
      ar: "البيتُ خلف العلامات التي تُحبّها.",
      en: "The house behind the brands you love.",
    },
  },
  {
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1900&q=80&auto=format&fit=crop",
    eyebrow: { ar: "منصّة استثمار", en: "An investment platform" },
    title: {
      ar: "نَبني روّاد الضيافة في العراق.",
      en: "Building Iraq's hospitality leaders.",
    },
  },
  {
    image:
      "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=1900&q=80&auto=format&fit=crop",
    eyebrow: { ar: "المقر · بغداد", en: "Headquarters · Baghdad" },
    title: { ar: "حضورٌ مؤسسيّ متنامٍ.", en: "A growing corporate footprint." },
  },
  {
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1900&q=80&auto=format&fit=crop",
    eyebrow: { ar: "العمليات والكوادر", en: "Operations & people" },
    title: {
      ar: "عملياتٌ منضبطة وقابلة للتوسّع.",
      en: "Disciplined, scalable operations.",
    },
  },
  {
    image:
      "https://images.unsplash.com/photo-1577412647305-991150c7d163?w=1900&q=80&auto=format&fit=crop",
    eyebrow: { ar: "توسّع", en: "Expansion" },
    title: {
      ar: "مواقعُ جديدة في عموم البلاد.",
      en: "New locations across the country.",
    },
  },
];

function StatIcon({ type }: { type: "brands" | "branches" | "divisions" | "team" }) {
  return (
    <div className={`stat__ic st-${type === "divisions" ? "div" : type}`} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        {type === "brands" && <><path className="roof" d="M4 9l1.6-4h12.8L20 9z" /><path d="M5 9v11h14V9M10 20v-6h4v6" /></>}
        {type === "branches" && <><path className="pin" d="M12 21s6.5-5.8 6.5-10.5A6.5 6.5 0 0 0 5.5 10.5C5.5 15.2 12 21 12 21z" /><circle className="pin" cx="12" cy="10.3" r="2.4" /></>}
        {type === "divisions" && <><path className="layer" d="M12 3l8 4-8 4-8-4z" /><path className="layer" d="M4 12l8 4 8-4" /><path className="layer" d="M4 16.5l8 4 8-4" /></>}
        {type === "team" && <><circle className="head" cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" /><circle className="head" cx="16.5" cy="9" r="2.4" /><path d="M15.5 20a5.5 5.5 0 0 1 5-6" /></>}
      </svg>
    </div>
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const home = await getHomePage();
  return pageMetadata(
    locale,
    "",
    { ar: "سبيل الراشد", en: "Sabeel Al-Rashid" },
    {
      ar: "مجموعة عراقية متكاملة لإدارة المطاعم وإنتاج الأغذية والتجارة العامة.",
      en: "An integrated Iraqi group spanning restaurant management, food production and general trade.",
    }, undefined, home?.seo,
  );
}
export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";
  const [articles, branches, brands, divisions, home] = await Promise.all([
    getArticles(),
    getBranches(),
    getBrands(),
    getDivisions(),
    getHomePage(),
  ]);
  const heroSlides = home?.heroSlides?.length ? home.heroSlides : slides;
  return (
    <>
      <HeroCarousel slides={heroSlides} locale={locale} />
      <section className="section">
        <div className="container">
          <Reveal className="introlede">
            <div className="introlede__head">
              <h2 className="introlede__title">
                {home?.introduction?.heading
                  ? localize(home.introduction.heading, locale)
                  : ar
                  ? "نمنح علامات الضيافة قوّةً للنمو."
                  : "We give hospitality brands the muscle to grow."}
              </h2>
              <p className="introlede__lead">
                {home?.introduction?.body
                  ? localize(home.introduction.body, locale)
                  : ar
                  ? "تأسّست سبيل الراشد عام ٢٠١٤، ونمت من مشروعٍ واحد إلى مجموعةٍ متكاملة تمتدّ عبر المطاعم وإنتاج الأغذية والتجارة العامة في عموم العراق."
                  : "Founded in 2014, Sabeel Al-Rashid has grown from a single venture into an integrated group spanning restaurants, food production and general trade across Iraq."}
              </p>
            </div>
            <div className="introlede__media">
              <img
                src={home?.introduction?.image?.src || "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=1600&q=80&auto=format&fit=crop"}
                alt={home?.introduction?.image?.alt ? localize(home.introduction.image.alt, locale) : ""}
              />
            </div>
            <div className="introlede__bar">
              <ul className="introlede__facts">
                {(home?.introductionFacts?.length ? home.introductionFacts : [
                  { value: "2014", label: { ar: "سنة التأسيس", en: "Established" } },
                  { value: "3", label: { ar: "قطاعات", en: "Divisions" } },
                  { value: ar ? "بغداد" : "Baghdad", label: { ar: "المقر", en: "Headquarters" } },
                ]).map((fact) => <li key={fact.label.en}><b>{fact.value}</b><span>{localize(fact.label, locale)}</span></li>)}
              </ul>
              <Link className="btn btn--ink" href="/about">
                {ar ? "المزيد عنّا" : "More about us"} ←
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section--tight statband">
        <div className="container grid cols-4">
          {(home?.statistics?.length
            ? home.statistics.map((stat, index) => [Number.parseInt(stat.value, 10) || 0, localize(stat.label, locale), (["brands", "branches", "divisions", "team"] as const)[index % 4]] as const)
            : [
            [2, ar ? "علامات مطاعم" : "Restaurant brands", "brands"],
            [45, ar ? "فرعاً في العراق" : "Branches across Iraq", "branches"],
            [3, ar ? "قطاعات أعمال" : "Business divisions", "divisions"],
            [1200, ar ? "من أفراد الفريق" : "Team members", "team"],
          ] as const).map(([number, label, icon], index) => (
            <Reveal className="stat" delay={index} key={label}>
              <StatIcon type={icon} />
              <div className="stat__num">
                <Counter value={number} />
                <span className="u">{number > 3 ? "+" : ""}</span>
              </div>
              <div className="stat__label">{label}</div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <div className="sec-head">
            <h2 className="h2">
              {home?.divisionsHeading
                ? localize(home.divisionsHeading, locale)
                : ar
                ? "ثلاثة قطاعات، منصّةٌ واحدة."
                : "Three divisions, one platform."}
            </h2>
          </div>
          <div className="divgrid">
            {divisions.map((d) => (
              <Link className="divcard" href="/about" key={d.title.en}>
                <div className="divcard__media">
                  <img
                    src={d.image.src}
                    alt={d.image.alt ? localize(d.image.alt, locale) : localize(d.title, locale)}
                  />
                </div>
                <div className="divcard__bar">
                  <span>{localize(d.title, locale)}</span>
                  <span>←</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="brandstrip">
        <div className="container">
          <div className="sec-head">
            <h2 className="h2">
              {home?.brandsHeading
                ? localize(home.brandsHeading, locale)
                : ar
                ? "علاماتٌ يعود إليها الناس."
                : "Brands people come back for."}
            </h2>
            <Link className="btn btn--outline" href="/brands">
              {ar ? "عرض كل العلامات" : "View all brands"} ←
            </Link>
          </div>
          <div className="brandgrid2">
            {brands.map((brand) => (
              <Link
                href="/brands"
                className={`bcardx bcardx--${brand.slug === "super-chicken" ? "sc" : "ar"}`}
                key={brand.slug}
              >
                <div className="bcardx__top">
                  <img
                    className="bcardx__logo"
                    src={brand.logo}
                    alt={localize(brand.name, locale)}
                  />
                </div>
                <div className="bcardx__body">
                  <span className="bcardx__cat">
                    {localize(brand.category, locale)}
                  </span>
                  <h3 className="bcardx__nm">{brand.slug === "super-chicken" ? brand.name.en : localize(brand.name, locale)}</h3>
                  <p className="bcardx__desc">
                    {localize(brand.description, locale)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--branches">
        <div className="container">
          <div className="branches-head">
            <div>
            <h2 className="h2">
              {home?.branchesHeading ? localize(home.branchesHeading, locale) : ar ? "اعثر على فرعٍ في بغداد" : "Find a branch in Baghdad"}
            </h2>
            </div>
            <p className="lead">
              {home?.branchesDescription
                ? localize(home.branchesDescription, locale)
                : ar
                ? "اضغط على أي علامة لعرض الفرع مع إحداثياته والاتجاهات إليه. محافظاتٌ أخرى قريباً."
                : "Tap any pin to see the branch with its coordinates and directions. More governorates coming soon."}
            </p>
          </div>
          <BranchMap branches={branches} brands={brands} locale={locale} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <h2 className="h2">{home?.newsHeading ? localize(home.newsHeading, locale) : ar ? "أحدث الأخبار" : "Latest news"}</h2>
            <Link className="btn btn--outline" href="/news">
              {ar ? "كل الأخبار" : "All news"} ←
            </Link>
          </div>
          <div className="newsgrid">
            {articles.slice(0, 4).map((a) => (
              <Link className="ncard" href={`/news/${a.slug}`} key={a.slug}>
                <div className="ncard__media">
                  <img
                    src={a.image.src}
                    alt={a.image.alt ? localize(a.image.alt, locale) : localize(a.title, locale)}
                  />
                </div>
                <div className="ncard__body">
                  <h3 className="ncard__title">{localize(a.title, locale)}</h3>
                  <span className="ncard__date">{a.date.slice(0, 7)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Reveal className="sec-head">
            <h2 className="h2">
              {home?.brandFocusHeading ? localize(home.brandFocusHeading, locale) : ar ? "نظرةٌ أقرب على علاماتنا." : "A closer look at our brands."}
            </h2>
          </Reveal>
          {brands.map((brand, index) => (
            <Reveal
              className={`infocard infocard--brand${index % 2 ? " infocard--rev" : ""}`}
              delay={1}
              key={brand.slug}
            >
              <div className="infocard__media">
                <img
                  src={brand.image.src}
                  alt={brand.image.alt ? localize(brand.image.alt, locale) : localize(brand.name, locale)}
                />
              </div>
              <div className="infocard__body">
                <img
                  className="infocard__logo"
                  src={brand.logo}
                  alt={localize(brand.name, locale)}
                />
                <h3>{brand.slug === "super-chicken" ? brand.name.en : localize(brand.name, locale)}</h3>
                <p>{localize(brand.description, locale)}</p>
                <div className="infocard__kpis">
                  {brand.stats.slice(0, 3).map((stat) => (
                    <div key={stat.label.en}>
                      <b>{stat.value}</b>
                      <span>{localize(stat.label, locale)}</span>
                    </div>
                  ))}
                </div>
                <Link className="btn btn--ghost" href="/brands">
                  {ar ? "استكشف العلامة" : "Explore brand"} ←
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <Reveal className="infocard infocard--rev">
            <div className="infocard__media">
              <img
                src={home?.sustainability?.image?.src || "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1100&q=80&auto=format&fit=crop"}
                alt={home?.sustainability?.image?.alt ? localize(home.sustainability.image.alt, locale) : ""}
              />
            </div>
            <div className="infocard__body">
              <h2 className="h2">
                {home?.sustainability?.heading
                  ? localize(home.sustainability.heading, locale)
                  : ar
                  ? "مسؤوليةٌ من المزرعة إلى المائدة."
                  : "Responsible from farm to table."}
              </h2>
              <p className="lead">
                {home?.sustainability?.body
                  ? localize(home.sustainability.body, locale)
                  : ar
                  ? "مطابخ عالية الكفاءة وتوريدٌ مسؤول وتقليل الهدر — العلامات الباقية تُبنى على ممارساتٍ باقية."
                  : "Efficient kitchens, responsible sourcing and reduced waste — lasting brands are built on lasting practices."}
              </p>
              <ul className="infocard__facts">
                {(home?.sustainabilityFacts?.length ? home.sustainabilityFacts : [
                  { value: "30%", label: { ar: "هدر أقل", en: "Less waste" } },
                  { value: "100%", label: { ar: "حلال معتمد", en: "Halal certified" } },
                  { value: "12", label: { ar: "مورّداً محلياً", en: "Local suppliers" } },
                ]).map((fact) => <li key={fact.label.en}><b>{fact.value}</b><span>{localize(fact.label, locale)}</span></li>)}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
