import type { JobFormField } from "./types";

const localized = (ar: string, en: string) => ({ ar, en });

export const DEFAULT_JOB_FORM_FIELDS: JobFormField[] = [
  {
    key: "personal_section",
    label: localized("المعلومات الشخصية", "Personal information"),
    type: "section",
    fullWidth: true,
  },
  {
    key: "name",
    label: localized("الاسم الكامل", "Full name"),
    type: "text",
    required: true,
  },
  {
    key: "email",
    label: localized("البريد الإلكتروني", "Email"),
    type: "email",
    required: true,
  },
  {
    key: "phone",
    label: localized("الهاتف", "Phone"),
    type: "tel",
    required: true,
  },
  {
    key: "birthDate",
    label: localized("تاريخ الميلاد", "Birth date"),
    type: "date",
    required: true,
  },
  {
    key: "gender",
    label: localized("الجنس", "Gender"),
    type: "select",
    options: [localized("ذكر", "Male"), localized("أنثى", "Female")],
  },
  {
    key: "maritalStatus",
    label: localized("الحالة الاجتماعية", "Marital status"),
    type: "select",
    options: [localized("أعزب", "Single"), localized("متزوج", "Married")],
  },
  {
    key: "address",
    label: localized("العنوان", "Address"),
    type: "text",
    required: true,
    fullWidth: true,
  },
  {
    key: "position_section",
    label: localized("الوظيفة", "Position"),
    type: "section",
    fullWidth: true,
  },
  {
    key: "job",
    label: localized("الوظيفة المتقدم إليها", "Position"),
    type: "jobSelect",
    required: true,
  },
  {
    key: "preferredBrand",
    label: localized("العلامة المفضلة", "Preferred brand"),
    type: "select",
    options: [
      localized("سوبر تشيكن", "Super Chicken"),
      localized("الركن الشرقي", "Alrukn Alsharqi"),
      localized("المكتب الرئيسي", "Head office"),
      localized("أي", "Any"),
    ],
  },
  {
    key: "startDate",
    label: localized("تاريخ البدء المتوقع", "Available start date"),
    type: "date",
  },
  {
    key: "salary",
    label: localized("الراتب المتوقع", "Expected salary"),
    type: "text",
  },
  {
    key: "experience_section",
    label: localized("التعليم والخبرة", "Education & experience"),
    type: "section",
    fullWidth: true,
  },
  {
    key: "education",
    label: localized("المؤهل العلمي", "Education"),
    type: "select",
    required: true,
    options: [
      localized("ثانوية", "High school"),
      localized("دبلوم", "Diploma"),
      localized("بكالوريوس", "Bachelor's"),
      localized("دراسات عليا", "Postgraduate"),
    ],
  },
  {
    key: "experience",
    label: localized("الخبرة", "Experience"),
    type: "select",
    required: true,
    options: [
      localized("أقل من سنة", "Less than 1 year"),
      localized("1–3 سنوات", "1–3 years"),
      localized("4–7 سنوات", "4–7 years"),
      localized("8+ سنوات", "8+ years"),
    ],
  },
  {
    key: "employer",
    label: localized("جهة العمل الحالية", "Current employer"),
    type: "text",
  },
  {
    key: "cv",
    label: localized("السيرة الذاتية", "CV"),
    type: "file",
    required: true,
    fullWidth: true,
  },
  {
    key: "note",
    label: localized("ملاحظات", "Notes"),
    type: "textarea",
    fullWidth: true,
  },
];

export const JOB_SYSTEM_FIELD_KEYS = new Set([
  "name",
  "email",
  "phone",
  "birthDate",
  "gender",
  "maritalStatus",
  "address",
  "job",
  "preferredBrand",
  "startDate",
  "salary",
  "education",
  "experience",
  "employer",
  "note",
]);
