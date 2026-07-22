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
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Sabeel Al-Rashid", template: "%s · Sabeel Al-Rashid" },
  icons: { icon: "/assets/logos/sabeel-gold.svg" },
};
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
  const messages = await getMessages();
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
          <SiteHeader />
          <main id="main" className="site-main">
            {children}
          </main>
          <SiteFooter />
        </NextIntlClientProvider>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Sabeel Al-Rashid",
            url: siteUrl,
            logo: `${siteUrl}/assets/logos/sabeel-gold.png`,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Baghdad",
              addressCountry: "IQ",
            },
          }}
        />
      </body>
    </html>
  );
}
