import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const developmentScriptPolicy =
  process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  `script-src 'self' 'unsafe-inline'${developmentScriptPolicy} https://challenges.cloudflare.com https://*.sanity.io`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://images.unsplash.com https://www.superchicken-iq.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.api.sanity.io https://*.apicdn.sanity.io wss://*.api.sanity.io https://challenges.cloudflare.com https://*.sanity.io",
  "frame-src 'self' https://challenges.cloudflare.com https://*.sanity.io",
  "worker-src 'self' blob:",
  "media-src 'self' blob: https://cdn.sanity.io",
  ...(process.env.NODE_ENV === "production"
    ? ["upgrade-insecure-requests"]
    : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

export default withNextIntl({
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "www.superchicken-iq.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/ar", permanent: true },
      { source: "/about.html", destination: "/ar/about", permanent: true },
      { source: "/brands.html", destination: "/ar/brands", permanent: true },
      {
        source: "/franchise.html",
        destination: "/ar/franchise",
        permanent: true,
      },
      { source: "/careers.html", destination: "/ar/careers", permanent: true },
      {
        source: "/apply.html",
        destination: "/ar/careers/apply",
        permanent: true,
      },
      { source: "/news.html", destination: "/ar/news", permanent: true },
      {
        source: "/news-article.html",
        destination: "/ar/news/super-chicken-32nd-branch",
        permanent: true,
      },
      { source: "/contact.html", destination: "/ar/contact", permanent: true },
    ];
  },
});
