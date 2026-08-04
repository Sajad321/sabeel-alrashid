"use client";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { FranchiseFormField, Job } from "@/lib/types";
import { localize } from "@/lib/types";
import { Turnstile } from "./turnstile";

type Kind = "contact" | "franchise" | "job";
export function SubmissionForm({
  kind,
  locale,
  jobs = [],
  defaultJob = "",
  franchiseFields = [],
}: {
  kind: Kind;
  locale: "ar" | "en";
  jobs?: Job[];
  defaultJob?: string;
  franchiseFields?: FranchiseFormField[];
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
        {kind === "job" && <FormSectionTitle>{locale === "ar" ? "المعلومات الشخصية" : "Personal information"}</FormSectionTitle>}
        {kind !== "franchise" && (
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
            <Field
              label={t("birthDate")}
              name="birthDate"
              type="date"
              dir="ltr"
              required
            />
            <Select label={t("gender")} name="gender" options={locale === "ar" ? ["ذكر", "أنثى"] : ["Male", "Female"]} />
            <Select label={t("maritalStatus")} name="maritalStatus" options={locale === "ar" ? ["أعزب", "متزوج"] : ["Single", "Married"]} />
            <Field label={t("address")} name="address" required full />
            <FormSectionTitle>{locale === "ar" ? "الوظيفة" : "Position"}</FormSectionTitle>
            <Select
              label={t("role")}
              name="job"
              defaultValue={defaultJob}
              options={jobs.map((job) => ({
                value: job.slug,
                label: localize(job.title, locale),
              }))}
              required
            />
            <Select label={t("brand")} name="preferredBrand" options={locale === "ar" ? ["سوبر تشيكن", "الركن الشرقي", "المكتب الرئيسي", "أي"] : ["Super Chicken", "Alrukn Alsharqi", "Head office", "Any"]} />
            <Field
              label={t("startDate")}
              name="startDate"
              type="date"
              dir="ltr"
            />
            <Field label={t("salary")} name="salary" />
            <FormSectionTitle>{locale === "ar" ? "التعليم والخبرة" : "Education & experience"}</FormSectionTitle>
            <Select
              label={t("education")}
              name="education"
              options={
                locale === "ar"
                  ? ["ثانوية", "دبلوم", "بكالوريوس", "دراسات عليا"]
                  : ["High school", "Diploma", "Bachelor's", "Postgraduate"]
              }
              required
            />
            <Select
              label={t("experience")}
              name="experience"
              options={
                locale === "ar"
                  ? ["أقل من سنة", "1–3 سنوات", "4–7 سنوات", "8+ سنوات"]
                  : ["Less than 1 year", "1–3 years", "4–7 years", "8+ years"]
              }
              required
            />
            <Field label={t("employer")} name="employer" />
            <div className="field field--full">
              <label htmlFor="cv">
                {t("cv")} <span className="req">*</span>
              </label>
              <label className="file-drop" htmlFor="cv">
                {t("upload")}
              </label>
              <input
                id="cv"
                name="cv"
                type="file"
                accept=".pdf,.doc,.docx"
                required
                hidden
              />
            </div>
          </>
        )}
        {kind !== "franchise" && <div className="field field--full">
          <label htmlFor={`${kind}-message`}>
            {kind === "job" ? t("note") : t("message")}
            {kind === "contact" && <span className="req"> *</span>}
          </label>
          <textarea
            id={`${kind}-message`}
            name={kind === "job" ? "note" : "message"}
            required={kind === "contact"}
          />
        </div>}
      </div>
      <Turnstile />
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
