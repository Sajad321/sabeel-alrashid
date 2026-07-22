"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <section className="section">
      <div
        className="container"
        style={{ textAlign: "center", paddingBlock: "8rem" }}
      >
        <h1 className="h1">{t("title")}</h1>
        <p className="lead">{t("body")}</p>
        <Link href="/" className="btn btn--gold">
          {t("home")}
        </Link>
      </div>
    </section>
  );
}
