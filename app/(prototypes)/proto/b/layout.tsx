import type { Metadata } from "next";
import { Cursor } from "@/components/cursor";
import { getContact } from "@/sanity/lib/data";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import "./b.css";

export const metadata: Metadata = {
  title: { default: "B — Cinemático", template: "%s · B — Cinemático" },
};

export default async function CinematicLayout({ children }: LayoutProps<"/proto/b">) {
  const contact = (await getContact()) ?? [];

  return (
    <div
      data-proto="b"
      className="relative flex min-h-svh flex-1 flex-col bg-background text-foreground selection:bg-(--b-red) selection:text-white"
    >
      <a
        href="#b-main"
        className="sr-only z-[70] bg-(--b-red) px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Saltar al contenido
      </a>
      <Header />
      <div id="b-main" className="flex flex-1 flex-col">
        {children}
      </div>
      <Footer contact={contact} />
      <div aria-hidden className="b-grain" />
      <Cursor
        className="text-white"
        stateClassNames={{
          default: "size-2.5 bg-white mix-blend-difference",
          hover: "size-11 border border-white bg-transparent mix-blend-difference",
          view: "size-24 bg-(--b-red) text-[11px] tracking-[0.2em]",
          play: "size-28 bg-(--b-red) tracking-[0.2em]",
        }}
      />
    </div>
  );
}
