import type { Metadata } from "next";
import { siteDescription, siteName, siteUrl } from "@/lib/seo";
import { formula, formulaCondensed } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cristina Galán",
    template: "%s | Cristina Galán",
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  openGraph: { type: "website", locale: "es_ES", siteName },
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
