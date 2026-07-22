import { defineArrayMember, defineField, defineType } from "sanity";
export const localizedString = defineType({
  name: "localizedString",
  title: "Localized string",
  type: "object",
  fields: [
    defineField({
      name: "ar",
      title: "Arabic",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "en",
      title: "English",
      type: "string",
      validation: (r) => r.required(),
    }),
  ],
});
export const localizedText = defineType({
  name: "localizedText",
  title: "Localized text",
  type: "object",
  fields: [
    defineField({
      name: "ar",
      title: "Arabic",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "en",
      title: "English",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
  ],
});
export const localizedBlockContent = defineType({
  name: "localizedBlockContent",
  title: "Localized rich text",
  type: "object",
  fields: [
    defineField({
      name: "ar",
      title: "Arabic",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "en",
      title: "English",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
  ],
});
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "title", type: "localizedString" }),
    defineField({ name: "description", type: "localizedText" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "noIndex", type: "boolean", initialValue: false }),
  ],
});
export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      type: "localizedString",
      validation: (r) => r.required(),
    }),
  ],
});
export const stat = defineType({
  name: "stat",
  title: "Statistic",
  type: "object",
  fields: [
    defineField({
      name: "value",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "label",
      type: "localizedString",
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "value", subtitle: "label.en" } },
});
export const pageSection = defineType({
  name: "pageSection",
  title: "Page section",
  type: "object",
  fields: [
    defineField({
      name: "sectionType",
      type: "string",
      options: {
        list: [
          "hero",
          "introduction",
          "statistics",
          "divisions",
          "brands",
          "branches",
          "news",
          "sustainability",
          "content",
          "form",
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "heading", type: "localizedString" }),
    defineField({ name: "body", type: "localizedText" }),
    defineField({ name: "image", type: "imageWithAlt" }),
    defineField({ name: "enabled", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "heading.en", subtitle: "sectionType" } },
});
