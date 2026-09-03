import { defineRouting } from "next-intl/routing";

const isProd = process.env.NODE_ENV === "production";
const isCapacitor = process.env.CAPACITOR === "true";

export const routing = defineRouting({
  locales: ["fr", "en", "es", "de", "ja"],
  defaultLocale: "fr",
  localePrefix: isProd && !isCapacitor ? "always" : "never",
});

export type Locale = (typeof routing.locales)[number];
