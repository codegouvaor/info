import type { FrIconClassName } from "@codegouvaor/react-ads/fr";
import { legalPaths, sectionPaths } from "./site-structure";

/**
 * Content structure of the home page.
 *
 * The home page is a server component: every word it displays comes from the
 * message catalogs (see `home.*` in `apps/messages/`), while the *structure* —
 * which destinations exist, in which order, with which ADS icon — is
 * centralized here, mirroring `site-structure.ts` for the header/footer.
 *
 * Content (articles, agenda items…) is addressed through stable keys so it can
 * later be replaced by a CMS, an API or the government data platform without
 * touching the page layout: only this file and the message catalogs change.
 *
 * Some destinations do not have their own page yet (thematic pages, per-service
 * pages…). They currently point to the closest live section of the portal and
 * should be swapped for their dedicated routes as those are published.
 */

/** A home page destination: message key + locale-agnostic href + ADS icon. */
export type HomeLinkItem = {
  /** Message key prefix under `home.<section>.items.<key>` (title/desc). */
  key: string;
  /** Locale-agnostic href, localized by the next-intl Link renderer. */
  href: string;
  /** ADS icon rendered by the tile/card pictogram. */
  iconId: FrIconClassName;
};

/** 02 — Accès rapides : the main destinations of the portal. */
export const quickAccessItems: ReadonlyArray<HomeLinkItem> = [
  { key: "news", href: "/news", iconId: "fr-icon-newspaper-line" },
  { key: "government", href: "/government", iconId: "fr-icon-government-line" },
  { key: "institutions", href: sectionPaths.composition, iconId: "fr-icon-building-line" },
  { key: "policies", href: sectionPaths.suiviDesEngagements, iconId: "fr-icon-line-chart-line" },
  { key: "services", href: "/services", iconId: "fr-icon-tools-line" },
  { key: "prevention", href: sectionPaths.preventionDesRisques, iconId: "fr-icon-shield-line" },
  { key: "etatEtMoi", href: sectionPaths.lEtatEtMoi, iconId: "fr-icon-user-heart-line" },
];

/** 03 — À la une : the article feed, addressable by stable keys. */
export type HomeArticle = {
  /** Message key prefix under `home.aLaUne.*` (tag/title/text/date). */
  key: string;
  href: string;
};

export const featuredArticle: HomeArticle = {
  key: "featured",
  // Article routes are published progressively; this follows the planned
  // route already exposed by the header navigation.
  href: "/news/ce-qui-change",
};

export const secondaryArticles: ReadonlyArray<HomeArticle> = [
  { key: "sante", href: "/news/parlons-sante-mentale" },
  { key: "education", href: "/news/rentree-scolaire" },
  { key: "retraites", href: "/news/retraites" },
];

/** 04 — L'action du Gouvernement : the major public policies. */
export const policyItems: ReadonlyArray<HomeLinkItem> = [
  { key: "economie", href: sectionPaths.suiviDesEngagements, iconId: "fr-icon-money-euro-circle-line" },
  { key: "education", href: sectionPaths.lEtatEtMoi, iconId: "fr-icon-school-line" },
  { key: "numerique", href: sectionPaths.decryptages, iconId: "fr-icon-cpu-line" },
  { key: "environnement", href: sectionPaths.preventionDesRisques, iconId: "fr-icon-leaf-line" },
  { key: "sante", href: "/services", iconId: "fr-icon-stethoscope-line" },
  { key: "securite", href: sectionPaths.lEtatEtMoi, iconId: "fr-icon-shield-line" },
  { key: "mobilite", href: "/services", iconId: "fr-icon-car-line" },
  { key: "culture", href: "/news", iconId: "fr-icon-palette-line" },
];

/** 05 — Gouvernement & institutions. */
export const institutionItems: ReadonlyArray<HomeLinkItem> = [
  { key: "government", href: "/government", iconId: "fr-icon-government-line" },
  { key: "composition", href: sectionPaths.composition, iconId: "fr-icon-team-line" },
  { key: "institutions", href: sectionPaths.lEtatEtMoi, iconId: "fr-icon-building-line" },
  { key: "organismes", href: sectionPaths.liensUtiles, iconId: "fr-icon-group-line" },
];

/** 06 — Services & démarches : orientation towards public services. */
export const serviceItems: ReadonlyArray<HomeLinkItem> = [
  { key: "identite", href: "/services", iconId: "fr-icon-user-line" },
  { key: "fiscalite", href: "/services", iconId: "fr-icon-money-euro-circle-line" },
  { key: "entreprises", href: "/services", iconId: "fr-icon-briefcase-line" },
  { key: "transport", href: "/services", iconId: "fr-icon-car-line" },
  { key: "education", href: "/services", iconId: "fr-icon-school-line" },
  { key: "logement", href: "/services", iconId: "fr-icon-home-4-line" },
  { key: "sante", href: "/services", iconId: "fr-icon-heart-line" },
];

/** 07 — En ce moment : the government agenda (editorial list, no page yet). */
export type HomeEvent = {
  /** Message key prefix under `home.events.items.<key>` (tag/title/text/date). */
  key: string;
  /** Machine-readable date for the `<time dateTime>` attribute. */
  isoDate: string;
};

export const homeEvents: ReadonlyArray<HomeEvent> = [
  { key: "conseilMinistres", isoDate: "2026-09-03" },
  { key: "budget", isoDate: "2026-09-05" },
  { key: "pointPresse", isoDate: "2026-09-08" },
  { key: "egalite", isoDate: "2026-09-10" },
];

/** 08 — Une République ouverte. */
export const openRepublicItems: ReadonlyArray<HomeLinkItem> = [
  { key: "transparence", href: sectionPaths.suiviDesEngagements, iconId: "fr-icon-eye-line" },
  { key: "donnees", href: sectionPaths.liensUtiles, iconId: "fr-icon-database-line" },
  { key: "openSource", href: sectionPaths.liensUtiles, iconId: "fr-icon-code-line" },
  { key: "accessibilite", href: legalPaths.accessibility, iconId: "fr-icon-wheelchair-line" },
  { key: "publications", href: sectionPaths.liensUtiles, iconId: "fr-icon-file-text-line" },
];