export type Locale = "fr";

export type LocaleConfig = {
  code: Locale;
  label: string;
  country: string;
  flag: string;
};

export const locales: LocaleConfig[] = [
  { code: "fr", label: "France", country: "FR", flag: "🇫🇷" },
];

export const defaultLocale: Locale = "fr";

export function isValidLocale(locale: string): locale is Locale {
  return locales.some((l) => l.code === locale);
}

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split("/").filter(Boolean);
  const potentialLocale = segments[0];

  if (potentialLocale && isValidLocale(potentialLocale)) {
    return potentialLocale;
  }

  return defaultLocale;
}
