"use client";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { FranchiseFormField, Job, JobFormField } from "@/lib/types";
import { localize } from "@/lib/types";
import { DEFAULT_JOB_FORM_FIELDS, JOB_SYSTEM_FIELD_KEYS } from "@/lib/job-form-config";
import { Turnstile } from "./turnstile";

type Kind = "contact" | "franchise" | "job";
export function SubmissionForm({
  kind,
  locale,
  jobs = [],
  defaultJob = "",
  franchiseFields = [],
  jobFields,
}: {
  kind: Kind;
  locale: "ar" | "en";
  jobs?: Job[];
  defaultJob?: string;
  franchiseFields?: FranchiseFormField[];
  jobFields?: JobFormField[];
}) {
  const t = useTranslations("forms"),
    c = useTranslations("common");
  const ref = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const defaultFranchiseFields: FranchiseFormField[] = [
    { key: "name", label: { ar: "الاسم الكامل", en: "Full name" }, type: "text", required: true },
    { key: "email", label: { ar: "البريد الإلكتروني", en: "Email" }, type: "email", required: true },
    { key: "phone", label: { ar: "الهاتف", en: "Phone" }, type: "tel", required: true },
    { key: "city", label: { ar: "الدولة / المدينة", en: "Country / City" }, type: "text", required: true },
    {
      key: "investment",
      label: { ar: "الميزانية الاستثمارية", en: "Investment budget" },
      type: "select",
      options: ["$250k–$500k", "$500k–$1m", "$1m+"].map((value) => ({ ar: value, en: value })),
    },
    {
      key: "brand",
      label: { ar: "العلامة المفضلة", en: "Preferred brand" },
      type: "select",
      options: [
        { ar: "سوبر تشيكن", en: "Super Chicken" },
        { ar: "الركن الشرقي", en: "Alrukn Alsharqi" },
        { ar: "أي علامة", en: "Any brand" },
      ],
    },
    { key: "message", label: { ar: "رسالتك", en: "Message" }, type: "textarea", fullWidth: true },
  ];
  const mandatoryFranchiseKeys = new Set(["name", "email", "phone", "city"]);
  const configuredFranchiseFields = franchiseFields.length
    ? franchiseFields
    : defaultFranchiseFields;
  const resolvedFranchiseFields = [
    ...configuredFranchiseFields,
    ...defaultFranchiseFields.filter(
      (fallback) =>
        mandatoryFranchiseKeys.has(fallback.key) &&
        !configuredFranchiseFields.some((field) => field.key === fallback.key),
    ),
  ];
  const resolvedJobFields = jobFields ?? DEFAULT_JOB_FORM_FIELDS;
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = new FormData(e.currentTarget);
    data.set("idempotencyKey", crypto.randomUUID());
    data.set("turnstileToken", String(data.get("cf-turnstile-response") || ""));
    try {
      const res = await fetch(`/api/submissions/${kind}`, {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error();
      setState("success");
      ref.current?.reset();
    } catch {
      setState("error");
    }
  }
  return (
    <form
      ref={ref}
      className="form"
      onSubmit={submit}
      encType="multipart/form-data"
      noValidate
    >
      <div className="hp-field" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="form-grid">
        {kind === "contact" && (
          <>
            <Field label={t("name")} name="name" required />
            <Field
              label={t("email")}
              name="email"
              type="email"
              dir="ltr"
              required
            />
            <Field
              label={t("phone")}
              name="phone"
              type="tel"
              dir="ltr"
              required={kind !== "contact"}
            />
          </>
        )}
        {kind === "contact" && (
          <Select
            label={t("subject")}
            name="subject"
            options={
              locale === "ar"
                ? ["استفسار عام", "استثمار / امتياز", "موردون / أعمال", "إعلام", "وظائف"]
                : ["General enquiry", "Investment / Franchise", "Suppliers / B2B", "Media", "Careers"]
            }
          />
        )}{" "}
        {kind === "franchise" && (
          <>
            {resolvedFranchiseFields.map((field) => {
              const systemField = defaultFranchiseFields.some(
                (item) => item.key === field.key,
              );
              const name = systemField ? field.key : `custom__${field.key}`;
              const label = localize(field.label, locale);
              const required =
                mandatoryFranchiseKeys.has(field.key) || field.required === true;
              if (field.type === "select")
                return (
                  <Select
                    key={field.key}
                    label={label}
                    name={name}
                    options={(field.options || []).map((option) =>
                      localize(option, locale),
                    )}
                    required={required}
                    full={field.fullWidth}
                  />
                );
              if (field.type === "textarea")
                return (
                  <TextArea
                    key={field.key}
                    label={label}
                    name={name}
                    placeholder={field.placeholder ? localize(field.placeholder, locale) : undefined}
                    required={required}
                    full={field.fullWidth !== false}
                  />
                );
              return (
                <Field
                  key={field.key}
                  label={label}
                  name={name}
                  type={field.type}
                  placeholder={field.placeholder ? localize(field.placeholder, locale) : undefined}
                  dir={field.type === "email" || field.type === "tel" ? "ltr" : undefined}
                  required={required}
                  full={field.fullWidth}
                />
              );
            })}
          </>
        )}
        {kind === "job" && (
          <>
            {resolvedJobFields.map((field) => {
              const label = localize(field.label, locale);
              const name = JOB_SYSTEM_FIELD_KEYS.has(field.key)
                ? field.key
                : field.key === "cv"
                  ? "cv"
                  : `custom__${field.key}`;
              if (field.type === "section")
                return <FormSectionTitle key={field.key}>{label}</FormSectionTitle>;
              if (field.type === "jobSelect")
                return (
                  <Select
                    key={field.key}
                    label={label}
                    name={name}
                    defaultValue={defaultJob}
                    options={jobs.map((job) => ({
                      value: job.slug,
                      label: localize(job.title, locale),
                    }))}
                    required={field.required}
                    full={field.fullWidth}
                  />
                );
              if (field.type === "select")
                return (
                  <Select
                    key={field.key}
                    label={label}
                    name={name}
                    options={(field.options || []).map((option) =>
                      localize(option, locale),
                    )}
                    required={field.required}
                    full={field.fullWidth}
                  />
                );
              if (field.type === "textarea")
                return (
                  <TextArea
                    key={field.key}
                    label={label}
                    name={name}
                    placeholder={field.placeholder ? localize(field.placeholder, locale) : undefined}
                    required={field.required}
                    full={field.fullWidth !== false}
                  />
                );
              if (field.type === "file")
                return (
                  <div className="field field--full" key={field.key}>
                    <label htmlFor={name}>
                      {label}{field.required && <span className="req"> *</span>}
                    </label>
                    <label className="file-drop" htmlFor={name}>
                      {t("upload")}
                    </label>
                    <input
                      id={name}
                      name={name}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      required={field.required}
                      hidden
                    />
                  </div>
                );
              return (
                <Field
                  key={field.key}
                  label={label}
                  name={name}
                  type={field.type}
                  placeholder={field.placeholder ? localize(field.placeholder, locale) : undefined}
                  dir={["email", "tel", "url", "date"].includes(field.type) ? "ltr" : undefined}
                  required={field.required}
                  full={field.fullWidth}
                />
              );
            })}
          </>
        )}
        {kind === "contact" && <div className="field field--full">
          <label htmlFor={`${kind}-message`}>
            {t("message")} <span className="req"> *</span>
          </label>
          <textarea
            id={`${kind}-message`}
            name="message"
            required
          />
        </div>}
      </div>
      <Turnstile action={`submission-${kind}`} />
      <button
        className="btn btn--gold submit-btn"
        disabled={state === "sending"}
      >
        {state === "sending" ? c("sending") : c("send")}
      </button>
      {state === "success" && (
        <p role="status" className="form-status form-status--ok">
          {c("success")}
        </p>
      )}
      {state === "error" && (
        <p role="alert" className="form-status form-status--error">
          {c("error")}
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  dir,
  full = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  dir?: "ltr";
  full?: boolean;
  placeholder?: string;
}) {
  return (
    <div className={`field${full ? " field--full" : ""}`}>
      <label htmlFor={name}>
        {label}
        {required && <span className="req"> *</span>}
      </label>
      <input id={name} name={name} type={type} required={required} dir={dir} placeholder={placeholder} />
    </div>
  );
}
function Select({
  label,
  name,
  options,
  defaultValue,
  required = false,
  full = false,
}: {
  label: string;
  name: string;
  options: Array<string | { value: string; label: string }>;
  defaultValue?: string;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <div className={`field${full ? " field--full" : ""}`}>
      <label htmlFor={name}>{label}{required && <span className="req"> *</span>}</label>
      <select id={name} name={name} defaultValue={defaultValue} required={required}>
        {options.map((option) => {
          const item =
            typeof option === "string"
              ? { value: option, label: option }
              : option;
          return (
            <option value={item.value} key={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function TextArea({
  label,
  name,
  placeholder,
  required = false,
  full = true,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <div className={`field${full ? " field--full" : ""}`}>
      <label htmlFor={name}>
        {label}
        {required && <span className="req"> *</span>}
      </label>
      <textarea id={name} name={name} placeholder={placeholder} required={required} />
    </div>
  );
}

function FormSectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="field field--full form-section-title"><h2 className="h3">{children}</h2></div>;
}
