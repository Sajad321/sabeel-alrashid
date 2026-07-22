import type { Locale } from "@/i18n/routing";

export type LocalizedString = { ar: string; en: string };
export type LocalizedText = LocalizedString;
export const localize = (value: LocalizedString, locale: Locale) =>
  value[locale] || value.ar;

export type Brand = {
  slug: string;
  name: LocalizedString;
  category: LocalizedString;
  description: LocalizedText;
  logo: string;
  image: string;
  website?: string;
  gallery?: Array<{ src: string; alt?: LocalizedString }>;
  stats: Array<{ value: string; label: LocalizedString }>;
};
export type Branch = {
  slug: string;
  brand: "super-chicken" | "alrukn";
  district: LocalizedString;
  side: LocalizedString;
  lat: number;
  lng: number;
  x: number;
  y: number;
};
export type Article = {
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedText;
  body: LocalizedText[];
  category: LocalizedString;
  categoryKey: string;
  date: string;
  image: string;
};
export type Job = {
  slug: string;
  title: LocalizedString;
  department: LocalizedString;
  type: LocalizedString;
  description: LocalizedText;
};
export type TeamMember = {
  slug: string;
  name: LocalizedString;
  role: LocalizedString;
  photo: string;
};
