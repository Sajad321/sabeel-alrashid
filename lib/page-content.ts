import type { Locale } from "@/i18n/routing";
import type {
  LocalizedString,
  PageDocument,
  PageHeroContent,
} from "@/lib/types";
import { localize } from "@/lib/types";

export type HeroFallback = {
  eyebrow: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  image: string;
  imageAlt?: LocalizedString;
};

export function pageHeroProps(
  page: PageDocument | null,
  locale: Locale,
  fallback: HeroFallback,
) {
  const hero: PageHeroContent | undefined = page?.hero;
  return {
    eyebrow: hero?.eyebrow
      ? localize(hero.eyebrow, locale)
      : localize(fallback.eyebrow, locale),
    title: hero?.title
      ? localize(hero.title, locale)
      : localize(fallback.title, locale),
    description: hero?.description
      ? localize(hero.description, locale)
      : localize(fallback.description, locale),
    image: hero?.image?.src || fallback.image,
    imageAlt: hero?.image?.alt
      ? localize(hero.image.alt, locale)
      : fallback.imageAlt
        ? localize(fallback.imageAlt, locale)
        : "",
  };
}
