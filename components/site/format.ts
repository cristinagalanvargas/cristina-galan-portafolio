export const pad = (n: number) => String(n).padStart(2, "0");

export const typeLabel = (type: "comercial" | "personal" | null | undefined) =>
  type === "comercial" ? "Comercial" : type === "personal" ? "Personal" : "";
