import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import type { QueryParams } from "next-sanity";
import { client } from "./client";

/**
 * Cached GROQ fetch. Every query must declare the tags it depends on so the
 * Sanity webhook (app/api/revalidate) can invalidate it: the document type,
 * plus `<type>:<slug>` for single-document queries.
 */
export async function sanityFetch<const Query extends string>({
  query,
  params = {},
  tags,
}: {
  query: Query;
  params?: QueryParams;
  tags: string[];
}) {
  "use cache";
  cacheLife("max");
  cacheTag(...tags);
  return client.fetch(query, params, { useCdn: false });
}
