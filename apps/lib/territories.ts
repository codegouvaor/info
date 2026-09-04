/**
 * Content structure and data model of the `/republique/territoires`
 * institutional page.
 *
 * This page serves as the institutional reference for the territorial
 * organisation of the Republic of Astoria. It is distinct from:
 *   - /republique/organisation (how the State is organised)
 *   - /republique/administrations (administrative structures)
 *   - /republique/autorites-publiques (public authorities)
 *   - /services-publics (public services accessible to citizens)
 *
 * Architecture:
 *   A territory is a geographic portion defined by the organisation of the
 *   Republic. It exists independently of any person or authority — a change
 *   of leadership or administration never modifies the institutional
 *   definition of a territory.
 *
 *   Territory
 *       ├── identity (name, type, description)
 *       ├── competences (when officially defined)
 *       ├── parent territory (optional hierarchy)
 *       ├── institutional authority (optional)
 *       └── detail page (optional dedicated page)
 *
 * The page works today with an empty or partial directory and welcomes the
 * official list later by filling the arrays below and matching messages —
 * no front-end rework needed.
 *
 * ⚠️ IMPORTANT: No territory, no level, no competence, no authority, no
 * person, no population, no area, no address, no website must be invented.
 * This data starts empty and will be populated exclusively from official
 * sources.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A territory or territorial entity of the Republic. */
export type Territory = {
  /** Stable internal id. */
  id: string;
  /** Stable URL segment (`/republique/territoires/<slug>`). */
  slug: string;
  /** Official name of the territory. */
  name: string;
  /** Official type or category of territory (when defined). */
  type?: string;
  /** Institutional description of the territory. */
  description: string;
  /** Main competences exercised on this territory (when officially defined). */
  responsibilities?: ReadonlyArray<string>;
  /** Parent territory when the hierarchy is officially defined. */
  parentTerritoryId?: string;
  /** Institutional authority responsible for this territory (when defined). */
  institutionalAuthority?: string;
  /** Dedicated page once published; omitted while unpublished. */
  href?: string;
  /** Official institutional website. */
  website?: string;
};

/** A level or tier in the territorial hierarchy. */
export type TerritoryLevel = {
  /** Stable internal id. */
  id: string;
  /** Official name of this level. */
  name: string;
  /** Institutional description of the level. */
  description: string;
  /** Main competences exercised at this level (when officially defined). */
  responsibilities?: ReadonlyArray<string>;
  /** Institution responsible at this level (when defined). */
  institutionalAuthority?: string;
};

// ---------------------------------------------------------------------------
// Navigation paths
// ---------------------------------------------------------------------------

/** Sub-pages and related pages linked from this page. */
export const territoryPaths = {
  hub: "/republique/territoires",
  organisation: "/republique/organisation",
  constitution: "/republique/constitution",
  administrations: "/republique/administrations",
  autoritesPubliques: "/republique/autorites-publiques",
  government: "/government",
  servicesPublics: "/services",
} as const;

// ---------------------------------------------------------------------------
// Data — the single source of truth
// ---------------------------------------------------------------------------

/**
 * Official territorial levels of the Republic of Astoria.
 *
 * ⚠️ IMPORTANT: No level, no hierarchy, no subdivision must be invented.
 * This array starts empty and will be populated exclusively from official
 * sources.
 */
export const territoryLevels: ReadonlyArray<TerritoryLevel> = [
  // Official territorial levels will be listed here once published.
];

/**
 * Official list of territories of the Republic of Astoria.
 *
 * ⚠️ IMPORTANT: No territory, no population, no area, no authority, no
 * address, no website must be invented. This array starts empty and will
 * be populated exclusively from official sources.
 *
 * The page renders a clean institutional "directory under construction" state
 * when the array is empty.
 */
export const territories: ReadonlyArray<Territory> = [
  // Official territories will be listed here once published.
];

// ---------------------------------------------------------------------------
// Distinctions — conceptual glossary for the page
// ---------------------------------------------------------------------------

/**
 * Conceptual distinctions displayed on the page to help citizens understand
 * the difference between a territory, a territorial authority, an
 * administration and a public service. Each item has a message key under
 * `territoires.distinctions.items`.
 */
export const distinctionItems: ReadonlyArray<{ key: string }> = [
  { key: "territory" },
  { key: "territorialAuthority" },
  { key: "administration" },
  { key: "service" },
];

// ---------------------------------------------------------------------------
// Navigation links (related pages — only published)
// ---------------------------------------------------------------------------

/** Reference links at the bottom of the page. */
export const navigationLinks: ReadonlyArray<{ key: string; href: string }> = [
  { key: "organisation", href: territoryPaths.organisation },
  { key: "constitution", href: territoryPaths.constitution },
  { key: "administrations", href: territoryPaths.administrations },
  { key: "autorites", href: territoryPaths.autoritesPubliques },
  { key: "government", href: territoryPaths.government },
  { key: "services", href: territoryPaths.servicesPublics },
];
