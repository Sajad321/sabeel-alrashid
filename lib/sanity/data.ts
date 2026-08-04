import { defineQuery } from "next-sanity";
import { sanityClient } from "./client";
import { liveFetch } from "./live";
import {
  articles as fallbackArticles,
  branches as fallbackBranches,
  brands as fallbackBrands,
  divisions as fallbackDivisions,
  jobs as fallbackJobs,
  teamMembers as fallbackTeamMembers,
} from "@/lib/content";
import type {
  CmsArticle,
  Branch,
  CmsBrand,
  Brand,
  CmsTeamMember,
  Job,
  PageDocument,
  LocalizedString,
  SiteSettings,
} from "@/lib/types";

const BRANDS_QUERY = defineQuery(
  `*[_type == "brand" && active != false] | order(order asc){"slug":slug.current,name,category,description,website,"logo":logo.asset->url,"image":{"src":image.asset->url,"alt":image.alt},"gallery":gallery[]{"src":asset->url,alt},stats[]{value,label}}`,
);
const BRANCHES_QUERY = defineQuery(
  `*[_type == "branch" && active != false] | order(order asc, district.en asc){"slug":slug.current,"brand":brand->slug.current,name,district,side,address,phone,hours,"lat":location.lat,"lng":location.lng,"x":mapX,"y":mapY}`,
);
const ARTICLES_QUERY = defineQuery(
  `*[_type == "newsArticle" && defined(slug.current)] | order(publishedAt desc){"slug":slug.current,title,excerpt,body,"category":category->title,"categoryKey":category->slug.current,"date":publishedAt,"image":{"src":image.asset->url,"alt":image.alt},"seo":seo{title,description,"image":image.asset->url,noIndex}}`,
);
const JOBS_QUERY = defineQuery(
  `*[_type == "job" && active != false && (!defined(expiresAt) || expiresAt > now())] | order(publishedAt desc){"slug":slug.current,title,department,"type":employmentType,description,responsibilities,requirements,publishedAt,expiresAt}`,
);
const DIVISIONS_QUERY = defineQuery(
  `*[_type == "division"] | order(order asc){"slug":slug.current,"title":name,description,"image":{"src":image.asset->url,"alt":image.alt}}`,
);
const HOME_QUERY = defineQuery(
  `*[_id == "homePage"][0]{title,heroSlides[]{eyebrow,title,"image":{"src":image.asset->url,"alt":image.alt}},introduction{heading,body,"image":{"src":image.asset->url,"alt":image.alt}},introductionFacts[]{value,label},statistics[]{value,label},divisionsHeading,brandsHeading,branchesHeading,branchesDescription,newsHeading,brandFocusHeading,sustainability{heading,body,"image":{"src":image.asset->url,"alt":image.alt}},sustainabilityFacts[]{value,label},seo{title,description,"image":image.asset->url,noIndex}}`,
);
const TEAM_QUERY = defineQuery(
  `*[_type == "teamMember"] | order(order asc){"slug":_id,name,role,"photo":{"src":photo.asset->url,"alt":photo.alt}}`,
);
const SITE_SETTINGS_QUERY = defineQuery(
  `*[_id == "siteSettings"][0]{companyName,address,phone,email,franchiseEmail,careersEmail,secondaryPhone,workingHours,socialLinks[]{label,url},defaultSeo{title,description,"image":image.asset->url,noIndex}}`,
);
const PAGE_QUERY = defineQuery(
  `*[_id == $id][0]{title,hero{eyebrow,title,description,"image":{"src":image.asset->url,"alt":image.alt}},seo{title,description,"image":image.asset->url,noIndex},introduction{heading,body,"image":{"src":image.asset->url,"alt":image.alt}},statistics[]{value,label},historyHeading,timeline[]{year,title,description},vision{heading,body,"image":{"src":image.asset->url,"alt":image.alt}},mission{heading,body,"image":{"src":image.asset->url,"alt":image.alt}},teamHeading,featuresHeading,features[]{icon,title,description},formHeading,formDescription,formFields[]{key,label,type,placeholder,options,required,fullWidth},culture{heading,body,"image":{"src":image.asset->url,"alt":image.alt}},cultureValues,benefitsHeading,benefits[]{icon,title,description},positionsHeading,callToAction{heading,body,"image":{"src":image.asset->url,"alt":image.alt}},callToActionLabel}`,
);

const fallbackSiteSettings: SiteSettings = {
  companyName: {
    ar: "مجموعة سبيل الراشد",
    en: "Sabeel Al-Rashid Group",
  },
  address: {
    ar: "بغداد، جمهورية العراق — حي المنصور، برج سبيل الراشد.",
    en: "Baghdad, Republic of Iraq — Mansour District, Sabeel Al-Rashid Tower.",
  },
  phone: "+964 770 000 0000",
  email: "info@sabeelalrashid.com",
  franchiseEmail: "invest@sabeelalrashid.com",
  careersEmail: "careers@sabeelalrashid.com",
  socialLinks: [],
};

async function fetchData<T>(
  query: string,
  tag: string,
  fallback: T,
  params: Record<string, unknown> = {},
): Promise<T> {
  if (!sanityClient) return fallback;
  try {
    return await liveFetch<T>({
      query,
      params,
      tags: [`sanity:${tag}`],
    });
  } catch {
    return fallback;
  }
}

export async function getBrands(): Promise<CmsBrand[]> {
  const records = await fetchData<Array<Brand | CmsBrand>>(
    BRANDS_QUERY,
    "brand",
    fallbackBrands,
  );
  return records.map((brand) => ({
    ...brand,
    image:
      typeof brand.image === "string"
        ? { src: brand.image, alt: brand.name }
        : brand.image?.src
          ? brand.image
          : {
              src:
                fallbackBrands.find((item) => item.slug === brand.slug)?.image ||
                "",
              alt: brand.name,
            },
  }));
}
export const getBranches = () =>
  fetchData<Branch[]>(BRANCHES_QUERY, "branch", fallbackBranches as Branch[]);
export const getJobs = () =>
  fetchData<Job[]>(JOBS_QUERY, "job", fallbackJobs as Job[]);
export async function getDivisions() {
  const records = await fetchData<Array<{ slug?: string; title: LocalizedString; description?: LocalizedString; image: { src: string; alt?: LocalizedString } }>>(
    DIVISIONS_QUERY,
    "division",
    fallbackDivisions.map((division) => ({
      ...division,
      image: { src: division.image, alt: division.title },
    })),
  );
  return records.map((division, index) => ({
    ...division,
    image: division.image?.src
      ? division.image
      : {
          src: fallbackDivisions[index]?.image || "",
          alt: division.title,
        },
  }));
}

export async function getArticles(): Promise<CmsArticle[]> {
  const fallback = fallbackArticles.map((article) => ({
    ...article,
    body: {
      ar: plainTextBlocks(article.body.map((paragraph) => paragraph.ar)),
      en: plainTextBlocks(article.body.map((paragraph) => paragraph.en)),
    },
    image: { src: article.image, alt: article.title },
  }));
  return fetchData<CmsArticle[]>(ARTICLES_QUERY, "newsArticle", fallback);
}

export const getHomePage = () =>
  fetchData<{
    title?: LocalizedString;
    heroSlides?: Array<{
      eyebrow: LocalizedString;
      title: LocalizedString;
      image: { src: string; alt?: LocalizedString };
    }>;
    introduction?: PageDocument["introduction"];
    introductionFacts?: Array<{ value: string; label: LocalizedString }>;
    statistics?: Array<{ value: string; label: LocalizedString }>;
    divisionsHeading?: LocalizedString;
    brandsHeading?: LocalizedString;
    branchesHeading?: LocalizedString;
    branchesDescription?: LocalizedString;
    newsHeading?: LocalizedString;
    brandFocusHeading?: LocalizedString;
    sustainability?: PageDocument["introduction"];
    sustainabilityFacts?: Array<{ value: string; label: LocalizedString }>;
    seo?: PageDocument["seo"];
  } | null>(HOME_QUERY, "homePage", null);
export const getTeamMembers = () =>
  fetchData<CmsTeamMember[]>(
    TEAM_QUERY,
    "teamMember",
    fallbackTeamMembers.map((member) => ({
      ...member,
      photo: { src: member.photo, alt: member.name },
    })),
  );

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await fetchData<Partial<SiteSettings> | null>(
    SITE_SETTINGS_QUERY,
    "siteSettings",
    fallbackSiteSettings,
  );
  if (!settings) return fallbackSiteSettings;
  return {
    ...fallbackSiteSettings,
    ...settings,
    companyName: {
      ...fallbackSiteSettings.companyName,
      ...settings.companyName,
    },
    address: {
      ...fallbackSiteSettings.address,
      ...settings.address,
    },
    socialLinks: settings.socialLinks?.filter((link) => link.label && link.url) || [],
  };
}

export const getPage = (id: string) =>
  fetchData<PageDocument | null>(PAGE_QUERY, id, null, { id });

function plainTextBlocks(paragraphs: string[]) {
  return paragraphs.map((text, index) => ({
    _type: "block",
    _key: `fallback-${index}`,
    style: "normal",
    markDefs: [],
    children: [
      { _type: "span", _key: `fallback-span-${index}`, marks: [], text },
    ],
  }));
}
