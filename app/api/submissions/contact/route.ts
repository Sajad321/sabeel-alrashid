import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import {
  createSubmission,
  requestKey,
  verifyTurnstile,
} from "@/lib/submissions";
import { rateLimit } from "@/lib/rate-limit";
export async function POST(request: NextRequest) {
  try {
    if (!(await rateLimit(`contact:${requestKey(request)}`)))
      return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
    const form = await request.formData();
    const parsed = contactSchema.safeParse(Object.fromEntries(form));
    if (!parsed.success)
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    if (
      !(await verifyTurnstile(
        parsed.data.turnstileToken,
        request,
        "submission-contact",
      ))
    )
      return NextResponse.json({ error: "BOT_CHECK_FAILED" }, { status: 400 });
    const doc = await createSubmission(
      "contactSubmission",
      parsed.data,
      "Website contact enquiry",
    );
    return NextResponse.json({ ok: true, id: doc._id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "SERVICE_UNAVAILABLE" }, { status: 503 });
  }
}
