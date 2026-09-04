import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  getArticleLocations,
  getArticleOrder,
  getDocumentBlocks,
  type ConstitutionArticleLocation,
  type ConstitutionDocumentBlock,
} from "@/lib/constitution";
import type { Locale } from "@/i18n/routing";
import {
  partDisplayLabel,
  splitParagraphs,
} from "./constitution-helpers";

const CONSTITUTION_PATH = "/republique/constitution";

/** Renders the paragraphs of one official text block. */
export function OfficialTextParagraphs({ text }: { text: string }) {
  const paragraphs = splitParagraphs(text);

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </>
  );
}

/** Discreet per-article action: copies the stable link to the article. */
export function ConstitutionCopyLinkButton({
  id,
  articleLabel,
  copyLabel,
  copiedLabel,
}: {
  /** Anchor id of the targeted article (`article.id`). */
  id: string;
  /** Chrome label of the article ("Article 42"). */
  articleLabel: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  return (
    <button
      type="button"
      className="gov-constitution-copy"
      data-copy-link={id}
      aria-label={`${copyLabel} : ${articleLabel}`}
    >
      <span aria-hidden="true" className="fr-icon-links-line" />
      <span className="gov-constitution-copy__label">{copyLabel}</span>
      <span className="gov-constitution-copy__label gov-constitution-copy__label--copied">
        {copiedLabel}
      </span>
    </button>
  );
}

function ArticleFoot({
  location,
  articleLabelsById,
  order,
  t,
}: {
  location: ConstitutionArticleLocation;
  articleLabelsById: ReadonlyMap<string, string>;
  order: ReadonlyArray<string>;
  t: (key: string) => string;
}) {
  const index = order.indexOf(location.article.id);
  const previousId = index > 0 ? order[index - 1] : undefined;
  const nextId = index >= 0 && index < order.length - 1 ? order[index + 1] : undefined;
  const hasExplanation = Boolean(location.article.explanation);

  return (
    <footer className="gov-constitution-article__foot">
      <div className="gov-constitution-article__understand">
        {hasExplanation ? (
          <Link
            className="gov-constitution-article__understand-link"
            href={`${CONSTITUTION_PATH}/${location.article.id}`}
          >
            {t("explanation.linkLabel")}
            <span aria-hidden="true" className="fr-icon-arrow-right-line" />
          </Link>
        ) : (
          <span />
        )}
      </div>

      <nav className="gov-constitution-pager" aria-label={t("articleNav.navLabel")}>
        {previousId ? (
          <Link
            className="gov-constitution-pager__link gov-constitution-pager__link--prev"
            href={`#${previousId}`}
          >
            <span aria-hidden="true" className="fr-icon-arrow-left-line" />
            <span className="gov-constitution-pager__text">
              <span className="gov-constitution-pager__direction">
                {t("articleNav.previous")}
              </span>
              <span className="gov-constitution-pager__target">
                {articleLabelsById.get(previousId) ?? ""}
              </span>
            </span>
          </Link>
        ) : (
          <span />
        )}

        {nextId ? (
          <Link
            className="gov-constitution-pager__link gov-constitution-pager__link--next"
            href={`#${nextId}`}
          >
            <span className="gov-constitution-pager__text">
              <span className="gov-constitution-pager__direction">
                {t("articleNav.next")}
              </span>
              <span className="gov-constitution-pager__target">
                {articleLabelsById.get(nextId) ?? ""}
              </span>
            </span>
            <span aria-hidden="true" className="fr-icon-arrow-right-line" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </footer>
  );
}

function DocumentBlock({
  block,
  frames,
  t,
  articleLabelsById,
  order,
}: {
  block: ConstitutionDocumentBlock;
  frames: Record<"article" | "title" | "chapter" | "section", string>;
  t: (key: string) => string;
  articleLabelsById: ReadonlyMap<string, string>;
  order: ReadonlyArray<string>;
}) {
  if (block.kind === "preamble") {
    return (
      <div className="gov-constitution-preamble" id={block.id}>
        <h2 className="gov-constitution-preamble__heading">
          <span aria-hidden="true" className="fr-icon-quote-line" />
          {block.title}
        </h2>
        <div className="gov-constitution-document__text">
          <OfficialTextParagraphs text={block.text} />
        </div>
      </div>
    );
  }

  if (block.kind === "title") {
    return (
      <h2
        className="gov-constitution-title"
        id={block.id}
      >
        {partDisplayLabel(frames.title, block.number)}
        {block.title ? ` — ${block.title}` : ""}
      </h2>
    );
  }

  if (block.kind === "chapter") {
    return (
      <h3 className="gov-constitution-chapter" id={block.id}>
        {partDisplayLabel(frames.chapter, block.number)}
        {block.title ? ` — ${block.title}` : ""}
      </h3>
    );
  }

  if (block.kind === "section") {
    return (
      <h4 className="gov-constitution-section" id={block.id}>
        {partDisplayLabel(frames.section, block.number)}
        {block.title ? ` — ${block.title}` : ""}
      </h4>
    );
  }

  const { location, level } = block;
  const { article } = location;
  const articleLabel = articleLabelOf(frames, article.number);
  const HeadingTag = `h${level}` as "h3" | "h4" | "h5";

  return (
    <article className="gov-constitution-article" id={article.id}>
      <header className="gov-constitution-article__head">
        <div className="gov-constitution-article__heading">
          <HeadingTag className="gov-constitution-article__number">
            {articleLabel}
          </HeadingTag>
          {article.title && (
            <p className="gov-constitution-article__official-title">
              {article.title}
            </p>
          )}
        </div>
        <ConstitutionCopyLinkButton
          id={article.id}
          articleLabel={articleLabel}
          copyLabel={t("articleNav.copy")}
          copiedLabel={t("articleNav.copied")}
        />
      </header>
      <div className="gov-constitution-article__content">
        <OfficialTextParagraphs text={article.content} />
      </div>
      <ArticleFoot
        location={location}
        articleLabelsById={articleLabelsById}
        order={order}
        t={t}
      />
    </article>
  );
}

function articleLabelOf(
  frames: Record<"article" | "title" | "chapter" | "section", string>,
  number?: string,
): string {
  return partDisplayLabel(frames.article, number);
}

/**
 * The official text of the Constitution, rendered as a readable document:
 * structure headings and articles in official reading order, each article
 * carrying a stable anchor, a discreet copy-link action and previous/next
 * navigation. The text is reproduced exactly from `lib/constitution.ts`.
 */
export async function ConstitutionDocument({
  locale,
}: {
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "constitution" });

  const frames: Record<"article" | "title" | "chapter" | "section", string> = {
    article: t("structure.article"),
    title: t("structure.title"),
    chapter: t("structure.chapter"),
    section: t("structure.section"),
  };

  const blocks = getDocumentBlocks();
  const order = getArticleOrder();
  const labelsById = new Map(
    getArticleLocations().map((location) => [
      location.article.id,
      articleLabelOf(frames, location.article.number),
    ]),
  );

  return (
    <div className="gov-constitution-document">
      {blocks.map((block) => (
        <DocumentBlock
          key={block.kind === "article" ? block.location.article.id : block.id}
          block={block}
          frames={frames}
          t={t}
          articleLabelsById={labelsById}
          order={order}
        />
      ))}
    </div>
  );
}
