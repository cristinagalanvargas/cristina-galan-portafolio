import localFont from "next/font/local";

export const formula = localFont({
  variable: "--font-formula",
  display: "swap",
  src: [
    { path: "./formula/PPFormula-Regular.woff2", weight: "400", style: "normal" },
    { path: "./formula/PPFormula-Medium.woff2", weight: "500", style: "normal" },
  ],
});

export const formulaCondensed = localFont({
  variable: "--font-formula-condensed",
  display: "swap",
  src: [
    { path: "./formula/PPFormula-CondensedRegular.woff2", weight: "400", style: "normal" },
    { path: "./formula/PPFormula-CondensedMedium.woff2", weight: "500", style: "normal" },
  ],
});
