import type { ContactLinks } from "@/sanity/lib/data";

/** End credits: one big line to write, then the socials. */
export function Footer({ contact }: { contact: NonNullable<ContactLinks> }) {
  const email = contact.find((link) => link.kind === "email");
  const socials = contact.filter((link) => link.kind === "social" && link.url);
  const address = email?.url?.replace(/^mailto:/, "");

  return (
    <footer className="relative border-t px-5 pt-20 pb-8 md:px-10 md:pt-32">
      <p className="text-[11px] tracking-[0.32em] text-muted-foreground uppercase">
        Fin — Contacto
      </p>

      {email?.url ? (
        <a
          href={email.url}
          className="group mt-6 block font-heading text-[clamp(2.75rem,10vw,11rem)] leading-[0.85] uppercase outline-none"
        >
          <span className="block">¿Rodamos?</span>
          <span className="mt-4 block font-sans text-base tracking-normal normal-case md:text-xl">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-700 group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px]">
              {address}
            </span>
            <span aria-hidden className="ml-2 inline-block text-(--b-red)">
              ↗
            </span>
          </span>
        </a>
      ) : null}

      <div className="mt-20 flex flex-col gap-6 border-t pt-6 md:flex-row md:items-end md:justify-between">
        <ul className="flex flex-wrap gap-x-8 gap-y-2">
          {socials.map((link) => (
            <li key={link._key}>
              <a
                href={link.url ?? undefined}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] tracking-[0.32em] uppercase underline-offset-4 outline-none hover:underline focus-visible:underline"
              >
                {link.name}
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="text-[11px] tracking-[0.32em] text-muted-foreground uppercase">
          Cristina Galán — Fotografía & dirección — Madrid
        </p>
      </div>
    </footer>
  );
}
