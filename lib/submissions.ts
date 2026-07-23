import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { sanityWriteClient } from "./sanity/client";
import { notificationTransport } from "./notifications";
import { getSiteSettings } from "./sanity/data";

export function requestKey(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  return createHash("sha256").update(ip).digest("hex");
}
export async function verifyTurnstile(
  token: string | undefined,
  request: NextRequest,
) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: request.headers.get("x-forwarded-for")?.split(",")[0] || "",
  });
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body, cache: "no-store" },
  );
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}
export async function createSubmission(
  type: "contactSubmission" | "franchiseSubmission" | "jobApplication",
  data: Record<string, unknown>,
  subject: string,
) {
  if (!sanityWriteClient) throw new Error("SANITY_NOT_CONFIGURED");
  const document = await sanityWriteClient.createIfNotExists({
    _id: `submission.${String(data.idempotencyKey)}`,
    _type: type,
    ...data,
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
