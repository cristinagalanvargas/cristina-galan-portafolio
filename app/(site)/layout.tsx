import { ThemeProvider } from "@/components/theme-provider";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
