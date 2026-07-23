import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { getPage, getTeamMembers } from "@/lib/sanity/data";
import { localize } from "@/lib/types";
import { pageHeroProps } from "@/lib/page-content";
const heroFallback = {
  eyebrow: { ar: "من نحن", en: "About us" },
  title: { ar: "شركةٌ بُنيت لتُنمّي علاماتٍ غذائية عظيمة، بمسؤولية.", en: "A company built to grow great food brands — responsibly." },
  description: { ar: "من فكرةٍ واحدة عام ٢٠١٤ إلى مجموعةٍ متكاملة تمتدّ عبر المطاعم وإنتاج الأغذية والتجارة — هذه قصّتنا.", en: "From a single idea in 2014 to an integrated group spanning restaurants, food production and trade — this is our story." },
  image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1900&q=75&auto=format&fit=crop",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPage("aboutPage");
  return pageMetadata(locale, "about", { ar: "من نحن", en: "About Us" }, { ar: "قصّة مجموعة سبيل الراشد ورؤيتها وفريقها.", en: "The story, vision and team behind Sabeel Al-Rashid." }, undefined, page?.seo);
}

export default async function About({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";
  const [team, page] = await Promise.all([getTeamMembers(), getPage("aboutPage")]);
  const hero = pageHeroProps(page, locale, heroFallback);
  const fallbackYears = [
    { year: "2014", title: { ar: "تأسيس الشركة", en: "The company is founded" }, description: { ar: "تأسّست سبيل الراشد للتجارة العامة وإدارة المطاعم.", en: "Sabeel Al-Rashid is established for general trade and restaurant management." } },
    { year: "2017", title: { ar: "إطلاق أول علامة مطاعم", en: "First restaurant brand launches" }, description: { ar: "افتتح سوبر تشيكن أولى فروعه ليبني قاعدةً من العملاء الأوفياء سريعاً.", en: "Super Chicken opens its first locations and quickly builds a loyal following." } },
    { year: "2019", title: { ar: "تشغيل المطبخ المركزي", en: "Central kitchen begins operations" }, description: { ar: "منشأة إنتاج مركزية توحّد الجودة وتفتح آفاق التوسّع.", en: "A central production facility standardises quality and unlocks scale." } },
    { year: "2021", title: { ar: "انضمام الركن الشرقي", en: "Alrukn Alsharqi joins the group" }, description: { ar: "علامةٌ للمطبخ الشرقي الأصيل تُوسّع المحفظة.", en: "An authentic Eastern-cuisine brand expands the portfolio." } },
    { year: "2024", title: { ar: "توسّع قطاع تعبئة الأغذية", en: "Food packaging division scales up" }, description: { ar: "استثمارٌ في طاقة التعبئة يدعم التجزئة والإمداد للأعمال.", en: "Investment in packaging capacity supports retail and B2B supply." } },
    { year: "2026", title: { ar: "نبني الفصل القادم", en: "Building the next chapter" }, description: { ar: "منصّةٌ جاهزة للامتياز تفتح أبوابها للمستثمرين والشركاء.", en: "A franchise-ready platform opens its doors to investors and partners." } },
  ];
  const years = (page?.timeline?.length ? page.timeline : fallbackYears).map((item) => ({ ...item, title: localize(item.title, locale), description: localize(item.description, locale) }));
  const fallbackStats = [{ value: "2014", label: { ar: "سنة التأسيس", en: "Founded" } }, { value: "45+", label: { ar: "فرعاً", en: "Branches" } }, { value: "1200+", label: { ar: "موظفاً", en: "Employees" } }, { value: "3", label: { ar: "قطاعات", en: "Divisions" } }];
  const companyStats = page?.statistics?.length ? page.statistics : fallbackStats;

  return (
    <>
      <PageHero locale={locale} {...hero} />
      <section className="section">
        <div className="container split split--media-start">
          <Reveal><div className="ph media-ph media-ph--tall"><img src={page?.introduction?.image?.src || "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=1100&q=75&auto=format&fit=crop"} alt={page?.introduction?.image?.alt ? localize(page.introduction.image.alt, locale) : ""} loading="lazy" /></div></Reveal>
          <Reveal delay={1}>
            <h2 className="h2">{page?.introduction?.heading ? localize(page.introduction.heading, locale) : ar ? "نُدير العلامات والمطابخ وسلاسل الإمداد كمنصّةٍ واحدة." : "We operate brands, kitchens and supply chains as one platform."}</h2>
            <p className="lead">{page?.introduction?.body ? localize(page.introduction.body, locale) : ar ? "سبيل الراشد شركةٌ للتجارة العامة وإدارة المطاعم، متخصّصة في إنتاج وتعبئة المواد الغذائية. نمنح العلامات قوّةً تشغيلية للنمو — حوكمةً منضبطة، وإمداداً موثوقاً، وجودةً متّسقة في كل فرع." : "Sabeel Al-Rashid is a general trading and restaurant-management company specialised in food production and packaging. We give hospitality brands the operating muscle to scale — disciplined governance, reliable supply, and consistent quality at every branch."}</p>
            <div className="statline about-statline">{companyStats.map(({value, label}) => <div key={label.en}><div className="stat__num">{value}</div><div className="stat__label">{localize(label, locale)}</div></div>)}</div>
          </Reveal>
        </div>
      </section>
      <section className="section section--panel">
        <div className="container">
          <Reveal className="section-head"><h2 className="h2">{page?.historyHeading ? localize(page.historyHeading, locale) : ar ? "قصّة الشركة" : "Company history"}</h2></Reveal>
          <div className="timeline">{years.map((item, index) => <Reveal className="tl-item" delay={index % 3} key={item.year}><span className="tl-year">{item.year}</span><h3>{item.title}</h3><p>{item.description}</p></Reveal>)}</div>
        </div>
      </section>
      <section className="section">
        <div className="container vm-grid">
          <Reveal className="vm-card"><span className="vm-ic vm-ic--vision" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12z" /><circle className="pupil" cx="12" cy="12" r="3" /></svg></span><h3>{page?.vision?.heading ? localize(page.vision.heading, locale) : ar ? "رؤيتنا" : "Our Vision"}</h3><p>{page?.vision?.body ? localize(page.vision.body, locale) : ar ? "أن نكون البيت الأكثر ثقةً للعلامات الغذائية في المنطقة — محلّ تقديرٍ للجودة والحوكمة وأسلوب النمو." : "To be the region's most trusted house of food brands — admired for quality, governance and the way we grow."}</p></Reveal>
          <Reveal className="vm-card" delay={1}><span className="vm-ic vm-ic--mission" aria-hidden="true"><svg viewBox="0 0 24 24"><circle className="ring" cx="12" cy="12" r="9" strokeDasharray="4 3" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /></svg></span><h3>{page?.mission?.heading ? localize(page.mission.heading, locale) : ar ? "رسالتنا" : "Our Mission"}</h3><p>{page?.mission?.body ? localize(page.mission.body, locale) : ar ? "أن نبني العلامات الغذائية ونُشغّلها ونوسّعها عبر إنتاجٍ متكامل وعملياتٍ منضبطة وشراكاتٍ باقية." : "To build, operate and scale food brands through integrated production, disciplined operations, and partnerships that last."}</p></Reveal>
        </div>
      </section>
      <section className="section section--panel">
        <div className="container">
          <Reveal className="section-head"><h2 className="h2">{page?.teamHeading ? localize(page.teamHeading, locale) : ar ? "الفريق خلف المجموعة" : "The team behind the group"}</h2></Reveal>
          <div className="team-grid">{team.map((member, index) => <Reveal className="team-card" delay={index} key={member.slug}><div className="ph"><img src={member.photo.src} alt={member.photo.alt ? localize(member.photo.alt, locale) : localize(member.name, locale)} loading="lazy" /></div><div className="team-card__body"><h3>{localize(member.name, locale)}</h3><div className="team-card__role">{localize(member.role, locale)}</div></div></Reveal>)}</div>
        </div>
      </section>
    </>
  );
}
