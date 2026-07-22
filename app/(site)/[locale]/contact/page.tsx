import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/page-hero";
import { SubmissionForm } from "@/components/submission-form";
import { Reveal } from "@/components/reveal";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    locale,
    "contact",
    { ar: "تواصل معنا", en: "Contact" },
    {
      ar: "تواصل مع مجموعة سبيل الراشد في بغداد.",
      en: "Contact Sabeel Al-Rashid in Baghdad.",
    },
  );
}
export default async function Contact({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={ar ? "تواصل" : "Contact"}
        title={ar ? "لنتحدّث." : "Let's talk."}
        description={
          ar
            ? "سواءٌ كنت مستثمراً أو مورّداً أو إعلامياً أو ضيفاً لديه ملاحظة — يسعدنا أن نسمع منك."
            : "Whether you're an investor, a supplier, media or a guest with feedback — we'd love to hear from you."
        }
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1900&q=75&auto=format&fit=crop"
      />
      <section className="section">
        <div className="container contact-grid">
          <Reveal className="contact-info">
            <div className="contact-info__item"><div className="contact-info__mark">⌖</div><div><h3>{ar ? "المقر الرئيسي" : "Headquarters"}</h3><p>{ar ? "بغداد، جمهورية العراق — حي المنصور، برج سبيل الراشد." : "Baghdad, Republic of Iraq — Mansour District, Sabeel Al-Rashid Tower."}</p></div></div>
            <div className="contact-info__item"><div className="contact-info__mark">☏</div><div><h3>{ar ? "الهاتف" : "Phone"}</h3><p><a dir="ltr" href="tel:+9647700000000">+964 770 000 0000</a></p><p><a dir="ltr" href="tel:+9647810000000">+964 781 000 0000</a></p></div></div>
            <div className="contact-info__item"><div className="contact-info__mark">✉</div><div><h3>{ar ? "البريد الإلكتروني" : "Email"}</h3><p><a href="mailto:info@sabeelalrashid.com">info@sabeelalrashid.com</a></p><p><a href="mailto:invest@sabeelalrashid.com">invest@sabeelalrashid.com</a></p></div></div>
            <div className="contact-info__item"><div className="contact-info__mark">◷</div><div><h3>{ar ? "ساعات العمل" : "Working hours"}</h3><p>{ar ? "الأحد – الخميس · ٩:٠٠ – ١٨:٠٠" : "Sunday – Thursday · 9:00 – 18:00"}</p></div></div>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="h3 contact-form-title">
              {ar ? "أرسل لنا رسالة" : "Send us a message"}
            </h2>
            <p className="form__note contact-form-note">{ar ? "نردّ عادةً خلال يومَي عمل." : "We typically reply within two business days."}</p>
            <SubmissionForm kind="contact" locale={locale} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
