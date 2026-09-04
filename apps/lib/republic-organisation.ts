/**
 * Content structure of the `/republique/organisation` institutional page.
 *
 * This page presents the general organisation of the State: how institutions,
 * the Government, ministries and administrations fit together. It does NOT
 * duplicate /government, /government/composition, or /government/ministere —
 * it provides the institutional overview to which those pages are linked.
 *
 * Linking principle (same as all institutional pages): an entry only carries
 * an `href` when its dedicated page is actually published — no dead links.
 */

/** Paths of the institutional pages linked from this page. */
export const organisationPaths = {
  constitution: "/republique/constitution",
  government: "/government",
  composition: "/government/composition",
  ministere: "/government/ministere",
  membres: "/government/membres",
  biographies: "/government/biographies",
} as const;

/** An institution or structural component of the State. */
export type InstitutionItem = {
  key: string;
  /** Only set when the destination page is published. */
  href?: string;
};

/** The main institutions of the Republic. */
export const institutions: ReadonlyArray<InstitutionItem> = [
  { key: "constitution", href: organisationPaths.constitution },
  { key: "president", href: organisationPaths.government },
  { key: "government", href: organisationPaths.government },
];

/** The Government as a component of the State's organisation. */
export const governmentComponent: InstitutionItem = {
  key: "government",
  href: organisationPaths.government,
};

/** Distinctions between institutional levels. */
export const distinctions: ReadonlyArray<InstitutionItem> = [
  { key: "government" },
  { key: "ministry" },
  { key: "administration" },
];

/** Navigation links at the end of the page (only published pages). */
export const navigationLinks: ReadonlyArray<InstitutionItem> = [
  { key: "constitution", href: organisationPaths.constitution },
  { key: "government", href: organisationPaths.government },
  { key: "composition", href: organisationPaths.composition },
  { key: "ministere", href: organisationPaths.ministere },
  { key: "membres", href: organisationPaths.membres },
  { key: "biographies", href: organisationPaths.biographies },
];
