/**
 * Content structure and data model of the `/government/membres` page.
 *
 * Same architecture as the other institutional pages: the *structure* lives
 * here, every UI word comes from the message catalogs (`membres.*` in
 * `apps/messages/`), and no data is ever invented.
 *
 * Data model — shared with `government-ministries.ts`:
 *
 *   PERSONNE (temporaire)          PERSONNE (temporaire)
 *        │                              │
 *        ▼                              ▼
 *   TITULAIRE (OfficeHolder) ────> FONCTION (GovernmentOffice) ────> MINISTÈRE
 *   (début / fin du mandat)      (président, ministre, secrétaire…)
 *
 * A person holds a post over a given period; a post is attached to a
 * ministry. Changing the office holder never touches the institution, and
 * replacing a government is a data update (past holders are kept through
 * `endDate`), not a site rework.
 *
 * The page answers “who currently holds the government offices?” — the third
 * level of the INSTITUTION → FONCTION → TITULAIRE chain presented by
 * `/government/composition`. Today no appointment is published: the page
 * shows its institutional empty state and `getCurrentGovernment()` returns
 * no member, without ever displaying fake numbers.
 */

import {
  governmentOffices,
  ministries,
  officeHolders,
  persons,
  type GovernmentOffice,
  type Ministry,
  type OfficeHolder,
  type Person,
} from "./government-ministries";

/** Sub-pages related to this page (all currently published). */
export const governmentMembersPaths = {
  hub: "/government",
  composition: "/government/composition",
  ministere: "/government/ministere",
  index: "/government/membres",
} as const;

/** One currently exercised post: the office, its holder and the person. */
export type OfficeMembership = {
  office: GovernmentOffice;
  holder: OfficeHolder;
  person: Person;
  /** Ministry the post is attached to, when the post has one. */
  ministry?: Ministry;
};

/** The Government as currently constituted, grouped by post type. */
export type CurrentGovernment = {
  /** The President of the Republic, presented separately from the others. */
  president?: OfficeMembership;
  ministers: ReadonlyArray<OfficeMembership>;
  secretaries: ReadonlyArray<OfficeMembership>;
};

/**
 * Joins the shared data sources into the current Government. Only posts with
 * an active holder (no `endDate`) are returned; entries pointing to an
 * unknown office or person are skipped (data integrity). Empty while the
 * Government is not constituted.
 */
export function getCurrentGovernment(): CurrentGovernment {
  const memberships = officeHolders
    .filter((holder) => holder.endDate === undefined)
    .flatMap((holder): OfficeMembership[] => {
      const office = governmentOffices.find((o) => o.id === holder.officeId);
      const person = persons.find((p) => p.id === holder.personId);
      if (!office || !person) {
        return [];
      }
      return [
        {
          office,
          holder,
          person,
          ministry: office.ministryId
            ? ministries.find((m) => m.id === office.ministryId)
            : undefined,
        },
      ];
    });

  return {
    president: memberships.find((membership) => membership.office.type === "president"),
    ministers: memberships.filter((membership) => membership.office.type === "minister"),
    secretaries: memberships.filter((membership) => membership.office.type === "state-secretary"),
  };
}

/**
 * Dedicated page of a member, when published. The President has a fixed
 * presidential page (`/government/<slug>`); the other members' future pages
 * follow `/government/membres/<slug>`. Returns `undefined` while the page is
 * unpublished — no dead links.
 */
export function getMemberProfileHref(membership: OfficeMembership): string | undefined {
  if (!membership.person.slug) {
    return undefined;
  }
  return membership.office.type === "president"
    ? `/government/${membership.person.slug}`
    : `${governmentMembersPaths.index}/${membership.person.slug}`;
}

/** « Pour aller plus loin » — natural outbound links (published pages). */
export const relatedItems: ReadonlyArray<{ key: string; href: string }> = [
  { key: "government", href: governmentMembersPaths.hub },
  { key: "composition", href: governmentMembersPaths.composition },
  { key: "ministere", href: governmentMembersPaths.ministere },
];