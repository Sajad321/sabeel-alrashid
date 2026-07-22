import { NextRequest, NextResponse } from "next/server";
import { jobSchema } from "@/lib/validation";
import {
  createSubmission,
  requestKey,
  verifyTurnstile,
} from "@/lib/submissions";
import { rateLimit } from "@/lib/rate-limit";
import { sanityWriteClient } from "@/lib/sanity/client";
const MAX = 5 * 1024 * 1024;
const allowed = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
export async function POST(request: NextRequest) {
  if (!rateLimit(`job:${requestKey(request)}`, 3))
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
  const form = await request.formData();
  const file = form.get("cv");
  const values = Object.fromEntries(
    Array.from(form.entries()).filter(([key]) => key !== "cv"),
  );
  const parsed = jobSchema.safeParse(values);
  if (
    !parsed.success ||
    !(file instanceof File) ||
    file.size > MAX ||
    !allowed.has(file.type)
  )
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  if (!(await verifyTurnstile(parsed.data.turnstileToken, request)))
    return NextResponse.json({ error: "BOT_CHECK_FAILED" }, { status: 400 });
  if (!sanityWriteClient)
    return NextResponse.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503 });
  try {
    const asset = await sanityWriteClient.assets.upload(
      "file",
      Buffer.from(await file.arrayBuffer()),
      { filename: file.name.replace(/[^a-zA-Z0-9._-]/g, "-") },
    );
    const doc = await createSubmission(
      "jobApplication",
      {
        ...parsed.data,
        cv: { _type: "file", asset: { _type: "reference", _ref: asset._id } },
      },
      `Job application — ${parsed.data.job}`,
    );
    return NextResponse.json({ ok: true, id: doc._id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503 });
  }
}
