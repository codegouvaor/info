/**
 * Constitutional data structure for the Republic of Astoria.
 *
 * The Constitution is treated as a primary legal source: the data model
 * supports titles, chapters, sections and articles, but the *content*
 * must come exclusively from official sources published in this project.
 *
 * When the full constitutional text is not yet available, the page renders
 * a clean institutional "pending publication" state rather than any
 * fabricated content.
 *
 * Architecture:
 *   constitution (version, dates, preamble)
 *       └── titles[]
 *             └── chapters[]
 *                   └── sections[]
 *                         └── articles[]
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A constitutional article — the atomic unit of the text. */
export type ConstitutionArticle = {
  /** Stable anchor id (e.g. "article-1"). */
  id: string;
  /** Human-readable number (e.g. "1", "2", "3…"). */
  number: string;
  /** Full official text of the article. */
  content: string;
};

/** A section within a chapter (optional nesting level). */
export type ConstitutionSection = {
  id: string;
  number: string;
  title: string;
  articles: ReadonlyArray<ConstitutionArticle>;
};

/** A chapter within a title. */
export type ConstitutionChapter = {
  id: string;
  number: string;
  title: string;
  sections?: ReadonlyArray<ConstitutionSection>;
  articles: ReadonlyArray<ConstitutionArticle>;
};

/** A title of the Constitution. */
export type ConstitutionTitle = {
  id: string;
  number: string;
  title: string;
  chapters?: ReadonlyArray<ConstitutionChapter>;
  articles: ReadonlyArray<ConstitutionArticle>;
};

/** Metadata about a constitutional revision. */
export type ConstitutionRevision = {
  id: string;
  date: string;
  description: string;
};

/**
 * Top-level constitutional document.
 *
 * All fields are optional except `title` because the full text may not
 * be published yet. When `published` is `false`, the page renders the
 * institutional pending state.
 */
export type Constitution = {
  /** Official title of the text. */
  title: string;
  /** Whether the full constitutional text is available for display. */
  published: boolean;
  /** Version or consolidation reference (e.g. "Texte en vigueur au 1ᵉʳ janvier 2026"). */
  version?: string;
  /** Date of adoption (ISO 8601 or display string — never fabricated). */
  adoptedAt?: string;
  /** Date of promulgation. */
  promulgatedAt?: string;
  /** Date of entry into force. */
  effectiveAt?: string;
  /** Official preamble text, separate from the articles. */
  preamble?: string;
  /** Hierarchical structure of the constitutional text. */
  titles: ReadonlyArray<ConstitutionTitle>;
  /** Revisions history, if any. */
  revisions?: ReadonlyArray<ConstitutionRevision>;
};

// ---------------------------------------------------------------------------
// Data — the single source of truth
// ---------------------------------------------------------------------------

/**
 * The constitutional text of the Republic of Astoria.
 *
 * ⚠️ IMPORTANT: No article, no preamble, no date, and no institutional
 * content must be invented. This object starts empty (`published: false`,
 * `titles: []`) and will be populated exclusively from official sources
 * once they are made available.
 */
export const constitution: Constitution = {
  title: "Constitution de la République d'Astoria",
  published: false,
  titles: [],
};

// ---------------------------------------------------------------------------
// Navigation helpers
// ---------------------------------------------------------------------------

/** Return the flat list of all articles across all titles. */
export function getAllArticles(): ReadonlyArray<ConstitutionArticle> {
  const articles: ConstitutionArticle[] = [];

  for (const title of constitution.titles) {
    for (const article of title.articles) {
      articles.push(article);
    }

    if (title.chapters) {
      for (const chapter of title.chapters) {
        for (const article of chapter.articles) {
          articles.push(article);
        }

        if (chapter.sections) {
          for (const section of chapter.sections) {
            for (const article of section.articles) {
              articles.push(article);
            }
          }
        }
      }
    }
  }

  return articles;
}
