/**
 * Content structure and data model of the `/government/ministere`
 * institutional page.
 *
 * Same architecture as `government-composition.ts`: the *structure* of the
 * page lives here, every UI word comes from the message catalogs
 * (`ministere.*` in `apps/messages/`), and no data is ever invented.
 *
 * Data model — institutions and people are never mixed:
 *
 *   MINISTÈRE (institution)
 *        │  exists independently of any holder
 *   FONCTION GOUVERNEMENTALE (poste)
 *        │  e.g. « Ministre de l'Économie » or a secretary of state
 *   PERSONNE
 *        └─ may hold a post for a given period (OfficeHolder)
 *
 * A ministry is a department of State: it exists even when no minister is
 * appointed, it survives changes of Government, and its dedicated page (to
 * come at `/government/ministere/[slug]`) describes the institution — the
 * holder is only a secondary piece of information.
 *
 * The page works today without any ministry defined (it renders its
 * institutional empty state) and welcomes the official list later by filling
 * the arrays below and the matching messages — no front-end rework. Linking
 * principle (same as `/government`): an entry only carries an `href` when its
 * dedicated page is actually published — no dead links.
 */

/** Sub-pages related to this page (all currently published). */
export const ministryPaths = {
  hub: "/government",
  composition: "/government/composition",
  organisation: "/government/organisation",
  index: "/government/ministere",
} as const;

/**
 * A ministry — the department of State in charge of an area of public policy.
 * The institution exists independently of its office holder.
 */
export type Ministry = {
  id: string;
  /** Stable URL segment of the dedicated page (`/government/ministere/<slug>`). */
  slug: string;
  /** Official name of the ministry (data, not a UI label). */
  name: string;
  /** Institutional description of the ministry (data). */
  description: string;
  /** Main areas of responsibility of the ministry (data). */
  responsibilities: ReadonlyArray<string>;
  /** Dedicated page once published; omitted while unpublished (no dead link). */
  href?: string;
};

/**
 * A post within the Government. The President of the Republic is a post like
 * the others in this model — an institutional function a person may hold —
 * even though the members page presents it separately (it is the central
 * executive office of the Astorian model, not a ministry post).
 */
export type GovernmentOfficeType = "president" | "minister" | "state-secretary";

export type GovernmentOffice = {
  id: string;
  /**
   * Message key of the official title of the post (resolved under
   * `government.offices`), e.g. `president` → « Président de la République ».
   * Titles are institutional words and must be localizable.
   */
  titleKey: string;
  type: GovernmentOfficeType;
  /** Ministry the post belongs to, when it is attached to one. */
  ministryId?: string;
};

/**
 * A person — may hold one or more government posts over time. Names are data
 * (never translated); the optional `slug` and `photo` feed the future
 * individual pages (`/government/membres/<slug>`) and official portraits.
 */
export type Person = {
  id: string;
  /** Stable URL segment of the future individual page, when published. */
  slug?: string;
  firstName: string;
  lastName: string;
  /** Official portrait once an official source exists. */
  photo?: string;
};

/** A person holding a government post over a given period. */
export type OfficeHolder = {
  officeId: string;
  personId: string;
  startDate?: string;
  endDate?: string;
};

/**
 * Official list of ministries. Empty until the ministries are officially
 * defined: the pages then show their institutional empty states instead of
 * inventing portfolios. Fill this array (and set `href` once the dedicated
 * pages are published) to publish the directory.
 */
export const ministries: ReadonlyArray<Ministry> = [];

/**
 * Government posts currently defined. Today only the presidency is
 * officially established: replacing the president later means adding an
 * `endDate` to the current holder and a new `OfficeHolder` — never touching
 * the office itself or the pages.
 */
export const governmentOffices: ReadonlyArray<GovernmentOffice> = [
  {
    id: "president-of-the-republic",
    titleKey: "president",
    type: "president",
  },
];

/**
 * The people appearing on the pages. The current President of the Republic
 * is the only person officially published so far, with his official
 * portrait (`apps/public/liamvonastoria.jpeg`).
 */
export const persons: ReadonlyArray<Person> = [
  {
    id: "liam-von-astoria",
    slug: "liamvonastoria",
    firstName: "Liam",
    lastName: "Von Astoria",
    photo: "/liamvonastoria.jpeg",
  },
];

/**
 * Current and past holders of each post (temporal data: a post can be held
 * successively by several people, the previous holder is never overwritten).
 * The start date of the current presidential mandate is not published yet,
 * so it is omitted rather than invented.
 */
export const officeHolders: ReadonlyArray<OfficeHolder> = [
  {
    officeId: "president-of-the-republic",
    personId: "liam-von-astoria",
  },
];

/** « Comprendre » rows — message keys under `ministere.understand.items`. */
export const understandItems: ReadonlyArray<{ key: string }> = [
  { key: "institution" },
  { key: "minister" },
  { key: "administrations" },
];

/** « Pour aller plus loin » — natural outbound links (published pages). */
export const relatedItems: ReadonlyArray<{ key: string; href: string }> = [
  { key: "government", href: ministryPaths.hub },
  { key: "composition", href: ministryPaths.composition },
  { key: "organisation", href: ministryPaths.organisation },
];