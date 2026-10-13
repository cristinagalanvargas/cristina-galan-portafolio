import type { Metadata } from "next";
import { formula, formulaCondensed } from "./fonts";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cristinagalan.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cristina Galán",
    template: "%s | Cristina Galán",
  },
  description:
    "Cristina Galán, fotógrafa y realizadora en Madrid. Fashion film, publicidad, documental y obra personal.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Cristina Galán",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${formula.variable} ${formulaCondensed.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
