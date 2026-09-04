import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { Link } from "@/i18n/navigation";
import {
  constitution,
  getArticleLocations,
} from "@/lib/constitution";
import { NoticeCallout } from "@/components/public/content/ads-fragments";
import {
  ConstitutionSommaire,
  type ConstitutionSommaireItem,
} from "@/components/public/constitution/constitution-sommaire";
import { ConstitutionDocument } from "@/components/public/constitution/constitution-document";
import { ConstitutionSearch } from "@/components/public/constitution/constitution-search";
import { ConstitutionCopyLinks } from "@/components/public/constitution/constitution-copy-links";
import { ConstitutionToolbar } from "@/components/public/constitution/constitution-toolbar";
import {
  articleContextLabel,
  partDisplayLabel,
  type ConstitutionFrames,
} from "@/components/public/constitution/constitution-helpers";
import type { Locale } from "@/i18n/routing";

const PAGE_PATH = "/republique/constitution";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  const t = await getTranslations({ locale, namespace: "constitution" });

  return {
    title: t("hero.title"),
    description: t("description"),
    ...localizedAlternates(locale, PAGE_PATH),
  };
}

function framesOf(t: (key: string) => string): ConstitutionFrames {
  return {
    article: t("structure.article"),
    title: t("structure.title"),
    chapter: t("structure.chapter"),
    section: t("structure.section"),
  };
}

/**
 * Sommaire tree built from the published structure. Only entries that exist
 * in the text are emitted — nothing is invented.
 *
 * Structural groups (titre / chapitre / section) carry their official name
 * and their range of articles ("Articles 1 à 4") as secondary text, computed
 * from the reading order of the published text.
 */
type SommaireAcc = {
  item: ConstitutionSommaireItem;
  /** Article numbers under this branch, in reading order. */
  numbers: string[];
};

function buildTocItems(
  frames: ConstitutionFrames,
  preambleLabel: string,
  t: (key: string, values?: Record<string, unknown>) => string,
): ReadonlyArray<ConstitutionSommaireItem> {
  const items: ConstitutionSommaireItem[] = [];

  const articleAcc = (article: {
    id: string;
    number: string;
  }): SommaireAcc => ({
    item: {
      id: article.id,
      label: partDisplayLabel(frames.article, article.number),
      href: `#${article.id}`,
    },
    numbers: [article.number],
  });

  const rangeMeta = (numbers: string[]): string | undefined => {
    if (numbers.length === 0) {
      return undefined;
    }
    const first = numbers[0];
    const last = numbers[numbers.length - 1];
    if (first === last) {
      return partDisplayLabel(frames.article, first);
    }
    return t("structure.articlesFromTo", { first, last });
  };

  const groupAcc = (
    id: string,
    label: string,
    subtitle: string | undefined,
    childAccs: ReadonlyArray<SommaireAcc>,
  ): SommaireAcc => {
    const numbers = childAccs.flatMap((acc) => acc.numbers);
    const children = childAccs.map((acc) => acc.item);
    return {
      item: {
        id,
        label,
        subtitle,
        href: `#${id}`,
        meta: rangeMeta(numbers),
        children: children.length > 0 ? children : undefined,
      },
      numbers,
    };
  };

  if (constitution.preamble) {
    items.push({
      id: "preambule",
      label: preambleLabel,
      href: "#preambule",
    });
  }

  for (const title of constitution.titles) {
    const childAccs: SommaireAcc[] = [];

    if (title.chapters && title.chapters.length > 0) {
      for (const chapter of title.chapters) {
        const chapterAccs: SommaireAcc[] = [];

        // Reading order mirrors the document: direct articles first, then
        // the sections' articles.
        for (const article of chapter.articles) {
          chapterAccs.push(articleAcc(article));
        }
        if (chapter.sections) {
          for (const section of chapter.sections) {
            const sectionAccs = section.articles.map(articleAcc);
            if (sectionAccs.length > 0) {
              chapterAccs.push(
                groupAcc(
                  section.id,
                  partDisplayLabel(frames.section, section.number),
                  section.title,
                  sectionAccs,
                ),
              );
            }
          }
        }

        childAccs.push(
          groupAcc(
            chapter.id,
            partDisplayLabel(frames.chapter, chapter.number),
            chapter.title,
            chapterAccs,
          ),
        );
      }
    } else {
      for (const article of title.articles) {
        childAccs.push(articleAcc(article));
      }
    }

    if (childAccs.length > 0) {
      items.push(
        groupAcc(
          title.id,
          partDisplayLabel(frames.title, title.number),
          title.title,
          childAccs,
        ).item,
      );
    }
  }

  return items;
}

/**
 * Annex below the document: constitutional revisions (history of the text).
 * Kept as an accessory of the document page, never dominating the reading.
 */
async function RevisionsAnnex({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "constitution" });

  return (
    <section className="gov-constitution-annex" aria-labelledby="constitution-revisions-title">
      <h2 id="constitution-revisions-title">{t("revisions.title")}</h2>
      <p className="gov-constitution-annex__text">{t("revisions.lead")}</p>

      {constitution.revisions && constitution.revisions.length > 0 ? (
        <ul className="gov-constitution-annex__rows">
          {constitution.revisions.map((revision) => (
            <li key={revision.id} className="gov-constitution-annex__row">
              <p className="gov-constitution-annex__row-title">{revision.date}</p>
              <p className="gov-constitution-annex__row-text">
                {revision.description}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="gov-section-notice">
          <NoticeCallout iconId="fr-icon-calendar-line">
            {t("revisions.empty")}
          </NoticeCallout>
        </div>
      )}
    </section>
  );
}

/**
 * Related institutional pages, presented as an annex of the constitutional
 * document (never as marketing blocks).
 */
async function RelatedInstitutionsAnnex({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "constitution" });

  return (
    <section className="gov-constitution-annex" aria-labelledby="constitution-related-title">
      <h2 id="constitution-related-title">{t("related.title")}</h2>
      <p className="gov-constitution-annex__text">{t("related.lead")}</p>
      <ul className="gov-constitution-annex__rows">
        <li className="gov-constitution-annex__row">
          <h3>{t("related.items.government.title")}</h3>
          <p className="gov-constitution-annex__row-text">
            {t("related.items.government.text")}
          </p>
          <p className="gov-row__actions">
            <Link className="gov-row__link" href={t("related.governmentHref")}>
              {t("readMore")}
              <span aria-hidden="true" className="fr-icon-arrow-right-line" />
            </Link>
          </p>
        </li>
        <li className="gov-constitution-annex__row">
          <h3>{t("related.items.president.title")}</h3>
          <p className="gov-constitution-annex__row-text">
            {t("related.items.president.text")}
          </p>
          <p className="gov-row__actions">
            <Link className="gov-row__link" href={t("related.presidentHref")}>
              {t("readMore")}
              <span aria-hidden="true" className="fr-icon-arrow-right-line" />
            </Link>
          </p>
        </li>
        <li className="gov-constitution-annex__row">
          <h3>{t("related.items.composition.title")}</h3>
          <p className="gov-constitution-annex__row-text">
            {t("related.items.composition.text")}
          </p>
          <p className="gov-row__actions">
            <Link className="gov-row__link" href={t("related.compositionHref")}>
              {t("readMore")}
              <span aria-hidden="true" className="fr-icon-arrow-right-line" />
            </Link>
          </p>
        </li>
      </ul>
    </section>
  );
}

/**
 * `/republique/constitution` — the official reader of the Constitution of
 * the Republic of Astoria.
 *
 * Following the documentary consultation pattern of official legal portals
 * (Légifrance), the page *is* the document: the text header and its
 * metadata come first, then the sommaire and the full official text.
 * Search, revision history and institutional links remain available but are
 * accessories of the reading experience. The text is reproduced exactly
 * from `lib/constitution.ts` — nothing is ever invented.
 */
export default async function ConstitutionPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "constitution" });

  const frames = framesOf(t);
  const locations = getArticleLocations();
  const hasText = constitution.published && locations.length > 0;
  const translate = t as (
    key: string,
    values?: Record<string, unknown>,
  ) => string;

  return (
    <>
      <ConstitutionCopyLinks />

      {/* ── Document zone: header, metadata, search ──────────────────── */}
      <div className="gov-section gov-constitution-doc">
        <div className="gov-section__container">
          {hasText && (
            <>
              {locale !== "fr" && (
                <div className="gov-constitution-doc__notice">
                  <NoticeCallout iconId="fr-icon-information-line">
                    {t("document.langNotice")}
                  </NoticeCallout>
                </div>
              )}

              <header className="gov-constitution-doc__header">
                <h1 className="gov-constitution-doc__title">
                  {t("hero.title")}
                </h1>
                <p className="gov-constitution-doc__subtitle">
                  {t("hero.lead")}
                </p>
                <p className="gov-constitution-doc__meta-line">
                  <span className="gov-constitution-info__badge">
                    {t("info.statusCurrent")}
                  </span>
                </p>
              </header>

              <div className="gov-constitution-doc__meta">
                <h2 className="gov-constitution-doc__meta-title">
                  {t("info.title")}
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
                </dl>
              </div>

              {/* ── Document actions: search, versions, copy, print, share ── */}
              <div className="gov-constitution-doc__toolbar">
                <ConstitutionToolbar
                  versionLabel={constitution.version}
                  revisions={constitution.revisions ?? []}
                />
              </div>

              <div
                id="constitution-search-zone"
                className="gov-constitution-doc__search"
              >
                <ConstitutionSearch
                  items={locations.map((location) => ({
                    id: location.article.id,
                    label: partDisplayLabel(
                      frames.article,
                      location.article.number,
                    ),
                    context: articleContextLabel(frames, {
                      titleNumber: location.title.number,
                      chapterNumber: location.chapter?.number,
                      sectionNumber: location.section?.number,
                    }),
                    content: location.article.content,
                  }))}
                />
              </div>
            </>
          )}

          {!hasText && (
            <>
              <header className="gov-constitution-doc__header">
                <h1 className="gov-constitution-doc__title">
                  {t("hero.title")}
                </h1>
                <p className="gov-constitution-doc__meta-line">
                  <span className="gov-constitution-info__badge gov-constitution-info__badge--pending">
                    {t("info.statusPending")}
                  </span>
                </p>
              </header>

              <div className="gov-constitution-doc__notice">
                <NoticeCallout
                  iconId="fr-icon-information-line"
                  title={t("pending.title")}
                >
                  {t("pending.lead")}
                </NoticeCallout>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Reader: sommaire + official text ─────────────────────────── */}
      {hasText && (
        <section
          className="gov-section gov-constitution-reader"
          aria-label={t("tableOfContents.title")}
        >
          <div className="gov-section__container gov-constitution-reader__layout">
            <aside className="gov-constitution-reader__aside">
              <ConstitutionSommaire
                items={buildTocItems(frames, t("preamble.title"), translate)}
                labels={{
                  title: t("tableOfContents.sideTitle"),
                  navLabel: t("tableOfContents.title"),
                  expandAllLabel: t("tableOfContents.expandAll"),
                  collapseAllLabel: t("tableOfContents.collapseAll"),
                  expandGroupLabel: t("tableOfContents.expandGroup"),
                  collapseGroupLabel: t("tableOfContents.collapseGroup"),
                }}
              />
            </aside>

            <div className="gov-constitution-reader__content">
              <ConstitutionDocument locale={locale} />

              {/* Annexes of the document */}
              <RevisionsAnnex locale={locale} />
              <RelatedInstitutionsAnnex locale={locale} />
            </div>
          </div>
        </section>
      )}

      {/* Pending: related institutions below the notice */}
      {!hasText && (
        <div className="gov-section gov-section--subtle">
          <div className="gov-section__container">
            <RelatedInstitutionsAnnex locale={locale} />
          </div>
        </div>
      )}
    </>
  );
}
