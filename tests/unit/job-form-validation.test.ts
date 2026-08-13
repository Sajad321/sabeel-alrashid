import { describe, expect, it } from "vitest";
import { validateJobFormAnswers } from "@/lib/job-form-validation";
import type { JobFormField } from "@/lib/types";

const l = (value: string) => ({ ar: value, en: value });

const fields: JobFormField[] = [
  { key: "name", label: l("Name"), type: "text", required: true },
  {
    key: "job",
    label: l("Job"),
    type: "jobSelect",
    required: true,
  },
  {
    key: "portfolio_url",
    label: l("Portfolio"),
    type: "url",
  },
];

describe("CMS-controlled job form validation", () => {
  it("accepts a configured form with no CV field", () => {
    const form = new FormData();
    form.set("name", "Applicant");
    form.set("job", "marketing-specialist");
    form.set("custom__portfolio_url", "https://example.com/work");

    expect(validateJobFormAnswers(form, fields)).toEqual({
      systemData: {
        name: "Applicant",
        job: "marketing-specialist",
      },
      customFields: [
        {
          _key: "portfolio_url",
          key: "portfolio_url",
          value: "https://example.com/work",
        },
      ],
    });
  });

  it("enforces only the fields marked required in Studio", () => {
    const form = new FormData();
    form.set("job", "marketing-specialist");
    expect(validateJobFormAnswers(form, fields)).toBeNull();
  });

  it("rejects invalid custom values according to the configured type", () => {
    const form = new FormData();
    form.set("name", "Applicant");
    form.set("job", "marketing-specialist");
    form.set("custom__portfolio_url", "javascript:alert(1)");
    expect(validateJobFormAnswers(form, fields)).toBeNull();
  });
});
