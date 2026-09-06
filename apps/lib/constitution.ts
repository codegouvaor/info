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
  /**
   * Provisions that stand *before* the first title, directly after the
   * preamble (e.g. Article 1er in the official layout). They belong to no
   * title and are read between the preamble and "Titre premier".
   */
  articles?: ReadonlyArray<ConstitutionArticle>;
  /** Hierarchical structure of the constitutional text. */
  titles: ReadonlyArray<ConstitutionTitle>;
  /** Revisions history, if any. */
  revisions?: ReadonlyArray<ConstitutionRevision>;
};

/**
 * Where an article sits inside the constitutional document.
 * `title` is `null` only for the provisions that stand before the first
 * title (e.g. Article 1er); `chapter` and `section` are defined only when
 * the article lives at that nesting level.
 */
export type ConstitutionArticleLocation = {
  article: ConstitutionArticle;
  title: ConstitutionTitle | null;
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
 * WORKING CORPUS: the provisions below are a faithful mirror of the official
 * consolidated text of the Constitution of 4 October 1958, transposed to the
 * Republic of Astoria exactly like the opening provisions already published
 * on this portal (country identity and emblems genericised to the law,
 * institutions mirrored). They keep the exact official layout — Article 1er
 * standing alone between the Préambule and Titre premier. They allow the
 * constitutional reader (search, sommaire, anchors, navigation) to be
 * designed and validated against real textual data, and must be completed
 * and validated before any public release.
 */
export const constitution: Constitution = {
  title: "Constitution de la République d'Astoria",
  published: true,
  preamble:
    "Le peuple d'Astoria proclame solennellement son attachement aux Droits de l'Homme et aux principes de la souveraineté nationale, tels qu'ils ont été définis par les textes fondateurs de la République, ainsi qu'aux droits et devoirs définis par la Charte de l'environnement.\n\nEn vertu de ces principes et de celui de la libre détermination des peuples, la République offre aux territoires qui manifestent la volonté d'y adhérer des institutions nouvelles fondées sur l'idéal commun de liberté, d'égalité et de fraternité, et conçues en vue de leur évolution démocratique.",
  // Article 1er stands alone, between the Préambule and Titre premier
  // (exact official layout of the mirrored text).
  articles: [
    {
      id: "article-1",
      number: "1er",
      content:
        "La République d'Astoria est une République indivisible, laïque, démocratique et sociale. Elle assure l'égalité devant la loi de tous les citoyens sans distinction d'origine, de race ou de religion. Elle respecte toutes les croyances. Son organisation est décentralisée.\n\nLa loi favorise l'égal accès des femmes et des hommes aux mandats électoraux et fonctions électives, ainsi qu'aux responsabilités professionnelles et sociales.",
    },
  ],
  titles: [
    {
      id: "titre-premier",
      number: "premier",
      title: "De la souveraineté",
      articles: [
        {
          id: "article-2",
          number: "2",
          content:
            "La langue de la République est le français.\nL'emblème national de la République d'Astoria est fixé par la loi.\nL'hymne national est fixé par la loi.\nLa devise de la République est fixée par la loi.\nSon principe est : gouvernement du peuple, par le peuple et pour le peuple.",
        },
        {
          id: "article-3",
          number: "3",
          content:
            "La souveraineté nationale appartient au peuple qui l'exerce par ses représentants et par la voie du référendum.\nAucune section du peuple ni aucun individu ne peut s'en attribuer l'exercice.\nLe suffrage peut être direct ou indirect dans les conditions prévues par la Constitution. Il est toujours universel, égal et secret.\nSont électeurs, dans les conditions déterminées par la loi, tous les nationaux astoriens majeurs des deux sexes, jouissant de leurs droits civils et politiques.",
        },
        {
          id: "article-4",
          number: "4",
          content:
            "Les partis et groupements politiques concourent à l'expression du suffrage. Ils se forment et exercent leur activité librement. Ils doivent respecter les principes de la souveraineté nationale et de la démocratie.\nIls contribuent à la mise en œuvre du principe énoncé au second alinéa de l'article 1er dans les conditions déterminées par la loi.\nLa loi garantit les expressions pluralistes des opinions et la participation équitable des partis et groupements politiques à la vie démocratique de la Nation.",
        },
      ],
    },
    {
      id: "titre-ii",
      number: "II",
      title: "Le Président de la République",
      articles: [
        {
          id: "article-5",
          number: "5",
          content:
            "Le Président de la République veille au respect de la Constitution. Il assure, par son arbitrage, le fonctionnement régulier des pouvoirs publics ainsi que la continuité de l'État.\nIl est le garant de l'indépendance nationale, de l'intégrité du territoire et du respect des traités.",
        },
        {
          id: "article-6",
          number: "6",
          content:
            "Le Président de la République est élu pour cinq ans au suffrage universel direct.\nNul ne peut exercer plus de deux mandats consécutifs.\nLes modalités d'application du présent article sont fixées par une loi organique.",
        },
        {
          id: "article-7",
          number: "7",
          content:
            "Le Président de la République est élu à la majorité absolue des suffrages exprimés. Si celle-ci n'est pas obtenue au premier tour de scrutin, il est procédé, le quatorzième jour suivant, à un second tour. Seuls peuvent s'y présenter les deux candidats qui, le cas échéant après retrait de candidats plus favorisés, se trouvent avoir recueilli le plus grand nombre de suffrages au premier tour.\nLe scrutin est ouvert sur convocation du Gouvernement.\nL'élection du nouveau Président a lieu vingt jours au moins et trente-cinq jours au plus avant l'expiration des pouvoirs du Président en exercice.\nEn cas de vacance de la Présidence de la République pour quelque cause que ce soit, ou d'empêchement constaté par le Conseil constitutionnel saisi par le Gouvernement et statuant à la majorité absolue de ses membres, les fonctions du Président de la République, à l'exception de celles prévues aux articles 11 et 12 ci-dessous, sont provisoirement exercées par le Président du Sénat et, si celui-ci est à son tour empêché d'exercer ces fonctions, par le Gouvernement.\nEn cas de vacance ou lorsque l'empêchement est déclaré définitif par le Conseil constitutionnel, le scrutin pour l'élection du nouveau Président a lieu, sauf cas de force majeure constaté par le Conseil constitutionnel, vingt jours au moins et trente-cinq jours au plus, après l'ouverture de la vacance ou la déclaration du caractère définitif de l'empêchement.\nSi, dans les sept jours précédant la date limite du dépôt des présentations de candidatures, une des personnes ayant, moins de trente jours avant cette date, annoncé publiquement sa décision d'être candidate décède ou se trouve empêchée, le Conseil constitutionnel peut décider de reporter l'élection.\nSi, avant le premier tour, un des candidats décède ou se trouve empêché, le Conseil constitutionnel prononce le report de l'élection.\nEn cas de décès ou d'empêchement de l'un des deux candidats les plus favorisés au premier tour avant les retraits éventuels, le Conseil constitutionnel déclare qu'il doit être procédé de nouveau à l'ensemble des opérations électorales ; il en est de même en cas de décès ou d'empêchement de l'un des deux candidats restés en présence en vue du second tour.\nDans tous les cas, le Conseil constitutionnel est saisi dans les conditions fixées au deuxième alinéa de l'article 61 ci-dessous ou dans celles déterminées pour la présentation d'un candidat par la loi organique prévue à l'article 6 ci-dessus.\nLe Conseil constitutionnel peut proroger les délais prévus aux troisième et cinquième alinéas sans que le scrutin puisse avoir lieu plus de trente-cinq jours après la date de la décision du Conseil constitutionnel. Si l'application des dispositions du présent alinéa a eu pour effet de reporter l'élection à une date postérieure à l'expiration des pouvoirs du Président en exercice, celui-ci demeure en fonctions jusqu'à la proclamation de son successeur.\nIl ne peut être fait application ni des articles 49 et 50 ni de l'article 89 de la Constitution durant la vacance de la Présidence de la République ou durant la période qui s'écoule entre la déclaration du caractère définitif de l'empêchement du Président de la République et l'élection de son successeur.",
        },
        {
          id: "article-8",
          number: "8",
          content:
            "Le Président de la République nomme le Premier ministre. Il met fin à ses fonctions sur la présentation par celui-ci de la démission du Gouvernement.\nSur la proposition du Premier ministre, il nomme les autres membres du Gouvernement et met fin à leurs fonctions.",
        },
      ],
    },
    {
      id: "titre-iii",
      number: "III",
      title: "Le Gouvernement",
      articles: [
        {
          id: "article-20",
          number: "20",
          content:
            "Le Gouvernement détermine et conduit la politique de la Nation.\nIl dispose de l'administration et de la force armée.\nIl est responsable devant le Parlement dans les conditions et suivant les procédures prévues aux articles 49 et 50.",
        },
        {
          id: "article-21",
          number: "21",
          content:
            "Le Premier ministre dirige l'action du Gouvernement. Il est responsable de la Défense nationale. Il assure l'exécution des lois. Sous réserve des dispositions de l'article 13, il exerce le pouvoir réglementaire et nomme aux emplois civils et militaires.\nIl peut déléguer certains de ses pouvoirs aux ministres.\nIl supplée, le cas échéant, le Président de la République dans la présidence des conseils et comités prévus à l'article 15.\nIl peut, à titre exceptionnel, le suppléer pour la présidence d'un Conseil des ministres en vertu d'une délégation expresse et pour un ordre du jour déterminé.",
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
 * official reading order: the provisions standing before the first title
 * (e.g. Article 1er) come first, then every title's own provisions.
 */
export function getArticleLocations(): ReadonlyArray<ConstitutionArticleLocation> {
  const locations: ConstitutionArticleLocation[] = [];

  for (const article of constitution.articles ?? []) {
    locations.push({
      article,
      title: null,
      chapter: null,
      section: null,
    });
  }

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

  // Provisions standing before the first title (e.g. Article 1er), read
  // directly after the preamble — mirrors `getArticleLocations`.
  for (const article of constitution.articles ?? []) {
    blocks.push({
      kind: "article",
      index: articleIndex++,
      level: 3,
      location: { article, title: null, chapter: null, section: null },
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
