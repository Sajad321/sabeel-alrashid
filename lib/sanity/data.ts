import { defineQuery } from "next-sanity";
import { sanityClient } from "./client";
import {
  articles as fallbackArticles,
  branches as fallbackBranches,
  brands as fallbackBrands,
  divisions as fallbackDivisions,
  jobs as fallbackJobs,
  teamMembers as fallbackTeamMembers,
} from "@/lib/content";
import type { Article, Branch, Brand, Job, LocalizedString, TeamMember } from "@/lib/types";

const BRANDS_QUERY = defineQuery(
  `*[_type == "brand" && active != false] | order(order asc){"slug":slug.current,name,category,description,website,"logo":logo.asset->url,"image":image.asset->url,"gallery":gallery[]{"src":asset->url,alt},stats[]{value,label}}`,
);
const BRANCHES_QUERY = defineQuery(
  `*[_type == "branch" && active != false]{"slug":slug.current,"brand":brand->slug.current,district,side,"lat":location.lat,"lng":location.lng,"x":mapX,"y":mapY}`,
);
const ARTICLES_QUERY = defineQuery(
  `*[_type == "newsArticle" && defined(slug.current)] | order(publishedAt desc){"slug":slug.current,title,excerpt,"bodyAr":pt::text(body.ar),"bodyEn":pt::text(body.en),"category":category->title,"categoryKey":category->slug.current,"date":publishedAt,"image":image.asset->url}`,
);
const JOBS_QUERY = defineQuery(
  `*[_type == "job" && active != false && (!defined(expiresAt) || expiresAt > now())] | order(publishedAt desc){"slug":slug.current,title,department,"type":employmentType,description}`,
);
const DIVISIONS_QUERY = defineQuery(
  `*[_type == "division"] | order(order asc){"title":name,"image":image.asset->url}`,
);
const HOME_QUERY = defineQuery(
  `*[_id == "homePage"][0]{heroSlides[]{eyebrow,title,"image":image.asset->url}}`,
);
const TEAM_QUERY = defineQuery(
  `*[_type == "teamMember"] | order(order asc){"slug":_id,name,role,"photo":photo.asset->url}`,
);

async function fetchData<T>(
  query: string,
  tag: string,
  fallback: T,
): Promise<T> {
  if (!sanityClient) return fallback;
  try {
    return await sanityClient.fetch<T>(
      query,
      {},
      process.env.NODE_ENV === "development"
        ? { cache: "no-store" }
        : { next: { revalidate: 3600, tags: [`sanity:${tag}`] } },
    );
  } catch {
    return fallback;
  }
}

export async function getBrands(): Promise<Brand[]> {
  const records = await fetchData<Brand[]>(BRANDS_QUERY, "brand", fallbackBrands);
  return records.map((brand) => {
    const fallback = fallbackBrands.find((item) => item.slug === brand.slug);
    return {
      ...brand,
      website: brand.website || fallback?.website,
      gallery: brand.gallery?.length ? brand.gallery : fallback?.gallery,
    };
  });
}
export const getBranches = () =>
  fetchData<Branch[]>(BRANCHES_QUERY, "branch", fallbackBranches);
export const getJobs = () => fetchData<Job[]>(JOBS_QUERY, "job", fallbackJobs);
export const getDivisions = () =>
  fetchData<Array<{ title: LocalizedString; image: string }>>(
    DIVISIONS_QUERY,
    "division",
    fallbackDivisions,
  );

export async function getArticles(): Promise<Article[]> {
  const raw = await fetchData<
    Array<
      Omit<Article, "body"> & {
        body?: Article["body"];
        bodyAr?: string;
        bodyEn?: string;
      }
    >
  >(ARTICLES_QUERY, "newsArticle", fallbackArticles);
  return raw.map((item) =>
    item.body
      ? (item as Article)
      : { ...item, body: [{ ar: item.bodyAr || "", en: item.bodyEn || "" }] },
  );
}

export const getHomePage = () =>
  fetchData<{
    heroSlides?: Array<{
      eyebrow: LocalizedString;
      title: LocalizedString;
      image: string;
    }>;
  } | null>(HOME_QUERY, "homePage", null);
export const getTeamMembers = () =>
  fetchData<TeamMember[]>(TEAM_QUERY, "teamMember", fallbackTeamMembers);
