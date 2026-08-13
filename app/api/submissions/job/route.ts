import { NextRequest, NextResponse } from "next/server";
import { jobSchema } from "@/lib/validation";
import {
  createSubmission,
  requestKey,
  verifyTurnstile,
} from "@/lib/submissions";
import { rateLimit } from "@/lib/rate-limit";
import { sanityWriteClient } from "@/lib/sanity/client";
import { sanityClient } from "@/lib/sanity/client";
import { scanCvBuffer, validatedCvBuffer } from "@/lib/file-validation";
import { DEFAULT_JOB_FORM_FIELDS } from "@/lib/job-form-config";
import { validateJobFormAnswers } from "@/lib/job-form-validation";
import type { JobFormField } from "@/lib/types";
import { getJobs } from "@/lib/sanity/data";
// Vercel Functions reject request bodies above 4.5 MB, so leave room for
// multipart form overhead.
const MAX = 4 * 1024 * 1024;
export async function POST(request: NextRequest) {
  let uploadedAssetId: string | undefined;
  try {
    if (!(await rateLimit(`job:${requestKey(request)}`, 3)))
      return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
    const form = await request.formData();
    const values = Object.fromEntries(
      Array.from(form.entries()).filter(([, value]) => typeof value === "string"),
    );
    const parsed = jobSchema.safeParse(values);
    if (!parsed.success)
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    const [configuredFields, activeJobs] = await Promise.all([
      sanityClient
        ? sanityClient.withConfig({ useCdn: false }).fetch<JobFormField[] | null>(
            `*[_id == "applicationPage"][0].jobFormFields[]{key,label,type,placeholder,options,required,fullWidth}`,
            {},
            { cache: "no-store", perspective: "published" },
          )
        : null,
      getJobs(),
    ]);
    const jobFields = configuredFields ?? DEFAULT_JOB_FORM_FIELDS;
    const answers = validateJobFormAnswers(form, jobFields);
    if (!answers)
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    if (!activeJobs.some((job) => job.slug === answers.systemData.job))
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    if (
      !(await verifyTurnstile(
        parsed.data.turnstileToken,
        request,
        "submission-job",
      ))
    )
      return NextResponse.json({ error: "BOT_CHECK_FAILED" }, { status: 400 });
    const cvField = jobFields.find(
      (field) => field.key === "cv" && field.type === "file",
    );
    const fileValue = form.get("cv");
    const file =
      fileValue instanceof File && fileValue.size > 0 ? fileValue : undefined;
    if (cvField?.required && !file)
      return NextResponse.json({ error: "INVALID_FILE" }, { status: 400 });

    let cvData: Record<string, unknown> = {};
    if (cvField && file) {
      const buffer = await validatedCvBuffer(file, MAX);
      if (!buffer)
        return NextResponse.json({ error: "INVALID_FILE" }, { status: 400 });
      const cvScanStatus = await scanCvBuffer(file, buffer);
      if (cvScanStatus === "rejected")
        return NextResponse.json({ error: "FILE_SCAN_FAILED" }, { status: 503 });
      if (!sanityWriteClient)
        return NextResponse.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503 });
      const asset = await sanityWriteClient.assets.upload("file", buffer, {
        filename: file.name.replace(/[^a-zA-Z0-9._-]/g, "-"),
      });
      uploadedAssetId = asset._id;
      cvData = {
        cvScanStatus,
        cv: { _type: "file", asset: { _type: "reference", _ref: asset._id } },
      };
    }
    const doc = await createSubmission(
      "jobApplication",
      {
        ...parsed.data,
        ...answers.systemData,
        customFields: answers.customFields,
        ...cvData,
      },
      `Job application — ${answers.systemData.job || "General"}`,
    );
    const persistedAssetId = (
      doc as typeof doc & { cv?: { asset?: { _ref?: string } } }
    ).cv?.asset?._ref;
    if (
      uploadedAssetId &&
      sanityWriteClient &&
      persistedAssetId !== uploadedAssetId
    )
      await sanityWriteClient.delete(uploadedAssetId).catch(() => undefined);
    uploadedAssetId = undefined;
    return NextResponse.json({ ok: true, id: doc._id }, { status: 201 });
  } catch {
    if (uploadedAssetId && sanityWriteClient)
      await sanityWriteClient.delete(uploadedAssetId).catch(() => undefined);
    return NextResponse.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503 });
  }
}
