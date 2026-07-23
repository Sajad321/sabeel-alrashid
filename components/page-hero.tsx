import { Link } from "@/i18n/navigation";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  locale,
  parent,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image: string;
  imageAlt?: string;
  locale: "ar" | "en";
  parent?: { label: string; href: string };
}) {
  return (
    <section className="page-hero">
      <div className="page-hero__media">
        <img src={image} alt={imageAlt || ""} />
      </div>
      <div className="container page-hero__inner">
        <nav className="breadcrumb" aria-label={locale === "ar" ? "مسار الصفحة" : "Breadcrumb"}>
          <Link href="/">{locale === "ar" ? "الرئيسية" : "Home"}</Link>
          <span className="sep">/</span>
          {parent && <><Link href={parent.href}>{parent.label}</Link><span className="sep">/</span></>}
          <span>{eyebrow}</span>
        </nav>
        <h1 className="h1">{title}</h1>
        {description && <p>{description}</p>}
      </div>
    </section>
  );
}
