/**
 * Content structure of the `/government/composition` institutional page.
 *
 * Like `government-content.ts` for `/government`, this file centralises the
 * *structure* of the page (which groups are shown, in which order, towards
 * which destination) while every word rendered comes from the message
 * catalogs (see `composition.*` in `apps/messages/`).
 *
 * Data model — institutions and people are never mixed:
 *
 *   INSTITUTION (Gouvernement, ministère, fonction constitutionnelle…)
 *        │  exists independently of any holder
 *   POSTE / FONCTION
 *        │  defines the institutional responsibility
 *   PERSONNE
 *        └─ may hold a post for a given period
 *
 * The page must work today, without any office holder, and welcome the real
 * Government later without any front-end rework: feed the empty arrays below
 * (and the matching `composition.*` messages) and the sections will render
 * the entries with their rows and links.
 *
 * Linking principle (same as `/government`): an entry only carries an `href`
 * when its dedicated page is actually published — no dead links.
 */

/** Composition sub-pages currently published (siblings of this page). */
export const compositionPaths = {
  hub: "/government",
  organisation: "/government/organisation",
  membres: "/government/membres",
} as const;

/** A row of the page: message key prefix + optional published destination. */
export type CompositionEntry = {
  /**
   * Message key prefix under the current section —
   * `<section>.items.<key>` or `<section>.entries.<key>` carries `title` and
   * `text` messages.
   */
  key: string;
  /** Destination of the row. Omit it while the dedicated page is unpublished. */
  href?: string;
};

/**
 * The President of the Republic — an institutional office rendered on its
 * own, independently of who holds it.
 *
 * The office itself is constitutional and always displayed. Its holder is a
 * separate object: fill this slot (personId, name, href…) when the official
 * appointment is published. While `null`, the section shows a neutral
 * institutional empty state.
 */
export type PresidentHolder = {
  personId: string;
  /** Display name of the current office holder (data, not a message key). */
  name: string;
  /** Institutional page of the holder once published. */
  href?: string;
  /** Official portrait once an official source exists. */
  portraitHref?: string;
};

export const presidentHolder: PresidentHolder | null = {
  personId: "liam-von-astoria",
  name: "Liam Von Astoria",
  href: "/government/liamvonastoria",
};

/**
 * « Les ministres » — roster feed slot.
 *
 * Fill with the ministers (and, later, the holders of each ministerial post)
 * when the Government is officially formed: each entry renders a row powered
 * by the `composition.ministers.entries.<key>` messages. While empty, the
 * section shows its institutional empty state.
 */
export const ministerEntries: ReadonlyArray<CompositionEntry> = [];

/**
 * « Les secrétaires d'État » — roster feed slot, same logic as ministers.
 * Messages live under `composition.secretaries.entries.<key>`.
 */
export const secretaryEntries: ReadonlyArray<CompositionEntry> = [];

/**
 * « Les ministères » — institutional feed slot.
 *
 * Ministries are presented as departments of the State, independently of
 * their holders. Messages live under `composition.ministries.entries.<key>`.
 */
export const ministryEntries: ReadonlyArray<CompositionEntry> = [];

/**
 * « Gouvernement, ministère, administration » — the three levels the
 * composition page distinguishes, as plain institutional definitions.
 */
export const distinctionItems: ReadonlyArray<CompositionEntry> = [
  { key: "gouvernement" },
  { key: "ministere" },
  { key: "administration" },
];

/** « Comprendre le Gouvernement » — natural outbound links (published pages). */
export const relatedItems: ReadonlyArray<CompositionEntry> = [
  { key: "government", href: compositionPaths.hub },
  { key: "organisation", href: compositionPaths.organisation },
  { key: "membres", href: compositionPaths.membres },
];
