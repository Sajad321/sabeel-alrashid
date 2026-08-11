"use client";

import { useState } from "react";
import type { DocumentActionComponent } from "sanity";
import { useClient } from "sanity";

const personalFields = [
  "name",
  "email",
  "phone",
  "subject",
  "message",
  "city",
  "investment",
  "brand",
  "customFields",
  "job",
  "birthDate",
  "gender",
  "maritalStatus",
  "address",
  "preferredBrand",
  "startDate",
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
        const values: Record<string, unknown> = {
          status: "closed",
          internalNotes: "Personal data removed under the retention policy.",
        };
        if (assetId) values.pendingAssetDeletion = assetId;
        await client
          .patch(id)
          .unset(personalFields)
          .set(values)
          .unset(["retentionError"])
          .commit();
        if (assetId) await client.delete(assetId);
        await client
          .patch(id)
          .set({ anonymizedAt: new Date().toISOString() })
          .unset(["pendingAssetDeletion", "retentionError"])
          .commit();
        onComplete();
      } catch {
        await client
          .patch(id)
          .set({ retentionError: "Cleanup failed; retry required." })
          .commit()
          .catch(() => undefined);
        window.alert(
          "Personal fields were removed, but file cleanup failed. The retention job will retry.",
        );
      } finally {
        setWorking(false);
      }
    },
  };
};
