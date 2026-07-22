# Sabeel Al-Rashid

Bilingual Arabic/English corporate website built with Next.js 16, Tailwind CSS 4, shadcn-style Radix primitives, `next-intl`, and an embedded Sanity Studio.

## Local development

1. Copy `.env.example` to `.env.local` and add the Sanity project, private dataset, read token, and write token.
2. Run `npm install` and `npm run dev`.
3. Open `/ar`, `/en`, or `/studio`.
4. Run `npm run seed` once to import the prototype content. The script uses stable document IDs and reuses uploaded assets, so it can be run again safely.

Without Sanity environment variables, public routes render the bundled prototype content. Submission endpoints intentionally return `503` until a write token is configured.

## Production requirements

- Keep the Sanity dataset private and restrict tokens to the minimum required permissions.
- Configure the signed revalidation webhook at `/api/revalidate` with `x-sanity-secret`.
- Configure Cloudflare Turnstile keys.
- Implement and configure a `NotificationTransport` before launch. Submissions remain stored with notification status `disabled` until then.
- Configure a durable platform rate limit/WAF policy in addition to the application-level burst limiter.
