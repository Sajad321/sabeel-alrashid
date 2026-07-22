import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { SubmissionForm } from "@/components/submission-form";
import { getJobs } from "@/lib/sanity/data";
import { PageHero } from "@/components/page-hero";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    locale,
    "careers/apply",
    { ar: "طلب توظيف", en: "Job Application" },
    {
      ar: "قدّم للانضمام إلى فريق سبيل الراشد.",
      en: "Apply to join the Sabeel Al-Rashid team.",
    },
  );
}
export default async function Apply({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ job?: string }>;
}) {
  const { locale } = await params;
  const { job = "" } = await searchParams;
  setRequestLocale(locale);
  const ar = locale === "ar";
  const jobs = await getJobs();
  return <>
    <PageHero locale={locale} eyebrow={ar ? "قدّم الآن" : "Apply"} parent={{label: ar ? "الوظائف" : "Careers", href: "/careers"}} title={ar ? "طلب توظيف" : "Job application"} description={ar ? "املأ بياناتك أدناه — الحقول المعلّمة بـ * إلزامية. نراجع كل طلب." : "Fill in your details below — fields marked * are required. We review every application."} image="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1900&q=75&auto=format&fit=crop" />
    <section className="section">
      <div className="container form-container">
        <SubmissionForm
          kind="job"
          locale={locale}
          jobs={jobs}
          defaultJob={jobs.some((j) => j.slug === job) ? job : ""}
        />
      </div>
    </section>
  </>;
}
