import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-black px-5 text-center text-white">
      <p className="flex items-center gap-2 text-[11px] tracking-[0.32em] text-white/70 uppercase">
        <span className="cine-rec size-1.5 rounded-full bg-(--cine-red)" aria-hidden />
        Error 404
      </p>
      <h1 className="mt-10 font-heading text-[clamp(4rem,16vw,16rem)] leading-[0.8] font-medium uppercase">
        Fuera de plano
      </h1>
      <p className="mt-6 max-w-md text-lg text-white/70">
        Esta página no existe o se quedó en la sala de montaje.
      </p>
      <Link
        href="/"
        className="mt-10 text-[11px] tracking-[0.32em] uppercase underline-offset-8 outline-none hover:underline focus-visible:underline"
      >
        ← Volver a los proyectos
      </Link>
    </main>
  );
}
