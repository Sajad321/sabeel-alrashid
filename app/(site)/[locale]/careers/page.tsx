import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/page-hero";
import { JobsAccordion } from "@/components/jobs-accordion";
import { getJobs, getPage, getSiteSettings } from "@/lib/sanity/data";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { siteUrl } from "@/lib/metadata";
import { localize } from "@/lib/types";
import { pageHeroProps } from "@/lib/page-content";
const heroFallback = {
  eyebrow: { ar: "انضم إلى فريقنا", en: "Join our team" },
  title: { ar: "طوّر مسيرتك حيث تُبنى العلامات العظيمة.", en: "Grow your career where great brands are built." },
  description: { ar: "من المطبخ إلى المكتب الرئيسي، فريقنا هو سبب عودة الضيوف. اعثر على مكانك في سبيل الراشد.", en: "From the kitchen to the head office, our people are the reason guests come back. Find your place at Sabeel Al-Rashid." },
  image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1800&q=80&auto=format&fit=crop",
};

type BenefitIcon = "pay" | "health" | "learning" | "meals" | "growth" | "clock";

function AnimatedBenefitIcon({ type }: { type: BenefitIcon }) {
  const className = `feature__ic feature__ic--lg fi-${
    type === "learning" ? "quality" : type
  }`;

  return (
    <span className={className} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        {type === "pay" && (
          <>
            <ellipse className="coin" cx="12" cy="6" rx="7" ry="2.6" />
            <path d="M5 6v12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6" />
            <path d="M5 12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6" />
          </>
        )}
        {type === "health" && (
          <>
            <path d="M12 20s-7-4.3-7-10a4.2 4.2 0 0 1 7-3.1A4.2 4.2 0 0 1 19 10c0 5.7-7 10-7 10z" />
            <path className="cross" d="M12 8.4v4M10 10.4h4" />
          </>
        )}
        {type === "learning" && (
          <path
            className="star"
            d="M12 3l2.3 4.6 5.1.7-3.7 3.6.9 5.1L12 14.8 7.4 17l.9-5.1L4.6 8.3l5.1-.7z"
          />
        )}
        {type === "meals" && (
          <>
            <path
              className="steam"
              d="M9 3c-.6 1 .6 1.8 0 2.8M12 3c-.6 1 .6 1.8 0 2.8M15 3c-.6 1 .6 1.8 0 2.8"
            />
            <path d="M4 10h16M5 10a7 7 0 0 0 14 0M3 20h18" />
          </>
        )}
        {type === "growth" && (
          <>
            <path className="arr" d="M4 15l5-5 4 4 7-7" />
            <path className="arr" d="M16 7h4v4" />
          </>
        )}
        {type === "clock" && (
          <>
            <circle cx="12" cy="12" r="9" />
            <path className="hand" d="M12 12V7M12 12l3.5 2" />
          </>
        )}
      </svg>
    </span>
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPage("careersPage");
  return pageMetadata(
    locale,
    "careers",
    { ar: "الوظائف", en: "Careers" },
    {
      ar: "انضم إلى الفريق الذي يبني علامات الضيافة العظيمة.",
      en: "Join the team building great hospitality brands.",
    }, undefined, page?.seo,
  );
}
export default async function Careers({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";
  const [jobs, page, settings] = await Promise.all([
    getJobs(),
    getPage("careersPage"),
    getSiteSettings(),
  ]);
  const hero = pageHeroProps(page, locale, heroFallback);
  const benefits: Array<{
    icon: BenefitIcon;
    title: string;
    description: string;
  }> = ar
    ? [
        { icon: "pay", title: "رواتب تنافسية", description: "تعويضٌ عادل وشفّاف مع مكافآت الأداء." },
        { icon: "health", title: "تأمين صحي", description: "تأمينٌ طبي لك ولأفراد عائلتك المؤهّلين." },
        { icon: "learning", title: "تعلّم ونمو", description: "تدريبٌ منظّم ومساراتٌ واضحة للترقية." },
        { icon: "meals", title: "وجبات وخصومات", description: "وجبات الفريق وخصومات على علاماتنا." },
        { icon: "growth", title: "الترقية من الداخل", description: "معظم مدرائنا بدؤوا من الخطوط الأمامية." },
        { icon: "clock", title: "استقرار", description: "مجموعةٌ نامية ومحوكمة جيداً تبني معها مستقبلك." },
      ]
    : [
        { icon: "pay", title: "Competitive pay", description: "Fair, transparent compensation with performance rewards." },
        { icon: "health", title: "Health coverage", description: "Medical insurance for you and eligible family members." },
        { icon: "learning", title: "Learning & growth", description: "Structured training and clear promotion pathways." },
        { icon: "meals", title: "Meals & discounts", description: "Staff meals and discounts across our brands." },
        { icon: "growth", title: "Promote from within", description: "Most of our managers started on the front line." },
        { icon: "clock", title: "Stability", description: "A growing, well-governed group you can build a future with." },
      ];
  const resolvedBenefits = page?.benefits?.length
    ? page.benefits.map((benefit, index) => ({
        icon: (["pay", "health", "learning", "meals", "growth", "clock"].includes(benefit.icon || "")
          ? benefit.icon
          : benefits[index % benefits.length].icon) as BenefitIcon,
        title: localize(benefit.title, locale),
        description: localize(benefit.description, locale),
      }))
    : benefits;
  return (
    <>
      <PageHero
        locale={locale}
        {...hero}
      />
      <section className="section">
        <div className="container split split--media-start">
          <Reveal>
            <div className="ph media-ph media-ph--tall">
              <img src={page?.culture?.image?.src || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1100&q=75&auto=format&fit=crop"} alt={page?.culture?.image?.alt ? localize(page.culture.image.alt, locale) : ""} loading="lazy" />
            </div>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="h2">
              {page?.culture?.heading
                ? localize(page.culture.heading, locale)
                : ar
                ? "جادّون في الطعام. جادّون في الناس."
                : "Serious about food. Serious about people."}
            </h2>
            <p className="lead">
              {page?.culture?.body
                ? localize(page.culture.body, locale)
                : ar
                ? "نتحرّك بسرعة، ونلتزم بمعايير عالية، ونمنح فريقنا مسؤوليةً حقيقية مبكراً. نستثمر في التدريب، ونرقّي من الداخل، ونحتفي بحرفة الضيافة."
                : "We move fast, hold ourselves to high standards, and give people real ownership early. We invest in training, promote from within, and celebrate the craft of hospitality."}
            </p>
            <ul className="who__list careers-values">
              {(page?.cultureValues?.length
                ? page.cultureValues.map((value) => localize(value, locale))
                : [ar ? "مساراتٌ واضحة للنمو والقيادة" : "Clear paths to grow and lead", ar ? "أكاديمية تدريب لكل دور" : "Training academy for every role", ar ? "ثقافة احترامٍ وجودة" : "A culture of respect and quality"]
              ).map((value) => <li key={value}>{value}</li>)}
            </ul>
          </Reveal>
        </div>
      </section>
      <section className="section section--panel">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="h2">{page?.benefitsHeading ? localize(page.benefitsHeading, locale) : ar ? "المزايا والامتيازات" : "Benefits & perks"}</h2>
          </Reveal>
          <div className="feature-grid">
            {resolvedBenefits.map((benefit, index) => (
              <Reveal
                className="feature"
                delay={index % 3}
                key={benefit.title}
              >
                <AnimatedBenefitIcon type={benefit.icon} />
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--soft section-anchor" id="positions">
        <div className="container">
          <div className="sec-head">
            <h2 className="h2">{page?.positionsHeading ? localize(page.positionsHeading, locale) : ar ? "الوظائف الشاغرة" : "Open positions"}</h2>
          </div>
          <JobsAccordion jobs={jobs} locale={locale} />
        </div>
      </section>
      <section className="section section--panel" id="apply">
        <div className="container careers-cta">
          <Reveal>
            <h2 className="h2">
              {page?.callToAction?.heading ? localize(page.callToAction.heading, locale) : ar ? "جاهزٌ للانضمام إلينا؟" : "Ready to join us?"}
            </h2>
            <p className="lead">{page?.callToAction?.body ? localize(page.callToAction.body, locale) : ar ? "التقديم يستغرق دقائق قليلة — حدّثنا عن نفسك وأرفق سيرتك الذاتية. نراجع كل طلب." : "The application takes a few minutes — tell us about yourself and attach your CV. We review every application."}</p>
            <Link className="btn btn--gold" href="/careers/apply">{page?.callToActionLabel ? localize(page.callToActionLabel, locale) : ar ? "قدّم الآن" : "Apply now"} ←</Link>
          </Reveal>
        </div>
      </section>
      {jobs.map((job) => (
        <JsonLd
          key={job.slug}
          data={{
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: localize(job.title, locale),
            description: localize(job.description, locale),
            datePosted: job.publishedAt,
            validThrough: job.expiresAt,
            employmentType: localize(job.type, "en"),
            hiringOrganization: {
              "@type": "Organization",
              name: localize(settings.companyName, locale),
              sameAs: siteUrl,
            },
            jobLocation: {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Baghdad",
                streetAddress: localize(settings.address, locale),
                addressCountry: "IQ",
              },
            },
            url: `${siteUrl}/${locale}/careers/apply?job=${job.slug}`,
          }}
        />
      ))}
    </>
  );
}
