import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { Link } from "@/i18n/navigation";
import {
  distinctionItems,
  ministerEntries,
  ministryEntries,
  presidentHolder,
  relatedItems,
  secretaryEntries,
} from "@/lib/government-composition";
import { NoticeCallout } from "@/components/public/content/ads-fragments";

const PAGE_PATH = "/government/composition";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  const t = await getTranslations({ locale, namespace: "pages.composition" });

  return {
    title: t("title"),
    description: t("description"),
    ...localizedAlternates(locale, PAGE_PATH),
  };
}

/**
 * `/government/composition` — the official reference page on the composition
 * of the Government of the Republic of Astoria.
 *
 * It answers “what is the Government made of?”, complementing `/government`
 * (which answers “how does the Government work?”). The page is built around
 * the Astorian institutional model: the President of the Republic is the
 * first component of the executive branch, then come the ministers, the
 * secretaries of state and the ministries.
 *
 * Institutions and people are never mixed. The structure comes from
 * `lib/government-composition.ts` and every word from the `composition.*`
 * message catalogs. The Government is not yet constituted, so the page
 * presents the institutional functions with clean empty states; feeding the
 * arrays of that data file (and the matching messages) is enough to welcome
 * the real Government later, without any front-end rework.
 */
export default async function GovernmentCompositionPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "composition" });

  return (
    <>
      {/* 01 — Hero */}
      <section className="gov-section gov-page-hero" aria-labelledby="gov-comp-hero-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("hero.kicker")}</p>
          <h1 id="gov-comp-hero-title">{t("hero.title")}</h1>
          <p className="gov-page-hero__subtitle">{t("hero.subtitle")}</p>
          <p className="gov-lead">{t("hero.intro")}</p>
        </div>
      </section>

      {/* 02 — Vue d'ensemble : the composition diagram */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-comp-overview-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("overview.kicker")}</p>
          <h2 id="gov-comp-overview-title" className="gov-section__title">
            {t("overview.title")}
          </h2>
          <p className="gov-lead">{t("overview.lead")}</p>

          {/* Composition diagram — readable as a plain list (see aria-label). */}
          <ol className="gov-exec" aria-label={t("overview.ariaLabel")}>
            <li className="gov-exec__item">
              <div className="gov-exec__node gov-exec__node--band">
                <h3 className="gov-exec__title">{t("overview.republic.title")}</h3>
                <p className="gov-exec__text">{t("overview.republic.text")}</p>
              </div>
            </li>
            <li aria-hidden="true" className="gov-exec__item">
              <div className="gov-exec__join">
                <span className="gov-exec__join-line" />
              </div>
            </li>
            <li className="gov-exec__item">
              <div className="gov-exec__node gov-exec__node--top">
                <h3 className="gov-exec__title">{t("overview.president.title")}</h3>
                <p className="gov-exec__text">{t("overview.president.text")}</p>
              </div>
            </li>
            <li className="gov-exec__item">
              <div className="gov-exec__join gov-exec__join--labelled">
                <span aria-hidden="true" className="gov-exec__join-line" />
                <span className="gov-exec__join-label">{t("overview.relation.title")}</span>
              </div>
            </li>
            <li className="gov-exec__item">
              <div className="gov-exec__node">
                <h3 className="gov-exec__title">{t("overview.government.title")}</h3>
                <p className="gov-exec__text">{t("overview.government.text")}</p>
              </div>
            </li>
            <li aria-hidden="true" className="gov-exec__item">
              <div className="gov-exec__join">
                <span className="gov-exec__join-line" />
                <span className="gov-exec__join-bar" />
              </div>
            </li>
            <li className="gov-exec__item">
              <div className="gov-exec__branch gov-exec__branch--three">
                <div className="gov-exec__node">
                  <h3 className="gov-exec__title">{t("overview.ministries.title")}</h3>
                  <p className="gov-exec__text">{t("overview.ministries.text")}</p>
                </div>
                <div className="gov-exec__node">
                  <h3 className="gov-exec__title">{t("overview.secretariats.title")}</h3>
                  <p className="gov-exec__text">{t("overview.secretariats.text")}</p>
                </div>
                <div className="gov-exec__node">
                  <h3 className="gov-exec__title">{t("overview.others.title")}</h3>
                  <p className="gov-exec__text">{t("overview.others.text")}</p>
                </div>
              </div>
            </li>
            <li aria-hidden="true" className="gov-exec__item">
              <div className="gov-exec__join">
                <span className="gov-exec__join-line" />
              </div>
            </li>
            <li className="gov-exec__item">
              <div className="gov-exec__node gov-exec__node--base">
                <h3 className="gov-exec__title">{t("overview.administrations.title")}</h3>
                <p className="gov-exec__text">{t("overview.administrations.text")}</p>
              </div>
            </li>
          </ol>

          <p className="gov-caption">{t("overview.note")}</p>

          <h3 className="gov-section__subtitle">{t("overview.distinctions.title")}</h3>
          <ul className="gov-rows">
            {distinctionItems.map((item) => (
              <li key={item.key} className="gov-row">
                <h3>{t(`overview.distinctions.items.${item.key}.title`)}</h3>
                <p className="gov-row__text">{t(`overview.distinctions.items.${item.key}.text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 03 — Le Président de la République */}
      <section className="gov-section" aria-labelledby="gov-comp-president-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("president.kicker")}</p>
          <h2 id="gov-comp-president-title" className="gov-section__title">
            {t("president.title")}
          </h2>
          <p className="gov-lead">{t("president.lead")}</p>
          <p className="gov-prose-paragraph">{t("president.paragraph")}</p>

          {/* Institutional office card — the institution exists independently
              of its holder; the holder slot below stays empty until the
              official appointment is published. */}
          <article className="gov-office">
            <p className="gov-office__type">{t("president.officeKicker")}</p>
            <h3 className="gov-office__name">{t("president.officeName")}</h3>
            <p className="gov-office__text">{t("president.officeText")}</p>
            <p className="gov-office__holder">
              <span className="gov-office__holder-label">{t("president.holderLabel")}</span>
              {presidentHolder ? (
                presidentHolder.href ? (
                  <Link
                    className="gov-office__holder-value gov-office__holder-link"
                    href={presidentHolder.href}
                  >
                    {presidentHolder.name}
                  </Link>
                ) : (
                  <span className="gov-office__holder-value">{presidentHolder.name}</span>
                )
              ) : (
                <span className="gov-office__holder-value">{t("president.holderEmpty")}</span>
              )}
            </p>
          </article>
        </div>
      </section>

      {/* 04 — Les ministres */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-comp-ministers-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("ministers.kicker")}</p>
          <h2 id="gov-comp-ministers-title" className="gov-section__title">
            {t("ministers.title")}
          </h2>
          <p className="gov-lead">{t("ministers.lead")}</p>
          <p className="gov-prose-paragraph">{t("ministers.paragraph")}</p>

          {ministerEntries.length === 0 ? (
            <div className="gov-section-notice">
              <NoticeCallout iconId="fr-icon-information-line" title={t("ministers.emptyTitle")}>
                {t("ministers.emptyText")}
              </NoticeCallout>
            </div>
          ) : (
            /* Feed slot: renders `composition.ministers.entries.<key>` rows
               once `ministerEntries` is populated — no layout rework needed. */
            <ul className="gov-rows">
              {ministerEntries.map((entry) => (
                <li key={entry.key} className="gov-row">
                  <h3>{t(`ministers.entries.${entry.key}.title`)}</h3>
                  <p className="gov-row__text">{t(`ministers.entries.${entry.key}.text`)}</p>
                  {entry.href && (
                    <p className="gov-row__actions">
                      <Link className="gov-row__link" href={entry.href}>
                        {t("readMore")}
                        <span aria-hidden="true" className="fr-icon-arrow-right-line" />
                      </Link>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 05 — Les secrétaires d'État */}
      <section className="gov-section" aria-labelledby="gov-comp-secretaries-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("secretaries.kicker")}</p>
          <h2 id="gov-comp-secretaries-title" className="gov-section__title">
            {t("secretaries.title")}
          </h2>
          <p className="gov-lead">{t("secretaries.lead")}</p>
          <p className="gov-prose-paragraph">{t("secretaries.paragraph")}</p>

          {secretaryEntries.length === 0 ? (
            <div className="gov-section-notice">
              <NoticeCallout iconId="fr-icon-information-line" title={t("secretaries.emptyTitle")}>
                {t("secretaries.emptyText")}
              </NoticeCallout>
            </div>
          ) : (
            /* Feed slot: renders `composition.secretaries.entries.<key>` rows
               once `secretaryEntries` is populated. */
            <ul className="gov-rows">
              {secretaryEntries.map((entry) => (
                <li key={entry.key} className="gov-row">
                  <h3>{t(`secretaries.entries.${entry.key}.title`)}</h3>
                  <p className="gov-row__text">{t(`secretaries.entries.${entry.key}.text`)}</p>
                  {entry.href && (
                    <p className="gov-row__actions">
                      <Link className="gov-row__link" href={entry.href}>
                        {t("readMore")}
                        <span aria-hidden="true" className="fr-icon-arrow-right-line" />
                      </Link>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 06 — Les ministères */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-comp-ministries-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("ministries.kicker")}</p>
          <h2 id="gov-comp-ministries-title" className="gov-section__title">
            {t("ministries.title")}
          </h2>
          <p className="gov-lead">{t("ministries.lead")}</p>
          <p className="gov-prose-paragraph">{t("ministries.paragraph")}</p>

          {ministryEntries.length === 0 ? (
            <div className="gov-section-notice">
              <NoticeCallout iconId="fr-icon-information-line" title={t("ministries.emptyTitle")}>
                {t("ministries.emptyText")}
              </NoticeCallout>
            </div>
          ) : (
            /* Feed slot: renders `composition.ministries.entries.<key>` rows
               once `ministryEntries` is populated. */
            <ul className="gov-rows">
              {ministryEntries.map((entry) => (
                <li key={entry.key} className="gov-row">
                  <h3>{t(`ministries.entries.${entry.key}.title`)}</h3>
                  <p className="gov-row__text">{t(`ministries.entries.${entry.key}.text`)}</p>
                  {entry.href && (
                    <p className="gov-row__actions">
                      <Link className="gov-row__link" href={entry.href}>
                        {t("readMore")}
                        <span aria-hidden="true" className="fr-icon-arrow-right-line" />
                      </Link>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 07 — Comprendre le Gouvernement : outbound links */}
      <section className="gov-section" aria-labelledby="gov-comp-related-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("related.kicker")}</p>
          <h2 id="gov-comp-related-title" className="gov-section__title">
            {t("related.title")}
          </h2>
          <p className="gov-lead">{t("related.lead")}</p>
          <ul className="gov-rows">
            {relatedItems.map((item) => (
              <li key={item.key} className="gov-row">
                <h3>{t(`related.items.${item.key}.title`)}</h3>
                <p className="gov-row__text">{t(`related.items.${item.key}.text`)}</p>
                {item.href && (
                  <p className="gov-row__actions">
                    <Link className="gov-row__link" href={item.href}>
                      {t("readMore")}
                      <span aria-hidden="true" className="fr-icon-arrow-right-line" />
                    </Link>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
