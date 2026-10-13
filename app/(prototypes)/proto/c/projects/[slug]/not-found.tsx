import Link from "next/link";
import { GreaseLoop } from "../../_components/marks";

export default function ProjectNotFound() {
  return (
    <main className="grid flex-1 place-items-center px-4 py-24">
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="group relative w-64">
          <div className="c-rebate">
            <div className="c-sprockets" />
            <div className="flex justify-between px-2 font-mono text-[9px] tracking-[0.12em]">
              <span>▸ ??</span>
              <span>??A</span>
            </div>
          </div>
          <div className="flex aspect-video items-center justify-center bg-(--c-film) font-heading text-5xl text-(--c-edge) uppercase">
            Velado
          </div>
          <div className="c-rebate">
            <div className="c-sprockets" />
          </div>
          <GreaseLoop drawn className="-top-2 -left-2 size-[calc(100%+16px)]" />
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground uppercase tabular-nums">Error 404</p>
          <h1 className="font-heading text-5xl uppercase md:text-7xl">
            Este fotograma no está en el archivo
          </h1>
        </div>
        <Link
          href="/proto/c"
          className="border border-current px-4 py-2 text-sm uppercase outline-none hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background"
        >
          ← Volver a la hoja de contactos
        </Link>
      </div>
    </main>
  );
}
