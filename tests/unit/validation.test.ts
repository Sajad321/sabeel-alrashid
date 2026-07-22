import { describe, expect, it } from "vitest";
import { contactSchema, franchiseSchema, jobSchema } from "@/lib/validation";
const base = {
  name: "Test User",
  email: "test@example.com",
  phone: "+9647700000000",
  website: "",
  turnstileToken: "",
  idempotencyKey: "41cf077e-6f03-4d4f-af75-92fbf5f33f86",
};
describe("submission validation", () => {
  it("accepts a valid contact submission", () =>
    expect(
      contactSchema.safeParse({
        ...base,
        subject: "General",
        message: "A sufficiently detailed enquiry.",
      }).success,
    ).toBe(true));
  it("rejects honeypot content", () =>
    expect(
      contactSchema.safeParse({
        ...base,
        website: "spam",
        subject: "General",
        message: "A sufficiently detailed enquiry.",
      }).success,
    ).toBe(false));
  it("accepts franchise and job payloads", () => {
    expect(
      franchiseSchema.safeParse({
        ...base,
        city: "Baghdad",
        investment: "$250k",
        brand: "Super Chicken",
        message: "Interested",
      }).success,
    ).toBe(true);
    expect(
      jobSchema.safeParse({
        ...base,
        birthDate: "1995-04-12",
        gender: "Male",
        maritalStatus: "Single",
        address: "Baghdad",
        job: "marketing-specialist",
        preferredBrand: "Head office",
        startDate: "",
        salary: "",
        education: "Bachelor",
        experience: "4 years",
        employer: "Example",
        note: "A good fit",
      }).success,
    ).toBe(true);
  });
});
