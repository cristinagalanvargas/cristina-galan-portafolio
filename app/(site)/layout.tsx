import { Cursor } from "@/components/cursor";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { ThemeProvider } from "@/components/theme-provider";
import { getContact } from "@/sanity/lib/data";
import "./cinema.css";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const contact = (await getContact()) ?? [];

  return (
    // Dark ("sala de proyección") on first visit; the toggle choice persists.
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <div
        data-site
        className="relative flex min-h-svh flex-1 flex-col bg-background text-foreground selection:bg-(--cine-red) selection:text-white"
      >
        <a
          href="#contenido"
          className="sr-only z-[70] bg-(--cine-red) px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Saltar al contenido
        </a>
        <Header />
        <div id="contenido" className="flex flex-1 flex-col">
          {children}
        </div>
        <Footer contact={contact} />
        <div aria-hidden className="cine-grain" />
        <Cursor
          className="text-white"
          stateClassNames={{
            default: "size-2.5 bg-white mix-blend-difference",
            hover: "size-11 border border-white bg-transparent mix-blend-difference",
            view: "size-24 bg-(--cine-red) text-[11px] tracking-[0.2em]",
            play: "size-28 bg-(--cine-red) tracking-[0.2em]",
          }}
        />
      </div>
    </ThemeProvider>
  );
}
