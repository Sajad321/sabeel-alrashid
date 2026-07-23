import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/page-hero";
import { SubmissionForm } from "@/components/submission-form";
import { Reveal } from "@/components/reveal";
import { getPage, getSiteSettings } from "@/lib/sanity/data";
import { localize } from "@/lib/types";
import { pageHeroProps } from "@/lib/page-content";
const heroFallback = {
  eyebrow: { ar: "تواصل", en: "Contact" },
  title: { ar: "لنتحدّث.", en: "Let's talk." },
  description: { ar: "سواءٌ كنت مستثمراً أو مورّداً أو إعلامياً أو ضيفاً لديه ملاحظة — يسعدنا أن نسمع منك.", en: "Whether you're an investor, a supplier, media or a guest with feedback — we'd love to hear from you." },
  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1900&q=75&auto=format&fit=crop",
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPage("contactPage");
  return pageMetadata(
    locale,
    "contact",
    { ar: "تواصل معنا", en: "Contact" },
    {
      ar: "تواصل مع مجموعة سبيل الراشد في بغداد.",
      en: "Contact Sabeel Al-Rashid in Baghdad.",
    }, undefined, page?.seo,
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
  const [settings, page] = await Promise.all([getSiteSettings(), getPage("contactPage")]);
  const hero = pageHeroProps(page, locale, heroFallback);
  const phoneHref = `tel:${settings.phone.replace(/[^\d+]/g, "")}`;
  return (
    <>
      <PageHero
        locale={locale}
        {...hero}
      />
      <section className="section">
        <div className="container contact-grid">
          <Reveal className="contact-info">
            <div className="contact-info__item"><div className="contact-info__mark">⌖</div><div><h3>{ar ? "المقر الرئيسي" : "Headquarters"}</h3><p>{localize(settings.address, locale)}</p></div></div>
            <div className="contact-info__item"><div className="contact-info__mark">☏</div><div><h3>{ar ? "الهاتف" : "Phone"}</h3><p><a dir="ltr" href={phoneHref}>{settings.phone}</a></p>{settings.secondaryPhone && <p><a dir="ltr" href={`tel:${settings.secondaryPhone.replace(/[^\d+]/g, "")}`}>{settings.secondaryPhone}</a></p>}</div></div>
            <div className="contact-info__item"><div className="contact-info__mark">✉</div><div><h3>{ar ? "البريد الإلكتروني" : "Email"}</h3><p><a href={`mailto:${settings.email}`}>{settings.email}</a></p><p><a href={`mailto:${settings.franchiseEmail}`}>{settings.franchiseEmail}</a></p></div></div>
            <div className="contact-info__item"><div className="contact-info__mark">◷</div><div><h3>{ar ? "ساعات العمل" : "Working hours"}</h3><p>{settings.workingHours ? localize(settings.workingHours, locale) : ar ? "الأحد – الخميس · ٩:٠٠ – ١٨:٠٠" : "Sunday – Thursday · 9:00 – 18:00"}</p></div></div>
          </Reveal>
          <Reveal delay={1}>
            <h2 className="h3 contact-form-title">
              {page?.formHeading ? localize(page.formHeading, locale) : ar ? "أرسل لنا رسالة" : "Send us a message"}
            </h2>
            <p className="form__note contact-form-note">{page?.formDescription ? localize(page.formDescription, locale) : ar ? "نردّ عادةً خلال يومَي عمل." : "We typically reply within two business days."}</p>
            <SubmissionForm kind="contact" locale={locale} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
