import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { verifyTurnstile } from "@/lib/submissions";

const originalSecret = process.env.TURNSTILE_SECRET_KEY;

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalSecret === undefined) delete process.env.TURNSTILE_SECRET_KEY;
  else process.env.TURNSTILE_SECRET_KEY = originalSecret;
});

describe("Turnstile verification", () => {
  it("fails closed when the secret is missing", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    const request = new NextRequest("https://example.com/api/submissions/contact");
    expect(await verifyTurnstile("token", request, "submission-contact")).toBe(
      false,
    );
  });

  it("requires the expected hostname and action", async () => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
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
