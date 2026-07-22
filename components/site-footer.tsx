"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const n = useTranslations("nav"),
    f = useTranslations("footer"),
    c = useTranslations("common");
  return (
    <footer className="site-footer">
      <div className="container footer__main">
        <div className="footer__grid">
          <div className="footer__brand">
            <img src="/assets/logos/sabeel-gold.png" alt="Sabeel Al-Rashid" />
            <div className="footer__social">
              <a href="#" aria-label="LinkedIn">
                in
              </a>
              <a href="#" aria-label="X">
                X
              </a>
              <a href="#" aria-label="Facebook">
                f
              </a>
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
              <li>Baghdad, Iraq — Mansour</li>
              <li>
                <a href="tel:+9647700000000" dir="ltr">
                  +964 770 000 0000
                </a>
              </li>
              <li>
                <a href="mailto:info@sabeelalrashid.com">
                  info@sabeelalrashid.com
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
