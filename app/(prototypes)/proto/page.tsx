import Link from "next/link";
import { getExpos, getProjects } from "@/sanity/lib/data";

const directions = [
  {
    href: "/proto/a",
    name: "A — Índice editorial",
    note: "Tipografía enorme, proyectos como índice con preview al pasar el ratón.",
  },
  {
    href: "/proto/b",
    name: "B — Cinemático",
    note: "Portadas a sangre, oscuro por defecto, morph portada → hero.",
  },
  {
    href: "/proto/c",
    name: "C — Hoja de contactos",
    note: "Retícula densa estilo suizo, filtros visibles, colores de expos como acento.",
  },
] as const;

export default async function PrototypesIndex() {
  const [projects, expos] = await Promise.all([getProjects(), getExpos()]);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <header className="space-y-2">
        <h1 className="font-heading text-6xl uppercase">Prototipos</h1>
        <p className="text-muted-foreground">
          Contenido real de Sanity: {projects.length} proyectos · {expos.length} exposiciones.
        </p>
      </header>
      <ul className="divide-y border-y">
        {directions.map((d) => (
          <li key={d.href}>
            <Link href={d.href} className="flex flex-col gap-1 py-6 hover:opacity-70">
              <span className="font-heading text-3xl uppercase">{d.name}</span>
              <span className="text-muted-foreground">{d.note}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
