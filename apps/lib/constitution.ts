/**
 * Constitutional data structure for the Republic of Astoria.
 *
 * The Constitution is treated as a primary legal source: the data model
 * supports titles, chapters, sections and articles, but the *content*
 * must come exclusively from official sources published in this project.
 *
 * When the full constitutional text is not yet available, the pages render
 * a clean institutional "pending publication" state rather than any
 * fabricated content.
 *
 * Architecture:
 *   constitution (version, dates, preamble)
 *       └── titles[]
 *             └── chapters[]
 *                   └── sections[]
 *                         └── articles[]
 *
 * Each article may optionally carry an *explanation* (pedagogical content
 * that is clearly separated from the official text). Explanations are
 * editorial content and must never be presented as the legal text itself.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A constitutional article — the atomic unit of the text. */
export type ConstitutionArticle = {
  /**
   * Stable identifier. Doubles as the in-page anchor (`#article-1`) and as
   * the `[slug]` of the explanatory fiche page
   * (`/republique/constitution/article-1`). Keep it URL-safe and unique.
   */
  id: string;
  /** Human-readable number (e.g. "1", "2", "3…"). */
  number: string;
  /**
   * Optional short official heading of the article, when the official text
   * itself carries one. Never inferred.
   */
  title?: string;
  /** Full official text of the article. */
  content: string;
  /**
   * Optional pedagogical explanation of the article. Editorial content,
   * rendered separately from the official text.
   */
  explanation?: ConstitutionExplanation;
};

/** Editorial material that helps understand a provision. */
export type ConstitutionExplanation = {
  /** Plain-language overview ("Comprendre cet article"). */
  summary?: string;
  /** Detailed explanation ("Ce que prévoit cet article"). */
  content?: string;
  /** Key points to remember ("À retenir"). */
  keyPoints?: ReadonlyArray<string>;
  /**
   * Ids of constitutionally related articles (e.g. "article-41").
   * Only officially established relations must be listed.
   */
  relatedArticles?: ReadonlyArray<string>;
  /**
   * Officially established links to related institutional pages
   * (e.g. the page of the institution the article organises).
   */
  references?: ReadonlyArray<ConstitutionReference>;
};

/** A reference towards another official page of the portal. */
export type ConstitutionReference = {
  label: string;
  href: string;
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
 * be published yet. When `published` is `false`, the pages render the
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

/**
 * Where an article sits inside the constitutional document.
 * `title` is always defined; `chapter` and `section` are defined only when
 * the article lives at that nesting level.
 */
export type ConstitutionArticleLocation = {
  article: ConstitutionArticle;
  title: ConstitutionTitle;
  chapter: ConstitutionChapter | null;
  section: ConstitutionSection | null;
};

/**
 * One linear block of the readable document, in official reading order.
 * The flattened form keeps the reader page simple to render while preserving
 * the exact structural hierarchy of the text.
 */
export type ConstitutionDocumentBlock =
  | {
      kind: "preamble";
      id: string;
      title: string;
      text: string;
    }
  | {
      kind: "title";
      id: string;
      number: string;
      title: string;
    }
  | {
      kind: "chapter";
      id: string;
      number: string;
      title: string;
    }
  | {
      kind: "section";
      id: string;
      number: string;
      title: string;
    }
  | {
      kind: "article";
      /** Reading-order position of the article inside the document. */
      index: number;
      /** Position of the article within the structure. */
      location: ConstitutionArticleLocation;
      /** Heading level of the article number (`2` + structural depth). */
      level: 2 | 3 | 4 | 5;
    };

// ---------------------------------------------------------------------------
// Data — the single source of truth
// ---------------------------------------------------------------------------

/**
 * The constitutional text of the Republic of Astoria.
 *
 * ⚠️ IMPORTANT: the *final* content must come exclusively from official
 * Astorian sources once they are published — no article, no date and no
 * institutional provision may be invented for the released text.
 *
 * ⚠️ PROVISIONAL LAYOUT CONTENT: while the official text is not published,
 * two articles are present below so the constitutional reader (search,
 * sommaire, anchors, navigation) can be designed and validated against real
 * textual data. They transpose the *structure* of the opening provisions of
 * the French Constitution of 4 October 1958 (art. 1er and art. 2) to the
 * Republic of Astoria, using only the institutions and facts established on
 * this portal. They are **not** official Astorian constitutional text and
 * must be replaced before any public release.
 */
export const constitution: Constitution = {
  title: "Constitution de la République d'Astoria",
  // True only while the provisional layout content below is in place.
  published: true,
  titles: [
    {
      id: "titre-premier",
      number: "PREMIER",
      title: "DE LA SOUVERAINETÉ",
      articles: [
        {
          id: "article-1",
          number: "1",
          content:
            "La République d'Astoria est une République indivisible, laïque, démocratique et sociale. Elle assure l'égalité devant la loi de tous les citoyens sans distinction d'origine, de race ou de religion. Elle respecte toutes les croyances. Son organisation est décentralisée.\n\nLa loi favorise l'égal accès des femmes et des hommes aux mandats électoraux et fonctions électives, ainsi qu'aux responsabilités professionnelles et sociales.",
        },
        {
          id: "article-2",
          number: "2",
          content:
            "La langue de la République est le français.\nL'emblème national de la République d'Astoria est fixé par la loi.\nL'hymne national est fixé par la loi.\nLa devise de la République est fixée par la loi.\nSon principe est : gouvernement du peuple, par le peuple et pour le peuple.",
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Navigation helpers
// ---------------------------------------------------------------------------

function walkTitleArticles(
  title: ConstitutionTitle,
  visit: (location: ConstitutionArticleLocation) => void,
): void {
  for (const article of title.articles) {
    visit({ article, title, chapter: null, section: null });
  }

  if (title.chapters) {
    for (const chapter of title.chapters) {
      for (const article of chapter.articles) {
        visit({ article, title, chapter, section: null });
      }

      if (chapter.sections) {
        for (const section of chapter.sections) {
          for (const article of section.articles) {
            visit({ article, title, chapter, section });
          }
        }
      }
    }
  }
}

/**
 * All articles of the Constitution with their structural position, in
 * official reading order.
 */
export function getArticleLocations(): ReadonlyArray<ConstitutionArticleLocation> {
  const locations: ConstitutionArticleLocation[] = [];

  for (const title of constitution.titles) {
    walkTitleArticles(title, (location) => {
      locations.push(location);
    });
  }

  return locations;
}

/** Return the flat list of all articles across all titles. */
export function getAllArticles(): ReadonlyArray<ConstitutionArticle> {
  return getArticleLocations().map((location) => location.article);
}

/** Resolve one article by its stable id (anchor/slug). */
export function getArticleLocation(
  id: string,
): ConstitutionArticleLocation | undefined {
  return getArticleLocations().find(
    (location) => location.article.id === id,
  );
}

/**
 * The document as a flat, ordered list of display blocks. Only blocks that
 * actually exist in the official data are emitted.
 */
export function getDocumentBlocks(): ReadonlyArray<ConstitutionDocumentBlock> {
  const blocks: ConstitutionDocumentBlock[] = [];
  let articleIndex = 0;

  if (constitution.preamble) {
    blocks.push({
      kind: "preamble",
      id: "preambule",
      title: "Préambule",
      text: constitution.preamble,
    });
  }

  for (const title of constitution.titles) {
    blocks.push({
      kind: "title",
      id: title.id,
      number: title.number,
      title: title.title,
    });

    // Reading order mirrors `getArticleLocations`: the articles attached
    // directly to a title come first, then its chapters (each chapter's own
    // articles, then its sections' articles).
    for (const article of title.articles) {
      blocks.push({
        kind: "article",
        index: articleIndex++,
        level: 3,
        location: { article, title, chapter: null, section: null },
      });
    }

    if (title.chapters) {
      for (const chapter of title.chapters) {
        blocks.push({
          kind: "chapter",
          id: chapter.id,
          number: chapter.number,
          title: chapter.title,
        });

        for (const article of chapter.articles) {
          blocks.push({
            kind: "article",
            index: articleIndex++,
            level: 4,
            location: { article, title, chapter, section: null },
          });
        }

        if (chapter.sections) {
          for (const section of chapter.sections) {
            blocks.push({
              kind: "section",
              id: section.id,
              number: section.number,
              title: section.title,
            });

            for (const article of section.articles) {
              blocks.push({
                kind: "article",
                index: articleIndex++,
                level: 5,
                location: { article, title, chapter, section },
              });
            }
          }
        }
      }
    }
  }

  return blocks;
}

/**
 * Ordered ids of every published article. Indexes into this array give the
 * previous/next navigation of the document (official reading order).
 */
export function getArticleOrder(): ReadonlyArray<string> {
  return getArticleLocations().map((location) => location.article.id);
}
