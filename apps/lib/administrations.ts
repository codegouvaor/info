/**
 * Content structure and data model of the `/republique/administrations`
 * institutional page.
 *
 * This page serves as the institutional directory of the public administrations
 * of the Republic of Astoria. It is the reference page for administrative
 * structures, distinct from:
 *   - /government (the Government)
 *   - /government/ministere (the Ministries)
 *   - /services-publics (the public services accessible to citizens)
 *
 * Architecture:
 *   An administration is an autonomous institution that carries out public
 *   missions. It exists independently of any director or head — a change
 *   of leadership never modifies the institutional definition.
 *
 *   Administration
 *       ├── identity (name, acronym, description)
 *       ├── missions (responsibilities, domain)
 *       ├── attachment (optional parent institution or ministry)
 *       └── detail page (optional dedicated page)
 *
 * The page works today with an empty or partial directory and welcomes the
 * official list later by filling the arrays below and matching messages —
 * no front-end rework needed.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A public administration or administrative body of the Republic. */
export type Administration = {
  /** Stable internal id. */
  id: string;
  /** Stable URL segment (`/republique/administrations/<slug>`). */
  slug: string;
  /** Official name of the administration. */
  name: string;
  /** Official acronym when one exists. */
  acronym?: string;
  /** Institutional description of the administration. */
  description: string;
  /** Main missions or areas of responsibility. */
  responsibilities?: ReadonlyArray<string>;
  /** Domain of intervention (policy area). */
  domain?: string;
  /** Parent institution when the attachment is officially defined. */
  parentInstitutionId?: string;
  /** Parent ministry when the attachment is officially defined. */
  parentMinistryId?: string;
  /** Dedicated page once published; omitted while unpublished. */
  href?: string;
  /** Official institutional website. */
  website?: string;
};

// ---------------------------------------------------------------------------
// Navigation paths
// ---------------------------------------------------------------------------

/** Sub-pages and related pages linked from this page. */
export const administrationPaths = {
  hub: "/republique/administrations",
  organisation: "/republique/organisation",
  constitution: "/republique/constitution",
  government: "/government",
  ministere: "/government/ministere",
  servicesPublics: "/services",
} as const;

// ---------------------------------------------------------------------------
// Data — the single source of truth
// ---------------------------------------------------------------------------

/**
 * Official list of public administrations of the Republic of Astoria.
 *
 * ⚠️ IMPORTANT: No administration, no direction, no agency, no authority,
 * no public institution, no ministry attachment, and no official website
 * must be invented. This array starts empty and will be populated
 * exclusively from official sources.
 *
 * The page renders a clean institutional "directory under construction" state
 * when the array is empty.
 */
export const administrations: ReadonlyArray<Administration> = [
  // Official administrations will be listed here once published.
];

// ---------------------------------------------------------------------------
// Distinctions — conceptual glossary for the page
// ---------------------------------------------------------------------------

/**
 * Conceptual distinctions displayed on the page to help citizens understand
 * the difference between an institution, a ministry, an administration and
 * a public service. Each item has a message key under `administrations.distinctions.items`.
 */
export const distinctionItems: ReadonlyArray<{ key: string }> = [
  { key: "institution" },
  { key: "ministry" },
  { key: "administration" },
  { key: "service" },
];

// ---------------------------------------------------------------------------
// Navigation links (related pages — only published)
// ---------------------------------------------------------------------------

/** Reference links at the bottom of the page. */
export const navigationLinks: ReadonlyArray<{ key: string; href: string }> = [
  { key: "organisation", href: administrationPaths.organisation },
  { key: "constitution", href: administrationPaths.constitution },
  { key: "government", href: administrationPaths.government },
  { key: "ministere", href: administrationPaths.ministere },
  { key: "services", href: administrationPaths.servicesPublics },
];
