"use client";
import Script from "next/script";
export function Turnstile({ action }: { action: string }) {
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!key) return null;
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <div
        className="cf-turnstile"
        data-sitekey={key}
        data-action={action}
      />
    </>
  );
}
