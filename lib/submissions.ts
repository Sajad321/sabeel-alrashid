import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { sanityWriteClient } from "./sanity/client";
import { notificationTransport } from "./notifications";
import { getSiteSettings } from "./sanity/data";

const DATASET_VISIBILITY_TTL = 5 * 60_000;
let datasetVisibilityCache:
  | { checkedAt: number; isPrivate: boolean }
  | undefined;

export function requestKey(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  return createHash("sha256").update(ip).digest("hex");
}
export async function verifyTurnstile(
  token: string | undefined,
  request: NextRequest,
  expectedAction: string,
) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;
  if (!token) return false;
  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: request.headers.get("x-forwarded-for")?.split(",")[0] || "",
  });
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body, cache: "no-store" },
    );
    const result = (await response.json()) as {
      success?: boolean;
      hostname?: string;
      action?: string;
    };
    const expectedHostname = request.nextUrl.hostname;
    return (
      result.success === true &&
      result.hostname === expectedHostname &&
      result.action === expectedAction
    );
  } catch {
    return false;
  }
}

export async function assertPrivateSubmissionStorage() {
  if (!sanityWriteClient) throw new Error("SANITY_NOT_CONFIGURED");

  const now = Date.now();
  if (
    datasetVisibilityCache &&
    now - datasetVisibilityCache.checkedAt < DATASET_VISIBILITY_TTL
  ) {
    if (!datasetVisibilityCache.isPrivate)
      throw new Error("SANITY_DATASET_NOT_PRIVATE");
    return;
  }

  const configuredDataset = sanityWriteClient.config().dataset;
  const datasets = await sanityWriteClient.datasets.list();
  const current = datasets.find((item) => item.name === configuredDataset);
  const isPrivate = current?.aclMode === "private";
  datasetVisibilityCache = { checkedAt: now, isPrivate };

  if (!isPrivate) throw new Error("SANITY_DATASET_NOT_PRIVATE");
}
export async function createSubmission(
  type: "contactSubmission" | "franchiseSubmission" | "jobApplication",
  data: Record<string, unknown>,
  subject: string,
) {
  await assertPrivateSubmissionStorage();
  if (!sanityWriteClient) throw new Error("SANITY_NOT_CONFIGURED");
  const persistedData = { ...data };
  const idempotencyKey = persistedData.idempotencyKey;
  delete persistedData.idempotencyKey;
  delete persistedData.turnstileToken;
  delete persistedData.website;
  const document = await sanityWriteClient.createIfNotExists({
    _id: `submission.${String(idempotencyKey)}`,
    _type: type,
    ...persistedData,
    notificationStatus: notificationTransport ? "pending" : "disabled",
    submittedAt: new Date().toISOString(),
    retentionUntil: new Date(Date.now() + 365 * 86400000).toISOString(),
  });
  if (notificationTransport) {
    try {
      const settings = await getSiteSettings();
      await notificationTransport.send({
        type:
          type === "contactSubmission"
            ? "contact"
            : type === "franchiseSubmission"
              ? "franchise"
              : "job",
        submissionId: document._id,
        subject,
        summary: String(data.email || ""),
        recipient:
          type === "franchiseSubmission"
            ? settings.franchiseEmail
            : type === "jobApplication"
              ? settings.careersEmail
              : settings.email,
      });
      await sanityWriteClient
        .patch(document._id)
        .set({
          notificationStatus: "sent",
          notifiedAt: new Date().toISOString(),
        })
        .commit();
    } catch {
      await sanityWriteClient
        .patch(document._id)
        .set({ notificationStatus: "failed" })
        .commit();
    }
  }
  return document;
}
