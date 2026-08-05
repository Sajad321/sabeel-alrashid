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
  it("handles optional and incomplete CMS translations", () => {
    expect(localize(null, "ar")).toBe("");
    expect(localize({ en: "Hello" }, "ar")).toBe("Hello");
    expect(localize({ ar: "أهلاً" }, "en")).toBe("أهلاً");
  });
});
