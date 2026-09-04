/**
 * Content structure and data model of the `/republique/autorites-publiques`
 * institutional page.
 *
 * This page serves as the institutional directory of public authorities of the
 * Republic of Astoria. It is distinct from:
 *   - /republique/organisation (how the State is organised)
 *   - /republique/administrations (administrative structures)
 *   - /government (how the Government works)
 *   - /government/ministere (the ministerial departments)
 *   - /services-publics (the services accessible to citizens)
 *
 * A public authority is an entity to which the Constitution, a law or another
 * official text confers specific public competences or responsibilities.
 * Not all public structures are public authorities — only those with an
 * officially established status.
 *
 * Architecture:
 *   PublicAuthority
 *       ├── identity (name, acronym, description)
 *       ├── role and competences
 *       ├── legal basis
 *       ├── institutional attachment (optional)
 *       ├── independence status (when officially defined)
 *       └── detail page (optional dedicated page)
 *
 * The page works today with an empty directory and welcomes the official list
 * later by filling the arrays below and matching messages — no front-end
 * rework needed.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Independence or attachment status of a public authority, when officially
 * defined. Must never be inferred from the name or assumed from the type.
 */
export type AuthorityIndependence = "independent" | "attached" | "unknown";

/**
 * A public authority or body invested with specific public competences.
 */
export type PublicAuthority = {
  /** Stable internal id. */
  id: string;
  /** Stable URL segment (`/republique/autorites-publiques/<slug>`). */
  slug: string;
  /** Official name of the authority. */
  name: string;
  /** Official acronym when one exists. */
  acronym?: string;
  /** Institutional description of the authority. */
  description: string;
  /** Role or function of the authority within the State. */
  role?: string;
  /** Main competences or areas of responsibility. */
  responsibilities?: ReadonlyArray<string>;
  /** Official status or characterisation, when officially defined. */
  status?: string;
  /** Legal basis: constitutional articles, laws, decrees, etc. */
  legalBasis?: ReadonlyArray<string>;
  /** Parent institution when the attachment is officially defined. */
  parentInstitutionId?: string;
  /** Independence status — never inferred, always officially documented. */
  independence?: AuthorityIndependence;
  /** Dedicated page once published; omitted while unpublished. */
  href?: string;
  /** Official institutional website. */
  website?: string;
};

// ---------------------------------------------------------------------------
// Navigation paths
// ---------------------------------------------------------------------------

/** Sub-pages and related pages linked from this page. */
export const publicAuthorityPaths = {
  hub: "/republique/autorites-publiques",
  organisation: "/republique/organisation",
  constitution: "/republique/constitution",
  administrations: "/republique/administrations",
  government: "/government",
  ministere: "/government/ministere",
  servicesPublics: "/services",
} as const;

// ---------------------------------------------------------------------------
// Data — the single source of truth
// ---------------------------------------------------------------------------

/**
 * Official list of public authorities of the Republic of Astoria.
 *
 * ⚠️ IMPORTANT: No authority, no institution, no power, no competence, no
 * independence, no attachment, no mission, no person, no address, no website,
 * no legal basis, and no juridical status must be invented. This array starts
 * empty and will be populated exclusively from official sources.
 *
 * The page renders a clean institutional "directory under construction" state
 * when the array is empty.
 */
export const publicAuthorities: ReadonlyArray<PublicAuthority> = [
  // Official public authorities will be listed here once published.
];

// ---------------------------------------------------------------------------
// Distinctions — conceptual glossary for the page
// ---------------------------------------------------------------------------

/**
 * Conceptual distinctions displayed on the page to help citizens understand
 * the difference between a public authority, an administration, an institution
 * and a public service. Each item has a message key under
 * `autoritesPubliques.distinctions.items`.
 */
export const distinctionItems: ReadonlyArray<{ key: string }> = [
  { key: "institution" },
  { key: "administration" },
  { key: "authority" },
  { key: "service" },
];

// ---------------------------------------------------------------------------
// Navigation links (related pages — only published)
// ---------------------------------------------------------------------------

/** Reference links at the bottom of the page. */
export const navigationLinks: ReadonlyArray<{ key: string; href: string }> = [
  { key: "organisation", href: publicAuthorityPaths.organisation },
  { key: "constitution", href: publicAuthorityPaths.constitution },
  { key: "administrations", href: publicAuthorityPaths.administrations },
  { key: "government", href: publicAuthorityPaths.government },
  { key: "ministere", href: publicAuthorityPaths.ministere },
  { key: "services", href: publicAuthorityPaths.servicesPublics },
];
