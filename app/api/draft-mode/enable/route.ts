import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { sanityClient } from "@/lib/sanity/client";

if (!sanityClient) {
  throw new Error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID is required to enable Sanity Draft Mode.",
  );
}

export const { GET } = defineEnableDraftMode({
  client: sanityClient.withConfig({
    token: process.env.SANITY_API_READ_TOKEN,
    useCdn: false,
  }),
});
