import { sanityWriteClient } from "./sanity/client";
import { assertPrivateSubmissionStorage } from "./submissions";

const submissionTypes = [
  "contactSubmission",
  "franchiseSubmission",
  "jobApplication",
];

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
  "turnstileToken",
  "website",
  "idempotencyKey",
];

type ExpiredSubmission = {
  _id: string;
  assetId?: string;
};

export async function purgeExpiredData(limit = 50) {
  await assertPrivateSubmissionStorage();
  if (!sanityWriteClient) throw new Error("SANITY_NOT_CONFIGURED");

  const now = new Date().toISOString();
  const expired = await sanityWriteClient.fetch<ExpiredSubmission[]>(
    `*[_type in $types && retentionUntil <= $now][0...$limit]{
      _id,
      "assetId": coalesce(pendingAssetDeletion, cv.asset._ref)
    }`,
    { types: submissionTypes, now, limit },
    { cache: "no-store", perspective: "published" },
  );

  let purgedSubmissions = 0;
  let failedSubmissions = 0;
  for (const document of expired) {
    try {
      const values: Record<string, unknown> = {
        status: "closed",
        anonymizedAt: now,
      };
      if (document.assetId) values.pendingAssetDeletion = document.assetId;
      await sanityWriteClient
        .patch(document._id)
        .unset(personalFields)
        .set(values)
        .unset(["retentionError"])
        .commit();
      if (document.assetId) await sanityWriteClient.delete(document.assetId);
      await sanityWriteClient.delete(document._id);
      purgedSubmissions++;
    } catch {
      failedSubmissions++;
      await sanityWriteClient
        .patch(document._id)
        .set({ retentionError: "Cleanup failed; retry required." })
        .commit()
        .catch(() => undefined);
    }
  }

  const expiredBuckets = await sanityWriteClient.fetch<string[]>(
    `*[_type == "rateLimitBucket" && expiresAt <= $now][0...500]._id`,
    { now },
    { cache: "no-store", perspective: "published" },
  );
  if (expiredBuckets.length) {
    const transaction = sanityWriteClient.transaction();
    for (const id of expiredBuckets) transaction.delete(id);
    await transaction.commit();
  }

  return {
    purgedSubmissions,
    failedSubmissions,
    purgedRateLimitBuckets: expiredBuckets.length,
  };
}
