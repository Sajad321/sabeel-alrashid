import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/page-hero";
import { getBrands } from "@/lib/sanity/data";
import { localize } from "@/lib/types";
import { BrandCarousel } from "@/components/brand-carousel";
import { Reveal } from "@/components/reveal";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    locale,
    "brands",
    { ar: "علاماتنا", en: "Our Brands" },
    {
      ar: "علامات مطاعم يحبّها الناس في العراق.",
      en: "Restaurant brands people love across Iraq.",
    },
  );
}
export default async function Brands({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";
  const brands = await getBrands();
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={ar ? "محفظة العلامات" : "Brand portfolio"}
        title={
          ar
            ? "محفظةٌ من العلامات التي يحبّها الناس."
            : "A portfolio of brands people love."
        }
        description={
          ar
            ? "كل علامةٍ تقف بذاتها — بهويّتها ومطابخها وجمهورها — مدعومةً بقوّة سبيل الراشد المشتركة."
            : "Each brand stands on its own — with its own identity, kitchens and following — powered by the shared strength of Sabeel Al-Rashid."
        }
        image="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=80&auto=format&fit=crop"
      />
      {brands.map((brand, i) => (
        <section className="brand-block" key={brand.slug}>
          <div className="container">
            <div className="brandcard">
              <div className={`brand-head${i % 2 ? " brand-head--reverse" : ""}`}>
                <Reveal className="brand-copy" delay={i % 2 ? 1 : 0}>
                  <span className="eyebrow">
                    {localize(brand.category, locale)}
                  </span>
                  <h2 className="h2">{brand.slug === "super-chicken" ? brand.name.en : localize(brand.name, locale)}</h2>
                  <div className="brand-meta">
                    {brand.stats.slice(0, 2).map((stat) => (
                      <span className="chip" key={stat.label.en}>
                        {stat.value} {localize(stat.label, locale)}
                      </span>
                    ))}
                  </div>
                  <p className="lead">
                    {localize(brand.description, locale)}
                  </p>
                  {brand.website && (
                    <a
                      className="btn btn--visit"
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {ar
                        ? `زيارة موقع ${localize(brand.name, locale)}`
                        : `Visit ${localize(brand.name, locale)}`}{" "}
                      ↗
                    </a>
                  )}
                </Reveal>
                <Reveal className="brand-sidelogo" delay={i % 2 ? 0 : 1}>
                  <div className="disc">
                    <img
                      src={brand.logo}
                      alt={localize(brand.name, locale)}
                    />
                  </div>
                </Reveal>
              </div>
              <BrandCarousel
                brandName={localize(brand.name, locale)}
                locale={locale}
                images={(brand.gallery || []).map((image) => ({
                  src: image.src,
                  alt: image.alt
                    ? localize(image.alt, locale)
                    : localize(brand.name, locale),
                }))}
              />
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
