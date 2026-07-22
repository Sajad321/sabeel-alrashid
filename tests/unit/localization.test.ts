import { describe, expect, it } from "vitest";
import { localize } from "@/lib/types";
import { routing } from "@/i18n/routing";
describe("localization", () => {
  it("supports exactly the launch locales", () =>
    expect(routing.locales).toEqual(["ar", "en"]));
  it("resolves localized fields", () => {
    const value = { ar: "أهلاً", en: "Hello" };
    expect(localize(value, "ar")).toBe("أهلاً");
    expect(localize(value, "en")).toBe("Hello");
  });
});
