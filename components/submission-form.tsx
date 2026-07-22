"use client";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Job } from "@/lib/types";
import { localize } from "@/lib/types";
import { Turnstile } from "./turnstile";

type Kind = "contact" | "franchise" | "job";
export function SubmissionForm({
  kind,
  locale,
  jobs = [],
  defaultJob = "",
}: {
  kind: Kind;
  locale: "ar" | "en";
  jobs?: Job[];
  defaultJob?: string;
}) {
  const t = useTranslations("forms"),
    c = useTranslations("common");
  const ref = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
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
            <Field label={t("city")} name="city" required />
            <Select
              label={t("investment")}
              name="investment"
              options={["$250k–$500k", "$500k–$1m", "$1m+"]}
            />
            <Select
              label={t("brand")}
              name="brand"
              options={
                locale === "ar"
                  ? ["سوبر تشيكن", "الركن الشرقي", "أي علامة"]
                  : ["Super Chicken", "Alrukn Alsharqi", "Any brand"]
              }
            />
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
        <div className="field field--full">
          <label htmlFor={`${kind}-message`}>
            {kind === "job" ? t("note") : t("message")}
            {kind === "contact" && <span className="req"> *</span>}
          </label>
          <textarea
            id={`${kind}-message`}
            name={kind === "job" ? "note" : "message"}
            required={kind === "contact"}
          />
        </div>
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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  dir?: "ltr";
  full?: boolean;
}) {
  return (
    <div className={`field${full ? " field--full" : ""}`}>
      <label htmlFor={name}>
        {label}
        {required && <span className="req"> *</span>}
      </label>
      <input id={name} name={name} type={type} required={required} dir={dir} />
    </div>
  );
}
function Select({
  label,
  name,
  options,
  defaultValue,
  required = false,
}: {
  label: string;
  name: string;
  options: Array<string | { value: string; label: string }>;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
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

function FormSectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="field field--full form-section-title"><h2 className="h3">{children}</h2></div>;
}
