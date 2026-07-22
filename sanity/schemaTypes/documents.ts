import { defineArrayMember, defineField, defineType } from "sanity";
const page = (name: string, title: string) =>
  defineType({
    name,
    title,
    type: "document",
    fields: [
      defineField({
        name: "title",
        type: "localizedString",
        validation: (r) => r.required(),
      }),
      defineField({
        name: "sections",
        type: "array",
        of: [defineArrayMember({ type: "pageSection" })],
      }),
      defineField({ name: "seo", type: "seo" }),
    ],
    preview: { select: { title: "title.en", subtitle: "title.ar" } },
  });
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "companyName",
      type: "localizedString",
      validation: (r) => r.required(),
    }),
    defineField({ name: "address", type: "localizedText" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "franchiseEmail", type: "string" }),
    defineField({ name: "careersEmail", type: "string" }),
    defineField({
      name: "socialLinks",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "url", type: "url" }),
          ],
        }),
      ],
    }),
    defineField({ name: "defaultSeo", type: "seo" }),
  ],
});
export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "localizedString" }),
    defineField({
      name: "heroSlides",
      type: "array",
      validation: (r) => r.min(1).max(8),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "eyebrow", type: "localizedString" }),
            defineField({
              name: "title",
              type: "localizedString",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "image",
              type: "imageWithAlt",
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "title.en", media: "image" } },
        }),
      ],
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
});
export const aboutPage = page("aboutPage", "About page");
export const brandsPage = page("brandsPage", "Brands page");
export const franchisePage = page("franchisePage", "Franchise page");
export const careersPage = page("careersPage", "Careers page");
export const contactPage = page("contactPage", "Contact page");
export const applicationPage = page("applicationPage", "Application page");
export const brand = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "localizedString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name.en" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "category", type: "localizedString" }),
    defineField({ name: "description", type: "localizedText" }),
    defineField({ name: "website", title: "Website or social page", type: "url" }),
    defineField({
      name: "logo",
      type: "image",
      validation: (r) => r.required(),
    }),
    defineField({ name: "image", type: "imageWithAlt" }),
    defineField({
      name: "gallery",
      title: "Moving image carousel",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      validation: (r) => r.max(12),
    }),
    defineField({
      name: "stats",
      type: "array",
      of: [defineArrayMember({ type: "stat" })],
    }),
    defineField({ name: "active", type: "boolean", initialValue: true }),
    defineField({ name: "order", type: "number" }),
  ],
  preview: { select: { title: "name.en", subtitle: "name.ar", media: "logo" } },
});
export const division = defineType({
  name: "division",
  title: "Division",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "localizedString",
      validation: (r) => r.required(),
    }),
    defineField({ name: "slug", type: "slug", options: { source: "name.en" } }),
    defineField({ name: "description", type: "localizedText" }),
    defineField({ name: "image", type: "imageWithAlt" }),
    defineField({ name: "order", type: "number" }),
  ],
  preview: {
    select: { title: "name.en", subtitle: "name.ar", media: "image" },
  },
});
export const branch = defineType({
  name: "branch",
  title: "Branch",
  type: "document",
  fields: [
    defineField({ name: "name", type: "localizedString" }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name.en" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "brand",
      type: "reference",
      to: [{ type: "brand" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "district",
      type: "localizedString",
      validation: (r) => r.required(),
    }),
    defineField({ name: "side", type: "localizedString" }),
    defineField({ name: "address", type: "localizedText" }),
    defineField({
      name: "location",
      type: "geopoint",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "mapX",
      type: "number",
      validation: (r) => r.required().min(0).max(100),
    }),
    defineField({
      name: "mapY",
      type: "number",
      validation: (r) => r.required().min(0).max(100),
    }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "hours", type: "localizedText" }),
    defineField({ name: "active", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "district.en", subtitle: "district.ar" } },
});
export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "localizedString",
      validation: (r) => r.required(),
    }),
    defineField({ name: "role", type: "localizedString" }),
    defineField({ name: "photo", type: "imageWithAlt" }),
    defineField({ name: "order", type: "number" }),
  ],
  preview: {
    select: { title: "name.en", subtitle: "role.en", media: "photo" },
  },
});
export const newsCategory = defineType({
  name: "newsCategory",
  title: "News category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "localizedString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title.en" },
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "title.en", subtitle: "title.ar" } },
});
export const newsArticle = defineType({
  name: "newsArticle",
  title: "News article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "localizedString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title.en" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "excerpt",
      type: "localizedText",
      validation: (r) => r.required(),
    }),
    defineField({ name: "body", type: "localizedBlockContent" }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "newsCategory" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      type: "imageWithAlt",
      validation: (r) => r.required(),
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: {
    select: { title: "title.en", subtitle: "publishedAt", media: "image" },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle ? new Date(subtitle).toLocaleDateString() : "Draft",
      media,
    }),
  },
});
export const job = defineType({
  name: "job",
  title: "Job",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "localizedString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title.en" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "department", type: "localizedString" }),
    defineField({ name: "employmentType", type: "localizedString" }),
    defineField({ name: "description", type: "localizedText" }),
    defineField({ name: "responsibilities", type: "localizedBlockContent" }),
    defineField({ name: "requirements", type: "localizedBlockContent" }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "expiresAt", type: "datetime" }),
    defineField({ name: "active", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "title.en", subtitle: "department.en" } },
});
