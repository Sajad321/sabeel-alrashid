"use client";

import { useState } from "react";
import type { DocumentActionComponent } from "sanity";
import { useClient } from "sanity";

const personalFields = [
  "name",
  "email",
  "phone",
  "message",
  "city",
  "birthDate",
  "gender",
  "maritalStatus",
  "address",
  "salary",
  "education",
  "experience",
  "employer",
  "note",
  "cv",
];

export const AnonymizeSubmissionAction: DocumentActionComponent = ({
  id,
  draft,
  published,
  onComplete,
}) => {
  const client = useClient({ apiVersion: "2026-07-01" });
  const [working, setWorking] = useState(false);
  const document = draft || published;

  return {
    label: working ? "Anonymizing…" : "Anonymize personal data",
    tone: "caution",
    disabled: working || !document,
    onHandle: async () => {
      if (
        !window.confirm(
          "Remove personal data and the uploaded CV? This cannot be undone.",
        )
      )
        return;
      setWorking(true);
      try {
        const assetId = (
          document?.cv as
            | { asset?: { _ref?: string } }
            | undefined
        )?.asset?._ref;
        await client
          .patch(id)
          .unset(personalFields)
          .set({
            anonymizedAt: new Date().toISOString(),
            status: "closed",
            internalNotes: "Personal data removed under the retention policy.",
          })
          .commit();
        if (assetId) await client.delete(assetId).catch(() => undefined);
        onComplete();
      } finally {
        setWorking(false);
      }
    },
  };
};
