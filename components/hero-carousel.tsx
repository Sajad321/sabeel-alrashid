"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LocalizedString } from "@/lib/types";

type Slide = {
  image: string | { src: string; alt?: LocalizedString };
  eyebrow: LocalizedString;
  title: LocalizedString;
};
export function HeroCarousel({
  slides,
  locale,
}: {
  slides: Slide[];
  locale: "ar" | "en";
}) {
  const [index, setIndex] = useState(0);
  const touch = useRef<number | null>(null);
  const go = useCallback(
    (next: number) => setIndex((next + slides.length) % slides.length),
    [slides.length],
  );
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      5000,
    );
    return () => clearInterval(id);
  }, [slides.length]);
  return (
    <section
      className="hero-full"
      aria-roledescription="carousel"
      aria-label={locale === "ar" ? "معرض الصور" : "Image gallery"}
    >
      <div
        className="carousel carousel--full"
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current === null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
          touch.current = null;
        }}
      >
        <div
          className="carousel__track"
          style={{ transform: `translateX(${-index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              className="carousel__slide"
              key={typeof slide.image === "string" ? slide.image : slide.image.src}
              aria-hidden={i !== index}
            >
              <img
                className="carousel__img"
                src={typeof slide.image === "string" ? slide.image : slide.image.src}
                alt={
                  typeof slide.image === "string"
                    ? ""
                    : slide.image.alt?.[locale] || ""
                }
                fetchPriority={i === 0 ? "high" : "auto"}
              />
              <div className="carousel__cap">
                <span className="k">{slide.eyebrow[locale]}</span>
                <div className="ttl">{slide.title[locale]}</div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="carousel__arrow carousel__arrow--prev"
          type="button"
          aria-label={locale === "ar" ? "السابق" : "Previous"}
          onClick={() => go(index - 1)}
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          className="carousel__arrow carousel__arrow--next"
          type="button"
          aria-label={locale === "ar" ? "التالي" : "Next"}
          onClick={() => go(index + 1)}
        >
          <span aria-hidden="true">→</span>
        </button>
        <div className="carousel__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className="carousel__dot"
              aria-current={i === index}
              aria-label={`${locale === "ar" ? "الشريحة" : "Slide"} ${i + 1}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
