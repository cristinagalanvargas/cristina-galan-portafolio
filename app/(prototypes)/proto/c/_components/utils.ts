/** Two-digit frame number, as printed on a contact sheet: 1 → "01". */
export const frameNo = (n: number) => String(n).padStart(2, "0");

/** Readable ink (near-black or paper) on top of an arbitrary hex colour. */
export function inkOn(hex: string | null | undefined) {
  if (!hex) return "#141413";
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h.slice(0, 6);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.36 ? "#141413" : "#f7f5ef";
}

export const TIPOS = ["todos", "comercial", "personal"] as const;
export type Tipo = (typeof TIPOS)[number];

export const parseTipo = (value: string | null | undefined): Tipo =>
  value === "comercial" || value === "personal" ? value : "todos";

export const tipoLabel: Record<Tipo, string> = {
  todos: "Todos",
  comercial: "Comercial",
  personal: "Personal",
};
