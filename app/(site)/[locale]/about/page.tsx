import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { getTeamMembers } from "@/lib/sanity/data";
import { localize } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "about", { ar: "من نحن", en: "About Us" }, { ar: "قصّة مجموعة سبيل الراشد ورؤيتها وفريقها.", en: "The story, vision and team behind Sabeel Al-Rashid." });
}

export default async function About({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";
  const team = await getTeamMembers();
  const years = [
    { year: "2014", title: ar ? "تأسيس الشركة" : "The company is founded", description: ar ? "تأسّست سبيل الراشد للتجارة العامة وإدارة المطاعم." : "Sabeel Al-Rashid is established for general trade and restaurant management." },
    { year: "2017", title: ar ? "إطلاق أول علامة مطاعم" : "First restaurant brand launches", description: ar ? "افتتح سوبر تشيكن أولى فروعه ليبني قاعدةً من العملاء الأوفياء سريعاً." : "Super Chicken opens its first locations and quickly builds a loyal following." },
    { year: "2019", title: ar ? "تشغيل المطبخ المركزي" : "Central kitchen begins operations", description: ar ? "منشأة إنتاج مركزية توحّد الجودة وتفتح آفاق التوسّع." : "A central production facility standardises quality and unlocks scale." },
    { year: "2021", title: ar ? "انضمام الركن الشرقي" : "Alrukn Alsharqi joins the group", description: ar ? "علامةٌ للمطبخ الشرقي الأصيل تُوسّع المحفظة." : "An authentic Eastern-cuisine brand expands the portfolio." },
    { year: "2024", title: ar ? "توسّع قطاع تعبئة الأغذية" : "Food packaging division scales up", description: ar ? "استثمارٌ في طاقة التعبئة يدعم التجزئة والإمداد للأعمال." : "Investment in packaging capacity supports retail and B2B supply." },
    { year: "2026", title: ar ? "نبني الفصل القادم" : "Building the next chapter", description: ar ? "منصّةٌ جاهزة للامتياز تفتح أبوابها للمستثمرين والشركاء." : "A franchise-ready platform opens its doors to investors and partners." },
  ];
  const companyStats = [["2014", ar ? "سنة التأسيس" : "Founded"], ["45+", ar ? "فرعاً" : "Branches"], ["1200+", ar ? "موظفاً" : "Employees"], ["3", ar ? "قطاعات" : "Divisions"]];

  return (
    <>
      <PageHero locale={locale} eyebrow={ar ? "من نحن" : "About us"} title={ar ? "شركةٌ بُنيت لتُنمّي علاماتٍ غذائية عظيمة، بمسؤولية." : "A company built to grow great food brands — responsibly."} description={ar ? "من فكرةٍ واحدة عام ٢٠١٤ إلى مجموعةٍ متكاملة تمتدّ عبر المطاعم وإنتاج الأغذية والتجارة — هذه قصّتنا." : "From a single idea in 2014 to an integrated group spanning restaurants, food production and trade — this is our story."} image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1900&q=75&auto=format&fit=crop" />
      <section className="section">
        <div className="container split split--media-start">
          <Reveal><div className="ph media-ph media-ph--tall"><img src="https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=1100&q=75&auto=format&fit=crop" alt="" loading="lazy" /></div></Reveal>
          <Reveal delay={1}>
            <h2 className="h2">{ar ? "نُدير العلامات والمطابخ وسلاسل الإمداد كمنصّةٍ واحدة." : "We operate brands, kitchens and supply chains as one platform."}</h2>
            <p className="lead">{ar ? "سبيل الراشد شركةٌ للتجارة العامة وإدارة المطاعم، متخصّصة في إنتاج وتعبئة المواد الغذائية. نمنح العلامات قوّةً تشغيلية للنمو — حوكمةً منضبطة، وإمداداً موثوقاً، وجودةً متّسقة في كل فرع." : "Sabeel Al-Rashid is a general trading and restaurant-management company specialised in food production and packaging. We give hospitality brands the operating muscle to scale — disciplined governance, reliable supply, and consistent quality at every branch."}</p>
            <div className="statline about-statline">{companyStats.map(([value, label]) => <div key={label}><div className="stat__num">{value}</div><div className="stat__label">{label}</div></div>)}</div>
          </Reveal>
        </div>
      </section>
      <section className="section section--panel">
        <div className="container">
          <Reveal className="section-head"><h2 className="h2">{ar ? "قصّة الشركة" : "Company history"}</h2></Reveal>
          <div className="timeline">{years.map((item, index) => <Reveal className="tl-item" delay={index % 3} key={item.year}><span className="tl-year">{item.year}</span><h3>{item.title}</h3><p>{item.description}</p></Reveal>)}</div>
        </div>
      </section>
      <section className="section">
        <div className="container vm-grid">
          <Reveal className="vm-card"><span className="vm-ic vm-ic--vision" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12z" /><circle className="pupil" cx="12" cy="12" r="3" /></svg></span><h3>{ar ? "رؤيتنا" : "Our Vision"}</h3><p>{ar ? "أن نكون البيت الأكثر ثقةً للعلامات الغذائية في المنطقة — محلّ تقديرٍ للجودة والحوكمة وأسلوب النمو." : "To be the region's most trusted house of food brands — admired for quality, governance and the way we grow."}</p></Reveal>
          <Reveal className="vm-card" delay={1}><span className="vm-ic vm-ic--mission" aria-hidden="true"><svg viewBox="0 0 24 24"><circle className="ring" cx="12" cy="12" r="9" strokeDasharray="4 3" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /></svg></span><h3>{ar ? "رسالتنا" : "Our Mission"}</h3><p>{ar ? "أن نبني العلامات الغذائية ونُشغّلها ونوسّعها عبر إنتاجٍ متكامل وعملياتٍ منضبطة وشراكاتٍ باقية." : "To build, operate and scale food brands through integrated production, disciplined operations, and partnerships that last."}</p></Reveal>
        </div>
      </section>
      <section className="section section--panel">
        <div className="container">
          <Reveal className="section-head"><h2 className="h2">{ar ? "الفريق خلف المجموعة" : "The team behind the group"}</h2></Reveal>
          <div className="team-grid">{team.map((member, index) => <Reveal className="team-card" delay={index} key={member.slug}><div className="ph"><img src={member.photo} alt="" loading="lazy" /></div><div className="team-card__body"><h3>{localize(member.name, locale)}</h3><div className="team-card__role">{localize(member.role, locale)}</div></div></Reveal>)}</div>
        </div>
      </section>
    </>
  );
}
