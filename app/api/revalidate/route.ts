import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

const allowedTypes = new Set([
  "siteSettings",
  "homePage",
  "aboutPage",
  "brandsPage",
  "franchisePage",
  "careersPage",
  "contactPage",
  "applicationPage",
  "newsPage",
  "brand",
  "division",
  "branch",
  "teamMember",
  "newsArticle",
  "newsCategory",
  "job",
]);

type WebhookBody = { _type?: string };

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret)
    return NextResponse.json(
      { error: "REVALIDATION_NOT_CONFIGURED" },
      { status: 503 },
    );

  const { isValidSignature, body } = await parseBody<WebhookBody>(
    request,
    secret,
    true,
  );
  if (!isValidSignature)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!body?._type || !allowedTypes.has(body._type))
    return NextResponse.json({ error: "INVALID_EVENT" }, { status: 400 });

  revalidateTag(`sanity:${body._type}`, "max");
  if (body._type === "newsCategory")
    revalidateTag("sanity:newsArticle", "max");
  revalidatePath("/ar", "layout");
  revalidatePath("/en", "layout");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
