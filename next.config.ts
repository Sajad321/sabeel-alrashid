import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl({
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "www.superchicken-iq.com" },
    ],
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
