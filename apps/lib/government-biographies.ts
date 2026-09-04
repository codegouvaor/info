/**
 * Content structure and data model of the `/government/biographies`
 * institutional page.
 *
 * Same architecture as the other government pages: the *structure* lives
 * here, every UI word comes from the message catalogs (`biographies.*` in
 * `apps/messages/`), and no data is ever invented.
 *
 * The page answers « who are the officials who make up or have made up the
 * Government, and what is their institutional background? » — complementing
 * `/government/membres` (which answers « who currently holds the government
 * offices? ») with biographical context.
 *
 * Data model — same shared types as `government-ministries.ts`:
 *
 *   PERSONNE (temporaire)
 *        │
 *   TITULAIRE (OfficeHolder) ────> FONCTION (GovernmentOffice)
 *   (début / fin du mandat)      (président, ministre, secrétaire…)
 *
 * A person may hold several posts over their career. The biography
 * documents the person within the framework of these functions.
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
export const biographiesPaths = {
  hub: "/government",
  membres: "/government/membres",
  composition: "/government/composition",
  ministere: "/government/ministere",
  index: "/government/biographies",
} as const;

/**
 * One biographical profile: a person, their current or past government
 * function(s), and associated ministry. This is the data unit rendered by
 * each card / row on the biographies page.
 */
export type BiographyProfile = {
  person: Person;
  /** Current government office membership, when the person is currently in office. */
  currentOffice?: GovernmentOffice;
  /** Current office holder data, when the person is currently in office. */
  currentHolder?: OfficeHolder;
  /** Ministry the current post is attached to, when applicable. */
  currentMinistry?: Ministry;
  /**
   * Whether the person is currently in office. Determined from the OfficeHolder
   * dates (endDate === undefined), not from an arbitrary flag.
   */
  isActive: boolean;
  /**
   * Dedicated biography page path, when published. The President has a fixed
   * page at `/government/liamvonastoria`; other profiles will follow
   * `/government/biographies/<slug>`. `undefined` while unpublished.
   */
  profileHref?: string;
};

/**
 * Builds the list of biographical profiles from the shared data model.
 * Currently active office holders are listed first, then past holders.
 * Only persons with at least one office holder record are included.
 *
 * No data is invented: if no person or office is found for a holder record,
 * that record is silently skipped (data integrity).
 */
export function getAllBiographies(): ReadonlyArray<BiographyProfile> {
  const profiles = new Map<string, BiographyProfile>();

  for (const holder of officeHolders) {
    const office = governmentOffices.find((o) => o.id === holder.officeId);
    const person = persons.find((p) => p.id === holder.personId);
    if (!office || !person) continue;

    const isActive = holder.endDate === undefined;
    const existing = profiles.get(person.id);

    if (!existing) {
      const ministry = office.ministryId
        ? ministries.find((m) => m.id === office.ministryId)
        : undefined;

      profiles.set(person.id, {
        person,
        currentOffice: isActive ? office : undefined,
        currentHolder: isActive ? holder : undefined,
        currentMinistry: isActive ? ministry : undefined,
        isActive,
        profileHref: getBiographyProfileHref(person, office),
      });
    } else if (isActive && !existing.isActive) {
      // Upgrade to active if a current holder record is found
      const ministry = office.ministryId
        ? ministries.find((m) => m.id === office.ministryId)
        : undefined;
      existing.currentOffice = office;
      existing.currentHolder = holder;
      existing.currentMinistry = ministry;
      existing.isActive = true;
    }
  }

  // Active profiles first, then inactive — both alphabetical by name
  const sorted = [...profiles.values()].sort((a, b) => {
    if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
    const nameA = `${a.person.firstName} ${a.person.lastName}`;
    const nameB = `${b.person.firstName} ${b.person.lastName}`;
    return nameA.localeCompare(nameB);
  });

  return sorted;
}

/**
 * Returns only currently active biographies (persons with no endDate on
 * their current holder record).
 */
export function getActiveBiographies(): ReadonlyArray<BiographyProfile> {
  return getAllBiographies().filter((p) => p.isActive);
}

/**
 * Returns only past biographies (persons whose current holder record has
 * an endDate, or who have no current active record).
 */
export function getPastBiographies(): ReadonlyArray<BiographyProfile> {
  return getAllBiographies().filter((p) => !p.isActive);
}

/**
 * Resolves the profile href for a person. The President has a dedicated
 * page at `/government/<slug>`; other profiles will follow
 * `/government/biographies/<slug>` when their pages are published.
 */
function getBiographyProfileHref(person: Person, office: GovernmentOffice): string | undefined {
  if (!person.slug) return undefined;
  if (office.type === "president") {
    return `/government/${person.slug}`;
  }
  return `${biographiesPaths.index}/${person.slug}`;
}

/** « Pour aller plus loin » — natural outbound links (published pages). */
export const relatedItems: ReadonlyArray<{ key: string; href: string }> = [
  { key: "government", href: biographiesPaths.hub },
  { key: "membres", href: biographiesPaths.membres },
  { key: "composition", href: biographiesPaths.composition },
  { key: "ministere", href: biographiesPaths.ministere },
];
