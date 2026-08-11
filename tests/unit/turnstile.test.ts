import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { verifyTurnstile } from "@/lib/submissions";

const originalSecret = process.env.TURNSTILE_SECRET_KEY;
const originalSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalSecret === undefined) delete process.env.TURNSTILE_SECRET_KEY;
  else process.env.TURNSTILE_SECRET_KEY = originalSecret;
  if (originalSiteKey === undefined)
    delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  else process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = originalSiteKey;
});

describe("Turnstile verification", () => {
  it("allows submissions when Turnstile is not configured", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    const request = new NextRequest("https://example.com/api/submissions/contact");
    expect(await verifyTurnstile(undefined, request, "submission-contact")).toBe(
      true,
    );
  });

  it("rejects a partial Turnstile configuration", async () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "test-site-key";
    delete process.env.TURNSTILE_SECRET_KEY;
    const request = new NextRequest("https://example.com/api/submissions/contact");
    expect(await verifyTurnstile("token", request, "submission-contact")).toBe(
      false,
    );
  });

  it("requires the expected hostname and action", async () => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "test-site-key";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => ({
          success: true,
          hostname: "example.com",
          action: "submission-contact",
        }),
      }),
    );
    const request = new NextRequest("https://example.com/api/submissions/contact");

    expect(await verifyTurnstile("token", request, "submission-contact")).toBe(
      true,
    );
    expect(await verifyTurnstile("token", request, "submission-job")).toBe(
      false,
    );
  });
});
