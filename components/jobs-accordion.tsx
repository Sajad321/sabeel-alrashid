"use client";
import * as Accordion from "@radix-ui/react-accordion";
import type { Job } from "@/lib/types";
import { localize } from "@/lib/types";
import { Link } from "@/i18n/navigation";
import { PortableText, type PortableTextBlock } from "@portabletext/react";

export function JobsAccordion({
  jobs,
  locale,
}: {
  jobs: Job[];
  locale: "ar" | "en";
}) {
  return (
    <Accordion.Root
      className="positions"
      type="single"
      defaultValue={jobs[0]?.slug}
      collapsible
    >
      {jobs.map((job) => (
        <Accordion.Item className="position" value={job.slug} key={job.slug}>
          <Accordion.Header>
            <Accordion.Trigger className="position__head">
              <span className="position__title">
                {localize(job.title, locale)}
              </span>
              <span className="position__tags">
                <span className="brand-tag">
                  {localize(job.department, locale)}
                </span>
                <span className="brand-tag">{localize(job.type, locale)}</span>
              </span>
              <span className="position__toggle">+</span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="position__body">
            <div className="position__body-inner">
              <p>{localize(job.description, locale)}</p>
              {job.responsibilities?.[locale]?.length ? (
                <div className="position__details">
                  <h4>{locale === "ar" ? "المسؤوليات" : "Responsibilities"}</h4>
                  <PortableText
                    value={job.responsibilities[locale] as PortableTextBlock[]}
                  />
                </div>
              ) : null}
              {job.requirements?.[locale]?.length ? (
                <div className="position__details">
                  <h4>{locale === "ar" ? "المتطلبات" : "Requirements"}</h4>
                  <PortableText
                    value={job.requirements[locale] as PortableTextBlock[]}
                  />
                </div>
              ) : null}
              <Link
                className="btn btn--ink"
                href={{ pathname: "/careers/apply", query: { job: job.slug } }}
              >
                {locale === "ar"
                  ? "قدّم على هذه الوظيفة"
                  : "Apply for this role"}{" "}
                <span className="arrow">←</span>
              </Link>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
