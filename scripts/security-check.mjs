import { createClient } from "@sanity/client";

if (
  process.argv.includes("--production-only") &&
  process.env.VERCEL_ENV !== "production"
) {
  console.log("Skipping the production security check outside Vercel production.");
  process.exit(0);
}

const required = [
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
  "SANITY_API_READ_TOKEN",
  "SANITY_API_WRITE_TOKEN",
  "SANITY_REVALIDATE_SECRET",
  "CRON_SECRET",
];

const failures = [];
const warnings = [];
for (const name of required) {
  if (!process.env[name]) failures.push(`${name} is missing.`);
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (!siteUrl || !siteUrl.startsWith("https://") || siteUrl.includes("localhost"))
  failures.push("NEXT_PUBLIC_SITE_URL must be the HTTPS production origin.");
if ((process.env.SANITY_REVALIDATE_SECRET || "").length < 32)
  failures.push("SANITY_REVALIDATE_SECRET must contain at least 32 characters.");
if ((process.env.CRON_SECRET || "").length < 32)
  failures.push("CRON_SECRET must contain at least 32 characters.");
const scanEndpoint = process.env.CV_SCAN_ENDPOINT || "";
const scanToken = process.env.CV_SCAN_TOKEN || "";
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || "";
if (Boolean(turnstileSiteKey) !== Boolean(turnstileSecret))
  failures.push(
    "NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY must be configured together.",
  );
if (!turnstileSiteKey && !turnstileSecret)
  warnings.push(
    "Turnstile is not configured. Submission forms will remain available without a bot challenge under the documented temporary risk exception.",
  );
if (Boolean(scanEndpoint) !== Boolean(scanToken))
  failures.push("CV_SCAN_ENDPOINT and CV_SCAN_TOKEN must be configured together.");
if (scanEndpoint && !scanEndpoint.startsWith("https://"))
  failures.push("CV_SCAN_ENDPOINT must be an HTTPS malware-scanning endpoint.");

if (
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  process.env.NEXT_PUBLIC_SANITY_DATASET &&
  process.env.SANITY_API_WRITE_TOKEN
) {
  try {
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-01",
      token: process.env.SANITY_API_WRITE_TOKEN,
      useCdn: false,
    });
    const datasets = await client.datasets.list();
    const dataset = datasets.find(
      (item) => item.name === process.env.NEXT_PUBLIC_SANITY_DATASET,
    );
    if (dataset?.aclMode !== "private")
      failures.push("The configured Sanity dataset is not private.");
  } catch {
    failures.push("Sanity dataset visibility could not be verified.");
  }
}

for (const warning of warnings) console.warn(`Security warning: ${warning}`);

if (failures.length) {
  console.error("Security configuration check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Security configuration check passed.");
