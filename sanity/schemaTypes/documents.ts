import { defineArrayMember, defineField, defineType } from "sanity";

const simplePage = (name: string, title: string, extraFields: ReturnType<typeof defineField>[] = []) =>
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
      defineField({ name: "hero", type: "pageHero" }),
      ...extraFields,
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
    defineField({ name: "secondaryPhone", type: "string" }),
    defineField({ name: "workingHours", type: "localizedString" }),
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
      title: "Homepage carousel slides / صور العرض الرئيسية",
      description:
        "Upload, replace, add, remove, or drag slides to reorder the homepage carousel.",
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
    defineField({ name: "introduction", type: "contentBlock" }),
    defineField({
      name: "introductionFacts",
      type: "array",
      of: [defineArrayMember({ type: "stat" })],
    }),
    defineField({
      name: "statistics",
      type: "array",
      of: [defineArrayMember({ type: "stat" })],
    }),
    defineField({ name: "divisionsHeading", type: "localizedString" }),
    defineField({ name: "brandsHeading", type: "localizedString" }),
    defineField({ name: "branchesHeading", type: "localizedString" }),
    defineField({ name: "branchesDescription", type: "localizedText" }),
    defineField({ name: "newsHeading", type: "localizedString" }),
    defineField({ name: "brandFocusHeading", type: "localizedString" }),
    defineField({ name: "sustainability", type: "contentBlock" }),
    defineField({
      name: "sustainabilityFacts",
      type: "array",
      of: [defineArrayMember({ type: "stat" })],
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
});
export const aboutPage = simplePage("aboutPage", "About page", [
  defineField({
    name: "introduction",
    title: "Introduction / المقدمة",
    type: "contentBlock",
  }),
  defineField({
    name: "statistics",
    title: "Company statistics / إحصائيات الشركة",
    type: "array",
    of: [defineArrayMember({ type: "stat" })],
  }),
  defineField({
    name: "historyHeading",
    title: "History heading / عنوان قصة الشركة",
    type: "localizedString",
  }),
  defineField({
    name: "timeline",
    title: "Company history timeline / التسلسل الزمني",
    description:
      "Add, edit, delete, or drag items to reorder the company milestones.",
    type: "array",
    of: [defineArrayMember({ type: "timelineItem" })],
    validation: (rule) => rule.min(1),
  }),
  defineField({
    name: "vision",
    title: "Vision / الرؤية",
    type: "contentBlock",
  }),
  defineField({
    name: "mission",
    title: "Mission / الرسالة",
    type: "contentBlock",
  }),
  defineField({
    name: "teamHeading",
    title: "Team heading / عنوان الفريق",
    type: "localizedString",
  }),
]);
export const brandsPage = simplePage("brandsPage", "Brands page");
export const franchisePage = simplePage("franchisePage", "Franchise page", [
  defineField({ name: "featuresHeading", type: "localizedString" }),
  defineField({ name: "features", type: "array", of: [defineArrayMember({ type: "featureItem" })] }),
  defineField({ name: "formHeading", type: "localizedString" }),
  defineField({ name: "formDescription", type: "localizedText" }),
  defineField({
    name: "formFields",
    title: "Franchise form fields / حقول طلب الامتياز",
    description:
      "Edit labels and dropdown options, reorder fields, or add custom questions. Name, email, phone and city always remain required.",
    type: "array",
    of: [defineArrayMember({ type: "formFieldDefinition" })],
    validation: (rule) =>
      rule.max(20).custom((fields) => {
        const keys = ((fields || []) as Array<{ key?: string }>)
          .map((field) => field.key)
          .filter(Boolean);
        return new Set(keys).size === keys.length
          ? true
          : "Each form field key must be unique.";
      }),
  }),
]);
export const careersPage = simplePage("careersPage", "Careers page", [
  defineField({ name: "culture", type: "contentBlock" }),
  defineField({ name: "cultureValues", type: "array", of: [defineArrayMember({ type: "localizedString" })] }),
  defineField({ name: "benefitsHeading", type: "localizedString" }),
  defineField({ name: "benefits", type: "array", of: [defineArrayMember({ type: "featureItem" })] }),
  defineField({ name: "positionsHeading", type: "localizedString" }),
  defineField({ name: "callToAction", type: "contentBlock" }),
  defineField({ name: "callToActionLabel", type: "localizedString" }),
]);
export const contactPage = simplePage("contactPage", "Contact page", [
  defineField({ name: "formHeading", type: "localizedString" }),
  defineField({ name: "formDescription", type: "localizedText" }),
]);
export const applicationPage = simplePage("applicationPage", "Application page", [
  defineField({
    name: "jobFormFields",
    title: "Job application fields / حقول طلب التوظيف",
    description:
      "Add, remove, edit, and drag fields to reorder them. Remove the field with key 'cv' if applicants should not upload a CV. Keep at least one contact field and the job field.",
    type: "array",
    of: [defineArrayMember({ type: "jobFormFieldDefinition" })],
    validation: (rule) =>
      rule.max(30).custom((fields) => {
        const entries = (fields || []) as Array<{
          key?: string;
          type?: string;
        }>;
        const keys = entries.map((field) => field.key).filter(Boolean);
        if (new Set(keys).size !== keys.length)
          return "Each job form field key must be unique.";
        if (entries.some((field) => field.type === "file" && field.key !== "cv"))
          return "The CV file field must use the key 'cv'.";
        if (entries.some((field) => field.key === "cv" && field.type !== "file"))
          return "The field with key 'cv' must use the CV file type.";
        if (entries.some((field) => field.type === "jobSelect" && field.key !== "job"))
          return "The published jobs dropdown must use the key 'job'.";
        if (entries.some((field) => field.key === "job" && field.type !== "jobSelect"))
          return "The field with key 'job' must use the published jobs dropdown type.";
        const inputKeys = entries
          .filter((field) => field.type !== "section")
          .map((field) => field.key);
        if (!inputKeys.includes("job"))
          return "Keep the field with key 'job' so applications stay connected to a vacancy.";
        if (!inputKeys.some((key) => ["name", "email", "phone"].includes(key || "")))
          return "Keep at least one contact field: name, email, or phone.";
        return true;
      }),
  }),
]);
export const newsPage = simplePage("newsPage", "News page");
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
    defineField({
      name: "image",
      type: "imageWithAlt",
      validation: (r) => r.required(),
    }),
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
    defineField({
      name: "image",
      type: "imageWithAlt",
      validation: (r) => r.required(),
    }),
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
    defineField({ name: "order", type: "number" }),
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
    defineField({
      name: "photo",
      type: "imageWithAlt",
      validation: (r) => r.required(),
    }),
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
