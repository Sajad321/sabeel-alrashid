import type { Locale } from "@/i18n/routing";

export function BrandCarousel({
  images,
  brandName,
  locale,
}: {
  images: Array<{ src: string; alt: string }>;
  brandName: string;
  locale: Locale;
}) {
  if (!images.length) return null;

  const repeated = [...images, ...images];
  const ar = locale === "ar";

  return (
    <div
      className="bstrip"
      role="region"
      aria-label={
        ar ? `معرض صور ${brandName}` : `${brandName} image carousel`
      }
    >
      <div className="bstrip__viewport">
        <div className="bstrip__row">
          {repeated.map((image, index) => {
            const duplicate = index >= images.length;
            return (
              <img
                src={image.src}
                alt={duplicate ? "" : image.alt}
                aria-hidden={duplicate || undefined}
                loading="lazy"
                key={`${image.src}-${index}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
