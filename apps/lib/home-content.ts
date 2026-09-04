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

/** 01 — Hero : popular searches pointing to real portal content. */
export type HomePopularSearch = {
  /** Message key prefix under `home.hero.popularSearches.<key>`. */
  key: string;
  /** Locale-agnostic href, localized by the next-intl Link renderer. */
  href: string;
};

export const heroPopularSearches: ReadonlyArray<HomePopularSearch> = [
  { key: "retraites", href: "/news/retraites" },
  { key: "rentreeScolaire", href: "/news/rentree-scolaire" },
  { key: "logement", href: "/news/relance-logement" },
  { key: "budget", href: "/news/budget" },
  { key: "sante", href: "/news/sante" },
];

/** 02 — Accès rapides : the user intentions served by the portal. */
export const quickAccessItems: ReadonlyArray<HomeLinkItem> = [
  { key: "demarche", href: "/services", iconId: "fr-icon-edit-line" },
  { key: "service", href: "/services", iconId: "fr-icon-search-line" },
  { key: "decision", href: sectionPaths.decryptages, iconId: "fr-icon-lightbulb-line" },
  { key: "contact", href: "/contact", iconId: "fr-icon-mail-line" },
  { key: "gouvernement", href: "/government", iconId: "fr-icon-government-line" },
  { key: "actualites", href: "/news", iconId: "fr-icon-newspaper-line" },
];

/**
 * 03 — Ce qui change : measures with a concrete impact, addressable by stable
 * keys. Each entry carries machine-readable dates so the cards can later be
 * rendered by a CMS without changing the layout (publication date, category,
 * title, summary, entry-into-force date and detail link).
 */
export type HomeChange = {
  /** Message key prefix under `home.changes.items.<key>` (tag/title/desc/date). */
  key: string;
  /** Detail page of the measure. */
  href: string;
  /** Publication date, machine-readable for `<time dateTime>`. */
  isoDate: string;
  /** Entry-into-force date, machine-readable for `<time dateTime>`. */
  isoEffectiveDate: string;
};

export const changesItems: ReadonlyArray<HomeChange> = [
  { key: "fiscalite", href: "/news/budget", isoDate: "2026-09-01", isoEffectiveDate: "2027-01-01" },
  { key: "logement", href: "/news/relance-logement", isoDate: "2026-09-01", isoEffectiveDate: "2026-10-01" },
  { key: "transport", href: "/news/ce-qui-change", isoDate: "2026-09-01", isoEffectiveDate: "2026-11-01" },
  { key: "education", href: "/news/rentree-scolaire", isoDate: "2026-09-01", isoEffectiveDate: "2026-09-02" },
  { key: "sante", href: "/news/sante", isoDate: "2026-09-01", isoEffectiveDate: "2027-01-01" },
  { key: "travail", href: "/news/retraites", isoDate: "2026-08-28", isoEffectiveDate: "2026-09-01" },
];

/** 04 — Actualités du Gouvernement : the article feed, addressable by stable keys. */
export type HomeArticle = {
  /** Message key prefix under `home.news.*` (tag/title/text/date). */
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

/** 05 — L'action publique : the major public policy areas. */
export const policyItems: ReadonlyArray<HomeLinkItem> = [
  { key: "economie", href: sectionPaths.suiviDesEngagements, iconId: "fr-icon-money-euro-circle-line" },
  { key: "education", href: sectionPaths.lEtatEtMoi, iconId: "fr-icon-school-line" },
  { key: "sante", href: "/services", iconId: "fr-icon-stethoscope-line" },
  { key: "securite", href: sectionPaths.lEtatEtMoi, iconId: "fr-icon-shield-line" },
  { key: "numerique", href: sectionPaths.decryptages, iconId: "fr-icon-cpu-line" },
  { key: "environnement", href: sectionPaths.preventionDesRisques, iconId: "fr-icon-leaf-line" },
  { key: "mobilite", href: "/services", iconId: "fr-icon-car-line" },
  { key: "culture", href: "/news", iconId: "fr-icon-palette-line" },
];

/** 06 — Pour moi : orientation by user profile towards services & procedures. */
export const audienceItems: ReadonlyArray<HomeLinkItem> = [
  { key: "citoyen", href: "/services", iconId: "fr-icon-user-line" },
  { key: "etudiant", href: "/services", iconId: "fr-icon-book-2-line" },
  { key: "professionnel", href: "/services", iconId: "fr-icon-briefcase-line" },
  { key: "entreprise", href: "/services", iconId: "fr-icon-building-line" },
  { key: "association", href: "/services", iconId: "fr-icon-group-line" },
  { key: "etranger", href: "/services", iconId: "fr-icon-earth-line" },
  { key: "administration", href: sectionPaths.lEtatEtMoi, iconId: "fr-icon-community-line" },
];

/** 07 — Gouvernement & institutions. */
export const institutionItems: ReadonlyArray<HomeLinkItem> = [
  { key: "government", href: "/government", iconId: "fr-icon-government-line" },
  { key: "composition", href: sectionPaths.composition, iconId: "fr-icon-team-line" },
  { key: "institutions", href: sectionPaths.lEtatEtMoi, iconId: "fr-icon-building-line" },
  { key: "organismes", href: sectionPaths.liensUtiles, iconId: "fr-icon-group-line" },
];

/**
 * 08 — Agenda du Gouvernement (editorial list). Each event carries the
 * destination where its coverage (compte rendu, publication) will appear.
 * Later, a past event can evolve into a documented content page: agenda,
 * documents, summary, decisions and media.
 */
export type HomeEvent = {
  /** Message key prefix under `home.events.items.<key>` (tag/title/text/date). */
  key: string;
  /** Machine-readable date for the `<time dateTime>` attribute. */
  isoDate: string;
  /** Where the event coverage is (or will be) published. */
  href: string;
};

export const homeEvents: ReadonlyArray<HomeEvent> = [
  { key: "conseilMinistres", isoDate: "2026-09-03", href: "/news" },
  { key: "budget", isoDate: "2026-09-05", href: "/news/budget" },
  { key: "pointPresse", isoDate: "2026-09-08", href: "/news" },
  { key: "egalite", isoDate: "2026-09-10", href: "/news" },
];

/** 09 — Une République ouverte. */
export const openRepublicItems: ReadonlyArray<HomeLinkItem> = [
  { key: "transparence", href: sectionPaths.suiviDesEngagements, iconId: "fr-icon-eye-line" },
  { key: "donnees", href: sectionPaths.liensUtiles, iconId: "fr-icon-database-line" },
  { key: "openSource", href: sectionPaths.liensUtiles, iconId: "fr-icon-code-line" },
  { key: "publications", href: sectionPaths.liensUtiles, iconId: "fr-icon-file-text-line" },
  { key: "accessibilite", href: legalPaths.accessibility, iconId: "fr-icon-wheelchair-line" },
  { key: "participation", href: sectionPaths.participation, iconId: "fr-icon-chat-3-line" },
];