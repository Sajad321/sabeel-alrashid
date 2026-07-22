"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitcher({ mobile = false }: { mobile?: boolean }) {
  const locale = useLocale();
  const t = useTranslations("common");
  const pathname = usePathname();
  const router = useRouter();
  return (
    <button
      className="lang-toggle"
      type="button"
      aria-label={t("language")}
      onClick={() =>
        router.replace(pathname, { locale: locale === "ar" ? "en" : "ar" })
      }
    >
      <span>{mobile ? t("language") : locale === "ar" ? "EN" : "ع"}</span>
    </button>
  );
}
