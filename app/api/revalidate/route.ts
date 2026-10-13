import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type WebhookPayload = { _type?: string; slug?: string | null };

/**
 * Target of the Sanity GROQ webhook (create/update/delete).
 * Projection configured in Sanity: {_type, "slug": slug.current}
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return new NextResponse("Missing SANITY_REVALIDATE_SECRET", { status: 500 });
  }

  const { isValidSignature, body } = await parseBody<WebhookPayload>(req, secret);
  if (!isValidSignature) {
    return new NextResponse("Invalid signature", { status: 401 });
  }
  if (!body?._type) {
    return new NextResponse("Bad request", { status: 400 });
  }

  const tags = [body._type];
  if (body.slug) tags.push(`${body._type}:${body.slug}`);
  for (const tag of tags) revalidateTag(tag, "max");

  return NextResponse.json({ revalidated: tags, now: Date.now() });
}
