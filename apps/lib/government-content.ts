import { sectionPaths } from "./site-structure";

/**
 * Content structure of the `/government` institutional overview page.
 *
 * Like `home-content.ts` for the home page, this file centralises the
 * *structure* of the page (which institutional components are listed, in
 * which order, towards which destination) while every word rendered comes
 * from the message catalogs (see `government.*` in `apps/messages/`).
 *
 * Linking principle of this page: a row only carries an `href` when its
 * dedicated page is actually published — no dead links. Destinations that
 * are planned but not published yet (Conseil des ministres, ministères,
 * agenda, décisions…) are presented as institutional concepts without a
 * link: wiring them later only means adding the `href` here (and in the
 * navigation), no page rework.
 */

/** Government sub-pages currently published under `/government`. */
export const governmentPaths = {
  composition: "/government/composition",
  organisation: "/government/organisation",
  ministere: "/government/ministere",
} as const;

/** A row of the page: message key prefix + optional published destination. */
export type GovernmentContentItem = {
  /**
   * Message key prefix under the current section — `<section>.items.<key>`
   * carries the `title` and `text` messages.
   */
  key: string;
  /** Destination of the row. Omit it while the dedicated page is unpublished. */
  href?: string;
  /** Set for absolute (out-of-portal) destinations rendered as plain links. */
  external?: boolean;
};

/**
 * « Le Gouvernement » — the four key notions used to explain what the
 * Government is, mirrored by `government.understand.items.<key>`.
 */
export const understandItems: ReadonlyArray<GovernmentContentItem> = [
  { key: "executive" },
  { key: "direction" },
  { key: "membres" },
  { key: "administrations" },
];

/**
 * « L'organisation du Gouvernement » — the components of the executive,
 * each becoming a link as soon as its dedicated page is published.
 */
export const organisationItems: ReadonlyArray<GovernmentContentItem> = [
  { key: "president" },
  { key: "gouvernement" },
  { key: "composition", href: governmentPaths.composition },
  { key: "conseil" },
  { key: "ministeres", href: governmentPaths.ministere },
  { key: "secretariats" },
  { key: "administrations" },
];

/**
 * « L'action du Gouvernement » — how public action is shaped. Kept distinct
 * from the dedicated « L'action publique » hub, which this page only points
 * to.
 */
export const actionItems: ReadonlyArray<GovernmentContentItem> = [
  { key: "priorites" },
  { key: "politiquesPubliques" },
  { key: "reformes" },
  { key: "grandsDossiers" },
  { key: "engagements" },
  { key: "resultats", href: sectionPaths.suiviDesEngagements },
];

/**
 * « Informations gouvernementales » — the secondary resources of the
 * section. Only published destinations are linked.
 */
export const infoItems: ReadonlyArray<GovernmentContentItem> = [
  {
    key: "donnees",
    href: "https://data.gouv.aor/",
    external: true,
  },
  { key: "participation", href: sectionPaths.participation },
  { key: "ressources", href: sectionPaths.liensUtiles },
];

/**
 * « Les ministères » — record feed slot.
 *
 * Once the official list of ministries exists, fill this array with stable
 * keys (`name`, `href`, …): each entry will render as a row powered by the
 * `government.ministries.records.<key>` messages, without touching the page.
 * While empty, the section shows its institutional empty state.
 */
export type MinistryRecord = {
  key: string;
  href?: string;
};

export const ministryRecords: ReadonlyArray<MinistryRecord> = [];

/**
 * « Conseil des ministres » — feed slot for published councils.
 *
 * Fill with the councils published by the editorial chain (agenda, décisions,
 * comptes rendus, archives) when they become available. Each record renders
 * through `government.council.records.<key>` messages; while empty the
 * section shows a clean institutional empty state.
 */
export type CouncilRecord = {
  key: string;
  isoDate?: string;
  href?: string;
};

export const councilRecords: ReadonlyArray<CouncilRecord> = [];

/**
 * « Agenda & travaux » — production channels of the Government. Message keys
 * are `government.productions.channels.<key>`; none of these spaces has a
 * published page yet, so no `href` is set.
 */
export const productionChannels: ReadonlyArray<GovernmentContentItem> = [
  { key: "agenda" },
  { key: "decisions" },
  { key: "discours" },
  { key: "communiques" },
  { key: "publications" },
];
