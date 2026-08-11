import { defineLive } from "next-sanity/live";
import { sanityClient } from "./client";

const live = sanityClient
  ? defineLive({
      client: sanityClient,
      serverToken: process.env.SANITY_API_READ_TOKEN,
      browserToken: false,
    })
  : null;

export async function liveFetch<T>({
  query,
  params,
  tags,
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
}): Promise<T> {
  if (!live) throw new Error("Sanity is not configured.");
  const result = await live.sanityFetch({ query, params, tags });
  return result.data as T;
}

export function SanityLive() {
  if (!live) return null;
  const LiveComponent = live.SanityLive;
  return <LiveComponent />;
}
