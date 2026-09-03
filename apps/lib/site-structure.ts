/**
 * URL structure of the public portal.
 *
 * Hrefs are locale-agnostic pathnames: the next-intl Link (registered as the
 * ADS link renderer) prefixes the active locale automatically. Labels are
 * never stored here — they come from the message catalogs through the key
 * provided by each entry.
 */
export const PORTAL_HOME = "/";

export type PrimaryNavKey = "home" | "government" | "news" | "services" | "contact";

export const primaryNavigation: ReadonlyArray<{
  key: PrimaryNavKey;
  href: string;
}> = [
  { key: "home", href: "/" },
  { key: "government", href: "/government" },
  { key: "news", href: "/news" },
  { key: "services", href: "/services" },
  { key: "contact", href: "/contact" },
];

export const sectionPaths = {
  composition: "/government/composition",
} as const;

export const legalPaths = {
  accessibility: "/legal/accessibility",
  privacy: "/legal/privacy",
  terms: "/legal/terms",
  cookies: "/legal/cookies",
  sitemap: "/sitemap",
} as const;

export const searchPath = "/search";

/** DOM ids used as skip-link targets. */
export const pageAnchors = {
  content: "main-content",
  footer: "main-footer",
} as const;
