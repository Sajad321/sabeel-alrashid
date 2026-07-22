import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  if (
    request.headers.get("x-sanity-secret") !==
    process.env.SANITY_REVALIDATE_SECRET
  )
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as {
    _type?: string;
    slug?: string;
  };
  if (body._type) revalidateTag(`sanity:${body._type}`, "max");
  revalidatePath("/ar", "layout");
  revalidatePath("/en", "layout");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
