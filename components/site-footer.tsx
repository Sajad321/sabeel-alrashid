"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { localize, type SiteSettings } from "@/lib/types";

export function SiteFooter({
  settings,
  locale,
}: {
  settings: SiteSettings;
  locale: Locale;
}) {
  const n = useTranslations("nav"),
    f = useTranslations("footer"),
    c = useTranslations("common");
  const companyName = localize(settings.companyName, locale);
  const phoneHref = `tel:${settings.phone.replace(/[^\d+]/g, "")}`;
  return (
    <footer className="site-footer">
      <div className="container footer__main">
        <div className="footer__grid">
          <div className="footer__brand">
            <img src="/assets/logos/sabeel-gold.png" alt={companyName} />
            <div className="footer__social">
              {settings.socialLinks.map((social) => (
                <a
                  href={social.url}
                  aria-label={social.label}
                  target="_blank"
                  rel="noreferrer"
                  key={`${social.label}-${social.url}`}
                >
                  {socialGlyph(social.label)}
                </a>
              ))}
            </div>
          </div>
          <FooterCol
            title={f("company")}
            links={[
              ["/", n("home")],
              ["/about", n("about")],
              ["/brands", n("brands")],
            ]}
          />
          <FooterCol
            title={f("business")}
            links={[
              ["/franchise", n("franchise")],
              ["/careers", n("careers")],
              ["/careers/apply", c("apply")],
            ]}
          />
          <FooterCol
            title={f("media")}
            links={[
              ["/news", n("news")],
              ["/contact", n("contact")],
            ]}
          />
          <div className="footer__col footer__col--contact">
            <h4>{f("contact")}</h4>
            <ul>
              <li>{localize(settings.address, locale)}</li>
              <li>
                <a href={phoneHref} dir="ltr">
                  {settings.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`}>
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>{f("rights")}</span>
          <button
            className="footer__totop"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {c("backToTop")} ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
function socialGlyph(label: string) {
  const name = label.toLowerCase();
  if (name.includes("linkedin")) return "in";
  if (name.includes("facebook")) return "f";
  if (name.includes("instagram")) return "◎";
  if (name.includes("tiktok")) return "♪";
  if (name === "x" || name.includes("twitter")) return "X";
  return label.slice(0, 2);
}
function FooterCol({ title, links }: { title: string; links: string[][] }) {
  return (
    <div className="footer__col">
      <h4>{title}</h4>
      <ul>
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
