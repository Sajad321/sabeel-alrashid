import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (
    process.env.SANITY_PREVIEW_SECRET &&
    secret !== process.env.SANITY_PREVIEW_SECRET
  )
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  (await draftMode()).enable();
  return NextResponse.redirect(
    new URL(request.nextUrl.searchParams.get("redirect") || "/ar", request.url),
  );
}
