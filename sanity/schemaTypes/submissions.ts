import { defineField, defineType } from "sanity";
const common = [
  defineField({ name: "name", type: "string", readOnly: true }),
  defineField({ name: "email", type: "string", readOnly: true }),
  defineField({ name: "phone", type: "string", readOnly: true }),
  defineField({ name: "submittedAt", type: "datetime", readOnly: true }),
  defineField({
    name: "notificationStatus",
    type: "string",
    readOnly: true,
    options: { list: ["pending", "sent", "failed", "disabled"] },
  }),
  defineField({
    name: "status",
    type: "string",
    options: { list: ["new", "inProgress", "closed"] },
    initialValue: "new",
  }),
  defineField({ name: "retentionUntil", type: "datetime", readOnly: true }),
  defineField({ name: "anonymizedAt", type: "datetime", readOnly: true }),
  defineField({ name: "pendingAssetDeletion", type: "string", readOnly: true, hidden: true }),
  defineField({ name: "retentionError", type: "string", readOnly: true }),
  defineField({ name: "internalNotes", type: "text" }),
];
export const contactSubmission = defineType({
  name: "contactSubmission",
  title: "Contact submission",
  type: "document",
  fields: [
    ...common,
    defineField({ name: "subject", type: "string", readOnly: true }),
    defineField({ name: "message", type: "text", readOnly: true }),
  ],
  preview: { select: { title: "name", subtitle: "email" } },
});
export const franchiseSubmission = defineType({
  name: "franchiseSubmission",
  title: "Franchise submission",
  type: "document",
  fields: [
    ...common,
    defineField({ name: "city", type: "string", readOnly: true }),
    defineField({ name: "investment", type: "string", readOnly: true }),
    defineField({ name: "brand", type: "string", readOnly: true }),
    defineField({ name: "message", type: "text", readOnly: true }),
    defineField({
      name: "customFields",
      title: "Additional answers",
      type: "array",
      readOnly: true,
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "key", type: "string", readOnly: true }),
            defineField({ name: "value", type: "text", readOnly: true }),
          ],
          preview: { select: { title: "key", subtitle: "value" } },
        },
      ],
    }),
  ],
  preview: { select: { title: "name", subtitle: "city" } },
});
export const jobApplication = defineType({
  name: "jobApplication",
  title: "Job application",
  type: "document",
  fields: [
    ...common,
    defineField({ name: "job", type: "string", readOnly: true }),
    defineField({ name: "birthDate", type: "date", readOnly: true }),
    defineField({ name: "gender", type: "string", readOnly: true }),
    defineField({ name: "maritalStatus", type: "string", readOnly: true }),
    defineField({ name: "address", type: "string", readOnly: true }),
    defineField({ name: "preferredBrand", type: "string", readOnly: true }),
    defineField({ name: "startDate", type: "date", readOnly: true }),
    defineField({ name: "salary", type: "string", readOnly: true }),
    defineField({ name: "education", type: "string", readOnly: true }),
    defineField({ name: "experience", type: "string", readOnly: true }),
    defineField({ name: "employer", type: "string", readOnly: true }),
    defineField({ name: "note", type: "text", readOnly: true }),
    defineField({
      name: "customFields",
      title: "Additional answers",
      type: "array",
      readOnly: true,
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "key", type: "string", readOnly: true }),
            defineField({ name: "value", type: "text", readOnly: true }),
          ],
          preview: { select: { title: "key", subtitle: "value" } },
        },
      ],
    }),
    defineField({
      name: "cvScanStatus",
      title: "CV scan status",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "Clean", value: "clean" },
          { title: "Not configured", value: "notConfigured" },
        ],
      },
    }),
    defineField({ name: "cv", type: "file", readOnly: true }),
  ],
  preview: { select: { title: "name", subtitle: "job" } },
});

export const rateLimitBucket = defineType({
  name: "rateLimitBucket",
  title: "Rate limit bucket",
  type: "document",
  hidden: true,
  fields: [
    defineField({ name: "count", type: "number", readOnly: true }),
    defineField({ name: "expiresAt", type: "datetime", readOnly: true }),
  ],
});
