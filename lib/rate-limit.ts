import { createHash } from "node:crypto";
import { sanityWriteClient } from "./sanity/client";
import { assertPrivateSubmissionStorage } from "./submissions";

type RateLimitBucket = {
  count?: number;
};

export async function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000,
) {
  await assertPrivateSubmissionStorage();
  if (!sanityWriteClient) return false;

  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const keyHash = createHash("sha256").update(key).digest("hex");
  const bucketId = `rateLimit.${keyHash}.${windowStart}`;
  const documents = await sanityWriteClient
    .transaction()
    .createIfNotExists({
      _id: bucketId,
      _type: "rateLimitBucket",
      count: 0,
      expiresAt: new Date(windowStart + windowMs * 2).toISOString(),
    })
    .patch(bucketId, (patch) => patch.inc({ count: 1 }))
    .commit({ returnDocuments: true, returnFirst: false });
  const bucket = documents.at(-1) as RateLimitBucket | undefined;

  return typeof bucket?.count === "number" && bucket.count <= limit;
}
