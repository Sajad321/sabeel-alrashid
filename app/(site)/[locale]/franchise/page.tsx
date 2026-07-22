import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/page-hero";
import { SubmissionForm } from "@/components/submission-form";
import { Reveal } from "@/components/reveal";
import { FranchiseFeatureIcon, type FranchiseFeatureIconType } from "@/components/franchise-feature-icon";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    locale,
    "franchise",
    { ar: "الامتياز", en: "Franchise" },
    {
      ar: "امتلك علامة مثبتة ومدعومة من مشغّل حقيقي.",
      en: "Own a proven brand backed by a real operator.",
    },
  );
}
export default async function Franchise({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";
  const titles = ar
    ? [
        "علامات مُثبتة",
        "إمداد متكامل",
        "دعم تشغيلي كامل",
        "اقتصاديات منضبطة",
        "أنظمة جودة",
        "خارطة نمو",
      ]
    : [
        "Proven brands",
        "Integrated supply",
        "Full operational support",
        "Disciplined economics",
        "Quality systems",
        "Growth roadmap",
      ];
  const descriptions = ar
    ? ["ادخل إلى علاماتٍ ذات طلبٍ حقيقي وعملاء أوفياء وأسماء معروفة.", "مطابخنا المركزية وقطاع التجارة يُبقيان فرعك مزوّداً باستمرار.", "تدريبٌ وإرشاد التجهيز والتسويق ودعمٌ تشغيلي مستمر.", "اقتصادياتٌ شفّافة للوحدة وتقاريرٌ بمعايير المستثمرين من اليوم الأول.", "وصفاتٌ موحّدة وأنظمة سلامةٍ غذائية تحمي العلامة في كل مكان.", "فرصٌ لوحداتٍ متعدّدة ومناطق حصرية للشركاء الملتزمين."]
    : ["Step into brands with real demand, loyal customers and recognised names.", "Our central kitchens and trade division keep your branch reliably stocked.", "Training, fit-out guidance, marketing and ongoing operational support.", "Transparent unit economics and investor-grade reporting from day one.", "Standardised recipes and food-safety systems protect the brand everywhere.", "Multi-unit and territory opportunities for committed partners."];
  const icons: FranchiseFeatureIconType[] = ["badge", "supply", "support", "economics", "quality", "growth"];
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={ar ? "فرص الامتياز" : "Franchise opportunities"}
        title={
          ar
            ? "امتلك علامةً مُثبتة. مدعومةً بمُشغّلٍ حقيقي."
            : "Own a proven brand. Backed by a real operator."
        }
        description={
          ar
            ? "اشترك مع سبيل الراشد لتأخذ علاماتنا إلى أسواقٍ جديدة — بنموذجٍ تشغيلي مُختبر وسلسلة إمدادٍ ودعمٍ كاملٍ خلفك."
            : "Partner with Sabeel Al-Rashid to bring our brands to new markets — with a tested operating model, supply chain and support behind you."
        }
        image="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1900&q=75&auto=format&fit=crop"
      />
      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="h2">
              {ar
                ? "شراكةٌ مُصمّمة للنجاح."
                : "A partnership designed for success."}
            </h2>
          </Reveal>
          <div className="feature-grid">
            {titles.map((title, i) => (
              <Reveal className="feature" delay={i % 3} key={title}>
                <FranchiseFeatureIcon type={icons[i]} />
                <h3>{title}</h3>
                <p>{descriptions[i]}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--soft" id="apply">
        <div className="container form-container">
          <Reveal className="section-head section-head--center">
            <h2 className="h2">{ar ? "طلب امتياز" : "Franchise application"}</h2>
            <p className="lead">
              {ar
                ? "حدّثنا عن نفسك وسنتواصل معك خلال خمسة أيام عمل."
                : "Tell us about yourself and we'll be in touch within five business days."}
            </p>
          </Reveal>
          <SubmissionForm kind="franchise" locale={locale} />
        </div>
      </section>
    </>
  );
}
