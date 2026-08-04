import type { Locale } from "@/i18n/routing";

export type LocalizedString = { ar: string; en: string };
export type LocalizedText = LocalizedString;
export type LocalizedImage = {
  src: string;
  alt?: LocalizedString;
};
export type SeoFields = {
  title?: LocalizedString;
  description?: LocalizedText;
  image?: string;
  noIndex?: boolean;
};
export type PageHeroContent = {
  eyebrow?: LocalizedString;
  title?: LocalizedString;
  description?: LocalizedText;
  image?: LocalizedImage;
};
export type ContentBlock = {
  heading?: LocalizedString;
  body?: LocalizedText;
  image?: LocalizedImage;
};
export type FeatureItem = {
  icon?: string;
  title: LocalizedString;
  description: LocalizedText;
};
export type FranchiseFormField = {
  key: string;
  label: LocalizedString;
  type: "text" | "email" | "tel" | "number" | "select" | "textarea";
  placeholder?: LocalizedString;
  options?: LocalizedString[];
  required?: boolean;
  fullWidth?: boolean;
};
export type PageDocument = {
  title?: LocalizedString;
  hero?: PageHeroContent;
  seo?: SeoFields;
  introduction?: ContentBlock;
  statistics?: Array<{ value: string; label: LocalizedString }>;
  historyHeading?: LocalizedString;
  timeline?: Array<{
    year: string;
    title: LocalizedString;
    description: LocalizedText;
  }>;
  vision?: ContentBlock;
  mission?: ContentBlock;
  teamHeading?: LocalizedString;
  featuresHeading?: LocalizedString;
  features?: FeatureItem[];
  formHeading?: LocalizedString;
  formDescription?: LocalizedText;
  formFields?: FranchiseFormField[];
  culture?: ContentBlock;
  cultureValues?: LocalizedString[];
  benefitsHeading?: LocalizedString;
  benefits?: FeatureItem[];
  positionsHeading?: LocalizedString;
  callToAction?: ContentBlock;
  callToActionLabel?: LocalizedString;
};
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
  name?: LocalizedString;
  address?: LocalizedText;
  phone?: string;
  hours?: LocalizedText;
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
  seo?: SeoFields;
};
export type Job = {
  slug: string;
  title: LocalizedString;
  department: LocalizedString;
  type: LocalizedString;
  description: LocalizedText;
  responsibilities?: { ar: unknown[]; en: unknown[] };
  requirements?: { ar: unknown[]; en: unknown[] };
  publishedAt?: string;
  expiresAt?: string;
};
export type TeamMember = {
  slug: string;
  name: LocalizedString;
  role: LocalizedString;
  photo: string;
};
export type CmsBrand = Omit<Brand, "image"> & { image: LocalizedImage };
export type CmsArticle = Omit<Article, "body" | "image"> & {
  body: { ar: unknown[]; en: unknown[] };
  image: LocalizedImage;
};
export type CmsTeamMember = Omit<TeamMember, "photo"> & {
  photo: LocalizedImage;
};
export type SiteSettings = {
  companyName: LocalizedString;
  address: LocalizedText;
  phone: string;
  email: string;
  franchiseEmail: string;
  careersEmail: string;
  secondaryPhone?: string;
  workingHours?: LocalizedString;
  socialLinks: Array<{ label: string; url: string }>;
  defaultSeo?: SeoFields;
};
