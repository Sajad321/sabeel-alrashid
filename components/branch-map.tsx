"use client";
import { useState } from "react";
import type { Branch, Brand } from "@/lib/types";
import { localize } from "@/lib/types";

export function BranchMap({
  branches,
  brands,
  locale,
}: {
  branches: Branch[];
  brands: Brand[];
  locale: "ar" | "en";
}) {
  const [active, setActive] = useState(0);
  const brandFor = (slug: string) => brands.find((b) => b.slug === slug)!;
  return (
    <div className="bmap" id="baghdad-map">
      <div className="bmap__stage">
        <img
          className="bmap__bg"
          src="/assets/baghdad-map-new.jpg"
          alt={locale === "ar" ? "خريطة فروع بغداد" : "Map of Baghdad branches"}
        />
        <div className="bmap__pins">
          {branches.map((branch, i) => {
            const brand = brandFor(branch.brand);
            return (
              <button
                key={branch.slug}
                className={`gpin gpin--${branch.brand === "super-chicken" ? "sc" : "ar"} ${active === i ? "act" : ""}`}
                style={{ left: `${branch.x}%`, top: `${branch.y}%` }}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-label={`${localize(brand.name, locale)} — ${localize(branch.district, locale)}`}
              >
                <span className="gpin__num">
                  <img src={brand.logo} alt="" />
                </span>
              </button>
            );
          })}
        </div>
        <div className="bmap__tag">
          <span className="bmap__dot" />
          {locale === "ar"
            ? `بغداد · ${branches.length} فروع`
            : `Baghdad · ${branches.length} branches`}
        </div>
        <a
          className="bmap__open"
          target="_blank"
          rel="noreferrer"
          href="https://www.google.com/maps/search/?api=1&query=Baghdad+Iraq"
        >
          {locale === "ar" ? "فتح في خرائط Google ↗" : "Open in Google Maps ↗"}
        </a>
        <div className="bmap__legend">
          {brands.map((b) => (
            <span className="bmap__lg" key={b.slug}>
              <img src={b.logo} alt="" />
              {localize(b.name, locale)}
            </span>
          ))}
        </div>
      </div>
      <div className="bpanel">
        <div className="bpanel__head">
          <div className="bpanel__ey">
            {locale === "ar" ? "شبكة فروعنا" : "Our network"}
          </div>
          <h3 className="bpanel__title">
            {locale === "ar" ? "فروعنا في بغداد" : "Branches in Baghdad"}
          </h3>
          <p className="bpanel__sub">
            {locale === "ar"
              ? "اضغط على علامة لعرض التفاصيل."
              : "Select a pin for details."}
          </p>
        </div>
        <div className="bpanel__list">
          {branches.map((branch, i) => {
            const brand = brandFor(branch.brand);
            const url = `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`;
            return (
              <div
                key={branch.slug}
                className={`bcard ${active === i ? "act" : ""}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <div className="bcard__logo">
                  <img src={brand.logo} alt="" />
                </div>
                <div className="bcard__main">
                  <div className="bcard__top">
                    <span className="bcard__brand">
                      {localize(brand.name, locale)}
                    </span>
                    <span
                      className={`bcard__tag ${branch.brand === "super-chicken" ? "sc" : "ar"}`}
                    >
                      {localize(branch.side, locale)}
                    </span>
                  </div>
                  <div className="bcard__city">
                    ⌖ {localize(branch.district, locale)}
                  </div>
                </div>
                <a
                  className="bcard__btn bcard__btn--go"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {locale === "ar" ? "الاتجاهات" : "Directions"} →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
