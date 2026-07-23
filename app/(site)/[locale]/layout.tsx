import type { Metadata } from "next";
import { Cairo, Poppins } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { siteUrl } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/sanity/data";
import { localize } from "@/lib/types";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { SanityLive } from "@/lib/sanity/live";
import "../../globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const settings = await getSiteSettings();
  const companyName = localize(settings.companyName, locale);
  const title = settings.defaultSeo?.title
    ? localize(settings.defaultSeo.title, locale)
    : companyName;
  const description = settings.defaultSeo?.description
    ? localize(settings.defaultSeo.description, locale)
    : undefined;
  const image =
    settings.defaultSeo?.image || "/assets/logos/sabeel-gold.png";
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s · ${companyName}` },
    description,
    icons: { icon: "/assets/logos/sabeel-gold.svg" },
    robots: settings.defaultSeo?.noIndex
      ? { index: false, follow: false }
      : undefined,
    openGraph: {
      type: "website",
      siteName: companyName,
      title,
      description,
      images: [image],
    },
  };
}
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [messages, settings] = await Promise.all([
    getMessages(),
    getSiteSettings(),
  ]);
  const isDraft = (await draftMode()).isEnabled;
  const companyName = localize(settings.companyName, locale);
  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      data-scroll-behavior="smooth"
      className={`${cairo.variable} ${poppins.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <a className="skip-link" href="#main">
            {locale === "ar" ? "تخطَّ إلى المحتوى" : "Skip to content"}
          </a>
          <SiteHeader companyName={companyName} />
          <main id="main" className="site-main">
            {children}
          </main>
          <SiteFooter settings={settings} locale={locale} />
        </NextIntlClientProvider>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: companyName,
            url: siteUrl,
            logo: `${siteUrl}/assets/logos/sabeel-gold.png`,
            address: {
              "@type": "PostalAddress",
              streetAddress: localize(settings.address, locale),
              addressLocality: "Baghdad",
              addressCountry: "IQ",
            },
            telephone: settings.phone,
            email: settings.email,
            sameAs: settings.socialLinks.map((link) => link.url),
          }}
        />
        {isDraft && <VisualEditing />}
        <SanityLive />
      </body>
    </html>
  );
}
