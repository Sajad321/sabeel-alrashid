"use client";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { schemaTypes } from "@/sanity/schemaTypes";
import { dataset, projectId } from "@/lib/sanity/env";
import { AnonymizeSubmissionAction } from "@/sanity/submission-actions";

export default defineConfig({
  name: "default",
  title: "Sabeel Al-Rashid",
  projectId: projectId || "missing-project-id",
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Website")
              .child(
                S.list()
                  .title("Website")
                  .items([
                    singleton(S, "Site settings", "siteSettings"),
                    singleton(S, "Home page", "homePage"),
                    ...(
                      [
                        "aboutPage",
                        "brandsPage",
                        "franchisePage",
                        "careersPage",
                        "contactPage",
                        "applicationPage",
                        "newsPage",
                      ] as const
                    ).map((type) =>
                      singleton(S, type.replace("Page", " page"), type),
                    ),
                  ]),
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) =>
                ![
                  "siteSettings",
                  "homePage",
                  "aboutPage",
                  "brandsPage",
                  "franchisePage",
                  "careersPage",
                  "contactPage",
                  "applicationPage",
                  "newsPage",
                ].includes(item.getId() || ""),
            ),
          ]),
    }),
    presentationTool({
      previewUrl: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        previewMode: { enable: "/api/draft-mode/enable" },
      },
    }),
  ],
  document: {
    actions: (previous, context) =>
      ["contactSubmission", "franchiseSubmission", "jobApplication"].includes(
        context.schemaType,
      )
        ? [...previous, AnonymizeSubmissionAction]
        : previous,
  },
  schema: { types: schemaTypes },
});
function singleton(S: any, title: string, type: string) {
  return S.listItem()
    .title(title)
    .id(type)
    .child(S.document().schemaType(type).documentId(type));
}
