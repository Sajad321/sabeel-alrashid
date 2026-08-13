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
export const pageHero = defineType({
  name: "pageHero",
  title: "Page hero",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", type: "localizedString" }),
    defineField({ name: "title", type: "localizedString" }),
    defineField({ name: "description", type: "localizedText" }),
    defineField({ name: "image", type: "imageWithAlt" }),
  ],
  preview: { select: { title: "title.en", subtitle: "eyebrow.en", media: "image" } },
});
export const contentBlock = defineType({
  name: "contentBlock",
  title: "Content block",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "localizedString" }),
    defineField({ name: "body", type: "localizedText" }),
    defineField({ name: "image", type: "imageWithAlt" }),
  ],
  preview: { select: { title: "heading.en", subtitle: "heading.ar", media: "image" } },
});
export const featureItem = defineType({
  name: "featureItem",
  title: "Feature",
  type: "object",
  fields: [
    defineField({ name: "icon", type: "string" }),
    defineField({ name: "title", type: "localizedString" }),
    defineField({ name: "description", type: "localizedText" }),
  ],
  preview: { select: { title: "title.en", subtitle: "title.ar" } },
});
export const timelineItem = defineType({
  name: "timelineItem",
  title: "Timeline item",
  type: "object",
  fields: [
    defineField({
      name: "year",
      title: "Year / السنة",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Milestone title / عنوان الحدث",
      type: "localizedString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description / الوصف",
      type: "localizedText",
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "title.en", subtitle: "year" } },
});
export const formFieldDefinition = defineType({
  name: "formFieldDefinition",
  title: "Form field",
  type: "object",
  fields: [
    defineField({
      name: "key",
      title: "Field key / رمز الحقل",
      description:
        "Use English letters, numbers and underscores only. Existing keys connect to their saved submission fields.",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .regex(/^[a-z][a-z0-9_]*$/, {
            name: "a lowercase key such as company_name",
          }),
    }),
    defineField({
      name: "label",
      title: "Label / عنوان الحقل",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Field type / نوع الحقل",
      type: "string",
      options: {
        list: [
          { title: "Short text", value: "text" },
          { title: "Email", value: "email" },
          { title: "Phone", value: "tel" },
          { title: "Number", value: "number" },
          { title: "Dropdown", value: "select" },
          { title: "Long text", value: "textarea" },
        ],
        layout: "dropdown",
      },
      initialValue: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "placeholder",
      title: "Placeholder / النص التوضيحي",
      type: "localizedString",
    }),
    defineField({
      name: "options",
      title: "Dropdown options / خيارات القائمة",
      type: "array",
      of: [defineArrayMember({ type: "localizedString" })],
      hidden: ({ parent }) => parent?.type !== "select",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string } | undefined;
          return parent?.type !== "select" || (value?.length || 0) > 0
            ? true
            : "Add at least one dropdown option.";
        }),
    }),
    defineField({
      name: "required",
      title: "Required / إلزامي",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "fullWidth",
      title: "Full width / عرض كامل",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "label.en", subtitle: "key" },
  },
});
export const jobFormFieldDefinition = defineType({
  name: "jobFormFieldDefinition",
  title: "Job application field",
  type: "object",
  fields: [
    defineField({
      name: "key",
      title: "Field key / رمز الحقل",
      description:
        "Keep existing keys unchanged to preserve their dedicated submission fields. Custom keys use lowercase English letters, numbers and underscores.",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .regex(/^[a-z][a-zA-Z0-9_]*$/, {
            name: "a key such as portfolio_url",
          }),
    }),
    defineField({
      name: "label",
      title: "Label / عنوان الحقل",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Field type / نوع الحقل",
      type: "string",
      options: {
        list: [
          { title: "Section heading", value: "section" },
          { title: "Short text", value: "text" },
          { title: "Email", value: "email" },
          { title: "Phone", value: "tel" },
          { title: "Number", value: "number" },
          { title: "Date", value: "date" },
          { title: "Website URL", value: "url" },
          { title: "Dropdown", value: "select" },
          { title: "Published jobs dropdown", value: "jobSelect" },
          { title: "Long text", value: "textarea" },
          { title: "CV file (PDF, DOC, DOCX)", value: "file" },
        ],
        layout: "dropdown",
      },
      initialValue: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "placeholder",
      title: "Placeholder / النص التوضيحي",
      type: "localizedString",
      hidden: ({ parent }) =>
        ["section", "select", "jobSelect", "file"].includes(parent?.type),
    }),
    defineField({
      name: "options",
      title: "Dropdown options / خيارات القائمة",
      type: "array",
      of: [defineArrayMember({ type: "localizedString" })],
      hidden: ({ parent }) => parent?.type !== "select",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string } | undefined;
          return parent?.type !== "select" || (value?.length || 0) > 0
            ? true
            : "Add at least one dropdown option.";
        }),
    }),
    defineField({
      name: "required",
      title: "Required / إلزامي",
      type: "boolean",
      initialValue: false,
      hidden: ({ parent }) => parent?.type === "section",
    }),
    defineField({
      name: "fullWidth",
      title: "Full width / عرض كامل",
      type: "boolean",
      initialValue: false,
      hidden: ({ parent }) => parent?.type === "section",
    }),
  ],
  preview: {
    select: { title: "label.en", subtitle: "key" },
  },
});
