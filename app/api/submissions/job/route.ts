import { NextRequest, NextResponse } from "next/server";
import { jobSchema } from "@/lib/validation";
import {
  createSubmission,
  requestKey,
  verifyTurnstile,
} from "@/lib/submissions";
import { rateLimit } from "@/lib/rate-limit";
import { sanityWriteClient } from "@/lib/sanity/client";
import { scanCvBuffer, validatedCvBuffer } from "@/lib/file-validation";
// Vercel Functions reject request bodies above 4.5 MB, so leave room for
// multipart form overhead.
const MAX = 4 * 1024 * 1024;
export async function POST(request: NextRequest) {
  let uploadedAssetId: string | undefined;
  try {
    if (!(await rateLimit(`job:${requestKey(request)}`, 3)))
      return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
    const form = await request.formData();
    const file = form.get("cv");
    const values = Object.fromEntries(
      Array.from(form.entries()).filter(([key]) => key !== "cv"),
    );
    const parsed = jobSchema.safeParse(values);
    if (!parsed.success || !(file instanceof File))
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    if (
      !(await verifyTurnstile(
        parsed.data.turnstileToken,
        request,
        "submission-job",
      ))
    )
      return NextResponse.json({ error: "BOT_CHECK_FAILED" }, { status: 400 });
    const buffer = await validatedCvBuffer(file, MAX);
    if (!buffer)
      return NextResponse.json({ error: "INVALID_FILE" }, { status: 400 });
    if (!(await scanCvBuffer(file, buffer)))
      return NextResponse.json({ error: "FILE_SCAN_FAILED" }, { status: 503 });
    if (!sanityWriteClient)
      return NextResponse.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503 });
    const asset = await sanityWriteClient.assets.upload(
      "file",
      buffer,
      { filename: file.name.replace(/[^a-zA-Z0-9._-]/g, "-") },
    );
    uploadedAssetId = asset._id;
    const doc = await createSubmission(
      "jobApplication",
      {
        ...parsed.data,
        cv: { _type: "file", asset: { _type: "reference", _ref: asset._id } },
      },
      `Job application — ${parsed.data.job}`,
    );
    const persistedAssetId = (
      doc as typeof doc & { cv?: { asset?: { _ref?: string } } }
    ).cv?.asset?._ref;
    if (persistedAssetId !== uploadedAssetId)
      await sanityWriteClient.delete(uploadedAssetId).catch(() => undefined);
    uploadedAssetId = undefined;
    return NextResponse.json({ ok: true, id: doc._id }, { status: 201 });
  } catch {
    if (uploadedAssetId && sanityWriteClient)
      await sanityWriteClient.delete(uploadedAssetId).catch(() => undefined);
    return NextResponse.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503 });
  }
}
