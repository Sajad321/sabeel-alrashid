import { NextRequest, NextResponse } from "next/server";
import { purgeExpiredData } from "@/lib/retention";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret)
    return NextResponse.json(
      { error: "RETENTION_NOT_CONFIGURED" },
      { status: 503 },
    );
  if (request.headers.get("authorization") !== `Bearer ${secret}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    return NextResponse.json(await purgeExpiredData());
  } catch {
    return NextResponse.json({ error: "CLEANUP_FAILED" }, { status: 503 });
  }
}
