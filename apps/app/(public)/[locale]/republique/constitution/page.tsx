import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { Link } from "@/i18n/navigation";
import { constitution } from "@/lib/constitution";
import { NoticeCallout } from "@/components/public/content/ads-fragments";

const PAGE_PATH = "/republique/constitution";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  const t = await getTranslations({ locale, namespace: "constitution" });

  return {
    title: t("title"),
    description: t("description"),
    ...localizedAlternates(locale, PAGE_PATH),
  };
}

/**
 * `/republique/constitution` — the institutional reference page for the
 * Constitution of the Republic of Astoria.
 *
 * This page serves as the primary entry point to constitutional law. It is
 * designed to be useful today (with a "pending publication" state) and to
 * scale to the full constitutional text when it becomes available.
 *
 * The constitutional text is treated as a primary legal source: no content
 * is ever invented or fabricated. When `constitution.published` is `false`,
 * the page displays a clean institutional notice.
 */
export default async function ConstitutionPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "constitution" });

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="gov-section gov-constitution-hero" aria-labelledby="constitution-hero-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("hero.kicker")}</p>
          <h1 id="constitution-hero-title">{t("hero.title")}</h1>
          <p className="gov-lead">{t("hero.lead")}</p>
          <p className="gov-constitution-hero__intro">{t("hero.intro")}</p>
        </div>
      </section>

      {/* ── Text information ──────────────────────────────────────────── */}
      {constitution.published && (constitution.adoptedAt || constitution.promulgatedAt || constitution.effectiveAt || constitution.version) && (
        <section className="gov-section gov-section--subtle" aria-labelledby="constitution-info-title">
          <div className="gov-section__container">
            <p className="gov-kicker">{t("info.kicker")}</p>
            <h2 id="constitution-info-title" className="gov-section__title">
              {t("info.title")}
            </h2>
            <dl className="gov-constitution-info">
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
              {constitution.version && (
                <div className="gov-constitution-info__item">
                  <dt>{t("info.version")}</dt>
                  <dd>{constitution.version}</dd>
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
            </dl>
          </div>
        </section>
      )}

      {/* ── Preamble (only when published) ────────────────────────────── */}
      {constitution.published && constitution.preamble && (
        <section className="gov-section" aria-labelledby="constitution-preamble-title">
          <div className="gov-section__container gov-constitution-document">
            <p className="gov-kicker">{t("preamble.kicker")}</p>
            <h2 id="constitution-preamble-title" className="gov-constitution-document__heading">
              {t("preamble.title")}
            </h2>
            <div className="gov-constitution-document__text">
              <p>{constitution.preamble}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── Table of contents (only when published) ──────────────────── */}
      {constitution.published && constitution.titles.length > 0 && (
        <section className="gov-section gov-section--subtle" aria-labelledby="constitution-toc-title">
          <div className="gov-section__container">
            <p className="gov-kicker">{t("tableOfContents.kicker")}</p>
            <h2 id="constitution-toc-title" className="gov-section__title">
              {t("tableOfContents.title")}
            </h2>
            <p className="gov-lead">{t("tableOfContents.lead")}</p>
            <nav className="gov-constitution-toc" aria-label={t("tableOfContents.title")}>
              <ol className="gov-constitution-toc__list">
                {constitution.titles.map((title) => (
                  <li key={title.id} className="gov-constitution-toc__item">
                    <a href={`#${title.id}`} className="gov-constitution-toc__link">
                      <span className="gov-constitution-toc__number">{title.number}</span>
                      <span className="gov-constitution-toc__text">{title.title}</span>
                    </a>
                    {title.articles.length > 0 && (
                      <ol className="gov-constitution-toc__sublist">
                        {title.articles.map((article) => (
                          <li key={article.id} className="gov-constitution-toc__subitem">
                            <a href={`#${article.id}`} className="gov-constitution-toc__article-link">
                              Article {article.number}
                            </a>
                          </li>
                        ))}
                      </ol>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </section>
      )}

      {/* ── Constitutional text (only when published) ────────────────── */}
      {constitution.published && constitution.titles.length > 0 && (
        <section className="gov-section" aria-labelledby="constitution-text-title">
          <div className="gov-section__container gov-constitution-document">
            <p className="gov-kicker">{t("hero.kicker")}</p>
            <h2 id="constitution-text-title" className="gov-constitution-document__heading">
              {constitution.title}
            </h2>

            {constitution.titles.map((title) => (
              <article key={title.id} id={title.id} className="gov-constitution-title">
                <h3 className="gov-constitution-title__heading">
                  <span className="gov-constitution-title__number">{title.number}</span>
                  {" — "}
                  {title.title}
                </h3>

                {title.chapters?.map((chapter) => (
                  <div key={chapter.id} id={chapter.id} className="gov-constitution-chapter">
                    <h4 className="gov-constitution-chapter__heading">
                      {chapter.number} — {chapter.title}
                    </h4>

                    {chapter.sections?.map((section) => (
                      <div key={section.id} id={section.id} className="gov-constitution-section">
                        <h5 className="gov-constitution-section__heading">
                          {section.number} — {section.title}
                        </h5>
                        {section.articles.map((article) => (
                          <div key={article.id} id={article.id} className="gov-constitution-article">
                            <p className="gov-constitution-article__number">Article {article.number}</p>
                            <p className="gov-constitution-article__content">{article.content}</p>
                          </div>
                        ))}
                      </div>
                    ))}

                    {chapter.articles.map((article) => (
                      <div key={article.id} id={article.id} className="gov-constitution-article">
                        <p className="gov-constitution-article__number">Article {article.number}</p>
                        <p className="gov-constitution-article__content">{article.content}</p>
                      </div>
                    ))}
                  </div>
                ))}

                {title.articles.map((article) => (
                  <div key={article.id} id={article.id} className="gov-constitution-article">
                    <p className="gov-constitution-article__number">Article {article.number}</p>
                    <p className="gov-constitution-article__content">{article.content}</p>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── Pending state (when not published) ───────────────────────── */}
      {!constitution.published && (
        <section className="gov-section gov-section--subtle" aria-labelledby="constitution-pending-title">
          <div className="gov-section__container gov-constitution-pending">
            <div className="gov-constitution-pending__notice">
              <NoticeCallout iconId="fr-icon-information-line" title={t("pending.title")}>
                {t("pending.lead")}
              </NoticeCallout>
            </div>
            <dl className="gov-constitution-info gov-constitution-info--pending">
              <div className="gov-constitution-info__item">
                <dt>{t("info.status")}</dt>
                <dd>
                  <span className="gov-constitution-info__badge gov-constitution-info__badge--pending">
                    {t("info.statusPending")}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </section>
      )}

      {/* ── Constitutional revisions (only when published) ───────────── */}
      {constitution.published && constitution.revisions && constitution.revisions.length > 0 && (
        <section className="gov-section gov-section--subtle" aria-labelledby="constitution-revisions-title">
          <div className="gov-section__container">
            <p className="gov-kicker">{t("revisions.kicker")}</p>
            <h2 id="constitution-revisions-title" className="gov-section__title">
              {t("revisions.title")}
            </h2>
            <p className="gov-lead">{t("revisions.lead")}</p>
            <ul className="gov-rows">
              {constitution.revisions.map((revision) => (
                <li key={revision.id} className="gov-row">
                  <h3>{revision.date}</h3>
                  <p className="gov-row__text">{revision.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {constitution.published && (!constitution.revisions || constitution.revisions.length === 0) && (
        <section className="gov-section gov-section--subtle" aria-labelledby="constitution-revisions-title">
          <div className="gov-section__container">
            <p className="gov-kicker">{t("revisions.kicker")}</p>
            <h2 id="constitution-revisions-title" className="gov-section__title">
              {t("revisions.title")}
            </h2>
            <p className="gov-lead">{t("revisions.lead")}</p>
            <NoticeCallout iconId="fr-icon-calendar-line">
              {t("revisions.empty")}
            </NoticeCallout>
          </div>
        </section>
      )}

      {/* ── Related institutions ──────────────────────────────────────── */}
      <section className="gov-section" aria-labelledby="constitution-related-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("related.kicker")}</p>
          <h2 id="constitution-related-title" className="gov-section__title">
            {t("related.title")}
          </h2>
          <p className="gov-lead">{t("related.lead")}</p>
          <ul className="gov-rows">
            <li className="gov-row">
              <h3>{t("related.items.government.title")}</h3>
              <p className="gov-row__text">{t("related.items.government.text")}</p>
              <p className="gov-row__actions">
                <Link className="gov-row__link" href={t("related.governmentHref")}>
                  {t("readMore")}
                  <span aria-hidden="true" className="fr-icon-arrow-right-line" />
                </Link>
              </p>
            </li>
            <li className="gov-row">
              <h3>{t("related.items.president.title")}</h3>
              <p className="gov-row__text">{t("related.items.president.text")}</p>
              <p className="gov-row__actions">
                <Link className="gov-row__link" href={t("related.presidentHref")}>
                  {t("readMore")}
                  <span aria-hidden="true" className="fr-icon-arrow-right-line" />
                </Link>
              </p>
            </li>
            <li className="gov-row">
              <h3>{t("related.items.composition.title")}</h3>
              <p className="gov-row__text">{t("related.items.composition.text")}</p>
              <p className="gov-row__actions">
                <Link className="gov-row__link" href={t("related.compositionHref")}>
                  {t("readMore")}
                  <span aria-hidden="true" className="fr-icon-arrow-right-line" />
                </Link>
              </p>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
