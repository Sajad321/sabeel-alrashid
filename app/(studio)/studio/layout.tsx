import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sabeel Al-Rashid Studio",
  robots: { index: false, follow: false },
};
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
