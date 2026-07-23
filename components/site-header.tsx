"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";

const nav = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/brands", key: "brands" },
  { href: "/franchise", key: "franchise" },
  { href: "/careers", key: "careers" },
  { href: "/news", key: "news" },
  { href: "/contact", key: "contact" },
] as const;

export function SiteHeader({ companyName }: { companyName: string }) {
  const t = useTranslations("nav");
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const active = (href: string) =>
    href === "/" ? path === "/" : path.startsWith(href);
  return (
    <>
      <header
        className={`site-header ${scrolled ? "is-scrolled" : ""}`}
        id="siteHeader"
      >
        <div className="container nav">
          <Link className="nav__logo" href="/" aria-label={companyName}>
            <img src="/assets/logos/sabeel-gold.png" alt={companyName} />
          </Link>
          <nav className="nav__links" aria-label={t("menu")}>
            {nav.map((item) => (
              <Link
                key={item.key}
                className={`nav__link ${active(item.href) ? "is-active" : ""}`}
                href={item.href}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <div className="nav__actions">
            <LocaleSwitcher />
            <Link className="btn btn--gold nav__cta" href="/franchise">
              {t("partner")}
            </Link>
            <button
              className="nav__burger"
              type="button"
              aria-label={t("menu")}
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>
      <div
        className={`mobile-menu ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="container">
          <div className="mobile-menu__top">
            <Link className="nav__logo" href="/" onClick={() => setOpen(false)}>
              <img src="/assets/logos/sabeel-gold.png" alt={companyName} />
            </Link>
            <button
              className="mobile-menu__close"
              aria-label={t("close")}
              onClick={() => setOpen(false)}
            >
              <X />
            </button>
          </div>
          {nav.map((item) => (
            <Link
              key={item.key}
              className={active(item.href) ? "is-active" : ""}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="mobile-menu__actions">
            <Link
              className="btn btn--gold"
              href="/franchise"
              onClick={() => setOpen(false)}
            >
              {t("partner")}
            </Link>
            <LocaleSwitcher mobile />
          </div>
        </div>
      </div>
    </>
  );
}
