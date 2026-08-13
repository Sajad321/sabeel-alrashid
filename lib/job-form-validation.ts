import type { JobFormField } from "./types";
import { JOB_SYSTEM_FIELD_KEYS } from "./job-form-config";

type Answer = { _key: string; key: string; value: string };

export function validateJobFormAnswers(
  form: FormData,
  fields: JobFormField[],
) {
  const entries = fields.slice(0, 30);
  const inputFields = entries.filter((field) => field.type !== "section");
  const keys = inputFields.map((field) => field.key);
  if (
    new Set(keys).size !== keys.length ||
    !inputFields.some(
      (field) => field.key === "job" && field.type === "jobSelect",
    ) ||
    !inputFields.some((field) =>
      ["name", "email", "phone"].includes(field.key),
    ) ||
    inputFields.some(
      (field) =>
        (field.type === "file" && field.key !== "cv") ||
        (field.key === "cv" && field.type !== "file") ||
        (field.type === "jobSelect" && field.key !== "job"),
    )
  )
    return null;

  const systemData: Record<string, string> = {};
  const customFields: Answer[] = [];

  for (const field of inputFields) {
    if (field.type === "file") continue;
    if (!/^[a-z][a-zA-Z0-9_]*$/.test(field.key)) return null;

    const name = JOB_SYSTEM_FIELD_KEYS.has(field.key)
      ? field.key
      : `custom__${field.key}`;
    const raw = form.get(name);
    const value = typeof raw === "string" ? raw.trim() : "";
    const maxLength = field.type === "textarea" ? 5_000 : 500;
    if (field.required && !value) return null;
    if (value.length > maxLength || !validValue(field, value)) return null;
    if (!value) continue;

    if (JOB_SYSTEM_FIELD_KEYS.has(field.key)) systemData[field.key] = value;
    else customFields.push({ _key: field.key, key: field.key, value });
  }

  return { systemData, customFields };
}

function validValue(field: JobFormField, value: string) {
  if (!value) return true;
  if (field.type === "email") return /^\S+@\S+\.\S+$/.test(value);
  if (field.type === "tel") return value.length >= 7 && value.length <= 30;
  if (field.type === "number") return Number.isFinite(Number(value));
  if (field.type === "date")
    return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
  if (field.type === "url") {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  }
  if (field.type === "select")
    return (field.options || []).some(
      (option) => option.ar === value || option.en === value,
    );
  return true;
}
