import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { Link } from "@/i18n/navigation";
import {
  constitution,
  getArticleLocation,
  getArticleLocations,
  type ConstitutionArticleLocation,
} from "@/lib/constitution";
import { NoticeCallout } from "@/components/public/content/ads-fragments";
import {
  ConstitutionCopyLinkButton,
  OfficialTextParagraphs,
} from "@/components/public/constitution/constitution-document";
import { ConstitutionCopyLinks } from "@/components/public/constitution/constitution-copy-links";
import {
  articleContextLabel,
  partDisplayLabel,
  splitParagraphs,
  type ConstitutionFrames,
} from "@/components/public/constitution/constitution-helpers";
import type { Locale } from "@/i18n/routing";

const PAGE_PATH = "/republique/constitution";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function framesOf(t: (key: string) => string): ConstitutionFrames {
  return {
    article: t("structure.article"),
    title: t("structure.title"),
    chapter: t("structure.chapter"),
    section: t("structure.section"),
  };
}

function articleLabelOf(frames: ConstitutionFrames, number?: string): string {
  return partDisplayLabel(frames.article, number);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocaleParam(rawLocale);
  const t = await getTranslations({ locale, namespace: "constitution" });

  const location = getArticleLocation(slug);

  if (!constitution.published || !location) {
    return {
      title: t("hero.title"),
      description: t("description"),
      ...localizedAlternates(locale, `${PAGE_PATH}/${slug}`),
    };
  }

  const frames = framesOf(t);
  const label = articleLabelOf(frames, location.article.number);

  return {
    title: `${label} — ${t("hero.title")}`,
    description:
      location.article.explanation?.summary?.slice(0, 180) ??
      t("description"),
    ...localizedAlternates(locale, `${PAGE_PATH}/${slug}`),
  };
}

/**
 * `/republique/constitution/[slug]` — explanatory fiche of a constitutional
 * provision (e.g. `/republique/constitution/article-1`).
 *
 * Displayed with the same documentary language as the full text: a compact
 * document header identifies the provision, the official text is reproduced
 * in an identified legal panel, and the pedagogical explanation follows as a
 * clearly separated annex. The explanation is never presented as the text.
 *
 * When the Constitution is not published yet, every slug renders the clean
 * institutional pending state; nothing is ever invented or extrapolated.
 */
export default async function ConstitutionArticlePage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "constitution" });
  const td = await getTranslations({ locale, namespace: "constitutionArticle" });

  const frames = framesOf(t);
  const location = getArticleLocation(slug);

  if (!constitution.published) {
    return <ArticlePendingState locale={locale} />;
  }

  if (!location) {
    notFound();
  }

  const articleLabel = articleLabelOf(frames, location.article.number);
  const articleId = location.article.id;
  const order = getArticleLocations().map((entry) => entry.article.id);
  const index = order.indexOf(articleId);
  const previous = index > 0 ? order[index - 1] : undefined;
  const next =
    index >= 0 && index < order.length - 1 ? order[index + 1] : undefined;
  const labelsById = new Map(
    getArticleLocations().map((entry) => [
      entry.article.id,
      articleLabelOf(frames, entry.article.number),
    ]),
  );

  const context = articleContextLabel(frames, {
    titleNumber: location.title.number,
    chapterNumber: location.chapter?.number,
    sectionNumber: location.section?.number,
  });

  const explanation = location.article.explanation;
  const relatedLocations: ReadonlyArray<ConstitutionArticleLocation> =
    explanation?.relatedArticles
      ? explanation.relatedArticles
          .map((id) => getArticleLocation(id))
          .filter(
            (entry): entry is ConstitutionArticleLocation => Boolean(entry),
          )
      : [];

  return (
    <>
      <ConstitutionCopyLinks />

      <div className="gov-section gov-constitution-doc">
        <div className="gov-section__container">
          {locale !== "fr" && (
            <div className="gov-constitution-doc__notice">
              <NoticeCallout iconId="fr-icon-information-line">
                {td("official.langNotice")}
              </NoticeCallout>
            </div>
          )}

          {/* ── Document header: the provision ─────────────────────────── */}
          <header className="gov-constitution-doc__header">
            <p className="gov-constitution-doc__context">{context}</p>
            <div className="gov-constitution-doc__title-row">
              <h1 className="gov-constitution-doc__title">{articleLabel}</h1>
              <ConstitutionCopyLinkButton
                id={articleId}
                articleLabel={articleLabel}
                copyLabel={t("articleNav.copy")}
                copiedLabel={t("articleNav.copied")}
              />
            </div>
            {location.article.title && (
              <p className="gov-constitution-doc__subtitle">
                {location.article.title}
              </p>
            )}
          </header>

          {/* ── Official text (identified as the legal text) ───────────── */}
          <section
            className="gov-constitution-fiche__official"
            aria-labelledby="constitution-fiche-official-title"
          >
            <p className="gov-kicker">{td("official.kicker")}</p>
            <h2
              id="constitution-fiche-official-title"
              className="gov-constitution-fiche__official-title"
            >
              {td("official.title")}
            </h2>
            <div className="gov-constitution-document__text">
              <OfficialTextParagraphs text={location.article.content} />
            </div>
          </section>

          {/* ── Explanation (editorial, never presented as legal text) ─── */}
          <section
            className="gov-constitution-annex gov-constitution-fiche__explanation"
            aria-labelledby="constitution-fiche-understand-title"
          >
            {explanation ? (
              <>
                {explanation.summary && (
                  <div className="gov-constitution-fiche__block">
                    <h2 id="constitution-fiche-understand-title">
                      {td("understand.summaryTitle")}
                    </h2>
                    <p className="gov-constitution-annex__text">
                      {explanation.summary}
                    </p>
                  </div>
                )}

                {explanation.content && (
                  <div className="gov-constitution-fiche__block">
                    <h2>{td("understand.contentTitle")}</h2>
                    <div className="gov-prose">
                      {splitParagraphs(explanation.content).map(
                        (paragraph, paragraphIndex) => (
                          <p key={paragraphIndex}>{paragraph}</p>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {explanation.keyPoints &&
                  explanation.keyPoints.length > 0 && (
                    <div className="gov-constitution-fiche__block">
                      <h2>{td("understand.keyPointsTitle")}</h2>
                      <ul className="gov-fiche-list">
                        {explanation.keyPoints.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {relatedLocations.length > 0 && (
                  <div className="gov-constitution-fiche__block">
                    <h2>{td("understand.relatedTitle")}</h2>
                    <ul className="gov-constitution-annex__rows">
                      {relatedLocations.map((related) => (
                        <li
                          key={related.article.id}
                          className="gov-constitution-annex__row"
                        >
                          <h3>
                            {articleLabelOf(frames, related.article.number)}
                          </h3>
                          {related.article.title && (
                            <p className="gov-constitution-annex__row-text">
                              {related.article.title}
                            </p>
                          )}
                          <p className="gov-row__actions">
                            <Link
                              className="gov-row__link"
                              href={`${PAGE_PATH}/${related.article.id}`}
                            >
                              {td("readMore")}
                              <span
                                aria-hidden="true"
                                className="fr-icon-arrow-right-line"
                              />
                            </Link>
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {explanation.references &&
                  explanation.references.length > 0 && (
                    <div className="gov-constitution-fiche__block">
                      <h2>{td("further.title")}</h2>
                      <ul className="gov-constitution-annex__rows">
                        {explanation.references.map((reference) => (
                          <li
                            key={`${reference.label}-${reference.href}`}
                            className="gov-constitution-annex__row"
                          >
                            <h3>{reference.label}</h3>
                            <p className="gov-row__actions">
                              <Link
                                className="gov-row__link"
                                href={reference.href}
                              >
                                {td("readMore")}
                                <span
                                  aria-hidden="true"
                                  className="fr-icon-arrow-right-line"
                                />
                              </Link>
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {!explanation.summary &&
                  !explanation.content &&
                  (!explanation.keyPoints ||
                    explanation.keyPoints.length === 0) &&
                  relatedLocations.length === 0 &&
                  (!explanation.references ||
                    explanation.references.length === 0) && (
                    <div className="gov-section-notice">
                      <NoticeCallout
                        iconId="fr-icon-information-line"
                        title={td("explanationEmpty.title")}
                      >
                        {td("explanationEmpty.text")}
                      </NoticeCallout>
                    </div>
                  )}
              </>
            ) : (
              <div className="gov-section-notice">
                <NoticeCallout
                  iconId="fr-icon-information-line"
                  title={td("explanationEmpty.title")}
                >
                  {td("explanationEmpty.text")}
                </NoticeCallout>
              </div>
            )}
          </section>

          {/* ── Text metadata ──────────────────────────────────────────── */}
          <section
            className="gov-constitution-annex"
            aria-labelledby="constitution-fiche-references-title"
          >
            <h2 id="constitution-fiche-references-title">
              {td("textMeta.title")}
            </h2>
            <dl className="gov-constitution-info">
              <div className="gov-constitution-info__item">
                <dt>{t("info.nature")}</dt>
                <dd>{t("info.natureValue")}</dd>
              </div>
              {constitution.version && (
                <div className="gov-constitution-info__item">
                  <dt>{t("info.version")}</dt>
                  <dd>{constitution.version}</dd>
                </div>
              )}
              {constitution.adoptedAt && (
                <div className="gov-constitution-info__item">
                  <dt>{t("info.adoptedAt")}</dt>
                  <dd>{constitution.adoptedAt}</dd>
                </div>
              )}
              {constitution.promulgatedAt && (
                <div className="gov-constitution-info__item">
                  <dt>{t("info.promulgatedAt")}</dt>
                  <dd>{constitution.promulgatedAt}</dd>
                </div>
              )}
              {constitution.effectiveAt && (
                <div className="gov-constitution-info__item">
                  <dt>{t("info.effectiveAt")}</dt>
                  <dd>{constitution.effectiveAt}</dd>
                </div>
              )}
              <div className="gov-constitution-info__item">
                <dt>{t("info.status")}</dt>
                <dd>
                  <span className="gov-constitution-info__badge">
                    {t("info.statusCurrent")}
                  </span>
                </dd>
              </div>
              <div className="gov-constitution-info__item">
                <dt>{td("textMeta.source")}</dt>
                <dd>{td("textMeta.sourceName")}</dd>
              </div>
            </dl>
          </section>

          {/* ── Pager + back to the full text ──────────────────────────── */}
          <nav
            className="gov-constitution-fiche__footer"
            aria-label={t("articleNav.navLabel")}
          >
            {previous ? (
              <Link
                className="gov-constitution-pager__link gov-constitution-pager__link--prev"
                href={`${PAGE_PATH}/${previous}`}
              >
                <span aria-hidden="true" className="fr-icon-arrow-left-line" />
                <span className="gov-constitution-pager__text">
                  <span className="gov-constitution-pager__direction">
                    {t("articleNav.previous")}
                  </span>
                  <span className="gov-constitution-pager__target">
                    {labelsById.get(previous) ?? ""}
                  </span>
                </span>
              </Link>
            ) : (
              <span />
            )}

            <Link
              className="gov-constitution-fiche__back"
              href={`${PAGE_PATH}#${articleId}`}
            >
              {td("backToText")}
              <span aria-hidden="true" className="fr-icon-arrow-right-line" />
            </Link>

            {next ? (
              <Link
                className="gov-constitution-pager__link gov-constitution-pager__link--next"
                href={`${PAGE_PATH}/${next}`}
              >
                <span className="gov-constitution-pager__text">
                  <span className="gov-constitution-pager__direction">
                    {t("articleNav.next")}
                  </span>
                  <span className="gov-constitution-pager__target">
                    {labelsById.get(next) ?? ""}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="fr-icon-arrow-right-line"
                />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </div>
    </>
  );
}

/** Pending state shown for any slug while the Constitution is unpublished. */
async function ArticlePendingState({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "constitution" });
  const td = await getTranslations({ locale, namespace: "constitutionArticle" });

  return (
    <>
      <div className="gov-section gov-constitution-doc">
        <div className="gov-section__container">
          <header className="gov-constitution-doc__header">
            <h1 className="gov-constitution-doc__title">{t("hero.title")}</h1>
            <p className="gov-constitution-doc__meta-line">
              <span className="gov-constitution-info__badge gov-constitution-info__badge--pending">
                {t("info.statusPending")}
              </span>
            </p>
          </header>

          <div className="gov-constitution-doc__notice">
            <NoticeCallout
              iconId="fr-icon-information-line"
              title={td("pending.title")}
            >
              {td("pending.text")}
            </NoticeCallout>
          </div>

          <p className="gov-constitution-fiche__footer">
            <Link className="gov-row__link" href={PAGE_PATH}>
              {td("backToText")}
              <span aria-hidden="true" className="fr-icon-arrow-right-line" />
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
