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
    defineField({ name: "cv", type: "file", readOnly: true }),
  ],
  preview: { select: { title: "name", subtitle: "job" } },
});
