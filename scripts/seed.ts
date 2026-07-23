import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { articles, branches, brands, divisions, jobs, teamMembers } from "../lib/content";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  throw new Error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN are required to seed Sanity.",
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-01",
  token,
  useCdn: false,
});
const localized = (value: { ar: string; en: string }) => value;
const slug = (current: string) => ({ _type: "slug", current });
const ref = (_ref: string) => ({ _type: "reference", _ref });

async function imageAsset(source: string, filename?: string) {
  const name = filename || basename(new URL(source).pathname) || "image.jpg";
  const existing = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $name][0]._id`,
    { name },
  );
  if (existing) return { _type: "image", asset: ref(existing) };
  const input = source.startsWith("http")
    ? Buffer.from(await (await fetch(source)).arrayBuffer())
    : await readFile(join(process.cwd(), source));
  const asset = await client.assets.upload("image", input, { filename: name });
  return { _type: "image", asset: ref(asset._id) };
}
const block = (text: string) => [
  {
    _type: "block",
    _key: "body",
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: "text", marks: [], text }],
  },
];

async function seed() {
  const tx = client.transaction();
  tx.createIfNotExists({
    _id: "siteSettings",
    _type: "siteSettings",
    companyName: { ar: "مجموعة سبيل الراشد", en: "Sabeel Al-Rashid Group" },
    address: { ar: "بغداد، العراق — المنصور", en: "Baghdad, Iraq — Mansour" },
    phone: "+964 770 000 0000",
    email: "info@sabeelalrashid.com",
    franchiseEmail: "invest@sabeelalrashid.com",
    careersEmail: "careers@sabeelalrashid.com",
  });
  tx.createIfNotExists({
    _id: "homePage",
    _type: "homePage",
    title: { ar: "الرئيسية", en: "Home" },
  });
  const pages = [
    "aboutPage",
    "brandsPage",
    "franchisePage",
    "careersPage",
    "contactPage",
    "applicationPage",
    "newsPage",
  ];
  for (const type of pages)
    tx.createIfNotExists({
      _id: type,
      _type: type,
      title: {
        ar: type === "aboutPage" ? "من نحن" : type,
        en: type.replace("Page", ""),
      },
    });
  for (const [i, division] of divisions.entries())
    tx.createIfNotExists({
      _id: `division.${i}`,
      _type: "division",
      name: localized(division.title),
      slug: slug(division.title.en.toLowerCase().replace(/[^a-z0-9]+/g, "-")),
      order: i,
    });
  for (const category of Array.from(
    new Map(articles.map((a) => [a.categoryKey, a.category])).entries(),
  ))
    tx.createIfNotExists({
      _id: `newsCategory.${category[0]}`,
      _type: "newsCategory",
      title: category[1],
      slug: slug(category[0]),
    });
  await tx.commit();

  for (const [i, brand] of brands.entries()) {
    const logo = await imageAsset(
      brand.logo.slice(1),
      `brand-${brand.slug}-logo${brand.logo.endsWith(".png") ? ".png" : ".jpg"}`,
    );
    let image;
    try {
      image = await imageAsset(brand.image, `brand-${brand.slug}.jpg`);
    } catch {}
    const gallery = await Promise.all(
      (brand.gallery || []).map(async (item, galleryIndex) => ({
        ...(await imageAsset(
          item.src,
          `brand-${brand.slug}-gallery-${galleryIndex + 1}.jpg`,
        )),
        alt: item.alt,
      })),
    );
    await client.createIfNotExists({
      _id: `brand.${brand.slug}`,
      _type: "brand",
      name: brand.name,
      slug: slug(brand.slug),
      category: brand.category,
      description: brand.description,
      website: brand.website,
      logo,
      image,
      gallery,
      stats: brand.stats.map((s, j) => ({
        _key: `stat-${j}`,
        _type: "stat",
        ...s,
      })),
      active: true,
      order: i,
    });
  }
  for (const branch of branches)
    await client.createIfNotExists({
      _id: `branch.${branch.slug}`,
      _type: "branch",
      name: branch.district,
      slug: slug(branch.slug),
      brand: ref(`brand.${branch.brand}`),
      district: branch.district,
      side: branch.side,
      location: { _type: "geopoint", lat: branch.lat, lng: branch.lng },
      mapX: branch.x,
      mapY: branch.y,
      active: true,
    });
  for (const article of articles) {
    let image;
    try {
      image = await imageAsset(article.image, `news-${article.slug}.jpg`);
    } catch {}
    await client.createIfNotExists({
      _id: `newsArticle.${article.slug}`,
      _type: "newsArticle",
      title: article.title,
      slug: slug(article.slug),
      excerpt: article.excerpt,
      body: {
        ar: block(article.body.map((p) => p.ar).join("\n\n")),
        en: block(article.body.map((p) => p.en).join("\n\n")),
      },
      category: ref(`newsCategory.${article.categoryKey}`),
      publishedAt: new Date(article.date).toISOString(),
      image,
    });
  }
  for (const job of jobs)
    await client.createIfNotExists({
      _id: `job.${job.slug}`,
      _type: "job",
      title: job.title,
      slug: slug(job.slug),
      department: job.department,
      employmentType: job.type,
      description: job.description,
      publishedAt: "2026-07-01T09:00:00.000Z",
      active: true,
    });
  for (const [index, member] of teamMembers.entries()) {
    const photo = await imageAsset(member.photo, `team-${member.slug}.jpg`);
    await client.createIfNotExists({
      _id: `teamMember.${member.slug}`,
      _type: "teamMember",
      name: member.name,
      role: member.role,
      photo: { ...photo, alt: member.name },
      order: index,
    });
  }
  console.log(
    "Seed complete: bilingual pages, brands, branches, news and jobs are ready.",
  );
}
seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
