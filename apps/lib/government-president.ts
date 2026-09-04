/**
 * Content structure of the `/government/liamvonastoria` presidential page.
 *
 * Same architecture as the other institutional pages: the *structure* lives
 * here, every UI word comes from the message catalogs (`president.*` in
 * `apps/messages/`), and no data is ever invented.
 *
 * The page presents the President first as an institutional office — the
 * central executive office of the Astorian model — and the current holder
 * only as the person exercising it today. The holder is not hardcoded in the
 * page: it is joined from the shared data model (`government-ministries.ts`
 * via `government-members.ts`), so a future succession is a data update (an
 * `endDate` on the current holder, a new `OfficeHolder`), never a rework of
 * this page.
 *
 * Biographical content, agenda, speeches and news are not rendered: no
 * official data is published yet, and none is invented. The page is built as
 * a clean base ready to welcome them.
 */

/** Sub-pages related to this page (all currently published). */
export const presidentPaths = {
  hub: "/government",
  composition: "/government/composition",
  membres: "/government/membres",
  ministere: "/government/ministere",
  index: "/government/liamvonastoria",
} as const;

/**
 * « Les responsabilités du Président » — the responsibilities defined by the
 * Astorian institutional model, message keys under
 * `president.responsibilities.items.<key>`. Every wording is grounded in the
 * institutional texts already published on the portal (the President is the
 * Head of State, exercises executive power, directs and coordinates the
 * Government and gives government action its direction).
 */
export const responsibilityItems: ReadonlyArray<{ key: string }> = [
  { key: "chefEtat" },
  { key: "executif" },
  { key: "direction" },
  { key: "impulsion" },
];

/** « Institutions liées » — natural outbound links (published pages). */
export const relatedItems: ReadonlyArray<{ key: string; href: string }> = [
  { key: "government", href: presidentPaths.hub },
  { key: "composition", href: presidentPaths.composition },
  { key: "membres", href: presidentPaths.membres },
  { key: "ministere", href: presidentPaths.ministere },
];