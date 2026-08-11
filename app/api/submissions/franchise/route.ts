import { NextRequest, NextResponse } from "next/server";
import { franchiseSchema } from "@/lib/validation";
import {
  createSubmission,
  requestKey,
  verifyTurnstile,
} from "@/lib/submissions";
import { rateLimit } from "@/lib/rate-limit";
import { sanityClient } from "@/lib/sanity/client";

type ConfiguredField = {
  key: string;
  type: "text" | "email" | "tel" | "number" | "select" | "textarea";
  required?: boolean;
};

const systemFields = new Set([
  "name",
  "email",
  "phone",
  "city",
  "investment",
  "brand",
  "message",
]);

export async function POST(request: NextRequest) {
  try {
    if (!(await rateLimit(`franchise:${requestKey(request)}`)))
      return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
    const form = await request.formData();
    const parsed = franchiseSchema.safeParse(Object.fromEntries(form));
    if (!parsed.success)
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    const configuredFields = sanityClient
      ? await sanityClient.fetch<ConfiguredField[]>(
          `*[_id == "franchisePage"][0].formFields[]{key,type,required}`,
          {},
          { cache: "no-store" },
        )
      : [];
    const customFields: Array<{
      _key: string;
      key: string;
      value: string;
    }> = [];
    for (const field of (configuredFields || []).slice(0, 20)) {
      if (
        systemFields.has(field.key) ||
        !/^[a-z][a-z0-9_]*$/.test(field.key)
      )
        continue;
      const rawValue = form.get(`custom__${field.key}`);
      const value = typeof rawValue === "string" ? rawValue.trim() : "";
      const maxLength = field.type === "textarea" ? 5000 : 500;
      const invalidType =
        (field.type === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) ||
        (field.type === "number" &&
          value &&
          !Number.isFinite(Number(value))) ||
        (field.type === "tel" && value && value.length < 7);
      if ((field.required && !value) || value.length > maxLength || invalidType)
        return NextResponse.json(
          { error: "INVALID_INPUT" },
          { status: 400 },
        );
      if (value)
        customFields.push({
          _key: field.key,
          key: field.key,
          value,
        });
    }
    if (
      !(await verifyTurnstile(
        parsed.data.turnstileToken,
        request,
        "submission-franchise",
      ))
    )
      return NextResponse.json(
        { error: "BOT_CHECK_FAILED" },
        { status: 400 },
      );
    const doc = await createSubmission(
      "franchiseSubmission",
      { ...parsed.data, customFields },
      "Franchise enquiry",
    );
    return NextResponse.json({ ok: true, id: doc._id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503 });
  }
}
