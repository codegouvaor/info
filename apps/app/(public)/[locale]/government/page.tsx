import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { Link } from "@/i18n/navigation";
import {
  actionItems,
  councilRecords,
  governmentPaths,
  infoItems,
  ministryRecords,
  organisationItems,
  productionChannels,
  understandItems,
} from "@/lib/government-content";
import { sectionPaths } from "@/lib/site-structure";
import { CtaButtonsGroup, NoticeCallout } from "@/components/public/content/ads-fragments";

const PAGE_PATH = "/government";
const ACTION_PUBLIQUE_PATH = sectionPaths.politiquesPubliques;

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  const t = await getTranslations({ locale, namespace: "pages.government" });

  return {
    title: t("title"),
    description: t("description"),
    ...localizedAlternates(locale, PAGE_PATH),
  };
}

/**
 * `/government` — the institutional reference page of the Government of the
 * Republic of Astoria.
 *
 * The page is built around the institutional model, not around office
 * holders (the Government is not yet constituted): what the Government is,
 * how the executive branch is organised around the President of the
 * Republic, what the ministries and the Council of Ministers are, and how
 * the Government carries out its action.
 *
 * The *structure* lives in `lib/government-content.ts` and every word comes
 * from the `government.*` message catalogs. Rows only link to published
 * pages: destinations that are planned but not published yet (ministries,
 * agenda, productions…) appear as institutional concepts or clean empty
 * states, so the page stays useful today and can be fed later without any
 * layout rework.
 */
export default async function GovernmentPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "government" });

  return (
    <>
      {/* 01 — Hero : what the Government is and how it is organised */}
      <section className="gov-section gov-page-hero" aria-labelledby="gov-hero-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("hero.kicker")}</p>
          <h1 id="gov-hero-title">{t("hero.title")}</h1>
          <p className="gov-page-hero__subtitle">{t("hero.subtitle")}</p>
          <p className="gov-lead">{t("hero.intro")}</p>
          <div className="gov-page-hero__actions">
            <CtaButtonsGroup
              buttons={[
                {
                  children: t("hero.compositionAction"),
                  href: governmentPaths.composition,
                  priority: "secondary",
                  iconId: "fr-icon-arrow-right-line",
                },
                {
                  children: t("hero.organisationAction"),
                  href: governmentPaths.organisation,
                  priority: "secondary",
                  iconId: "fr-icon-arrow-right-line",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 02 — Comprendre : what the Government is */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-understand-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("understand.kicker")}</p>
          <h2 id="gov-understand-title" className="gov-section__title">
            {t("understand.title")}
          </h2>
          <p className="gov-lead">{t("understand.lead")}</p>
          <ul className="gov-rows">
            {understandItems.map((item) => (
              <li key={item.key} className="gov-row">
                <h3>{t(`understand.items.${item.key}.title`)}</h3>
                <p className="gov-row__text">{t(`understand.items.${item.key}.text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 03 — L'exécutif : the President at the centre of the executive branch */}
      <section className="gov-section" aria-labelledby="gov-executive-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("executive.kicker")}</p>
          <h2 id="gov-executive-title" className="gov-section__title">
            {t("executive.title")}
          </h2>
          <p className="gov-lead">{t("executive.lead")}</p>
          <p className="gov-gov-intro">{t("executive.intro")}</p>

          {/* Institutional diagram — readable as a plain list (see aria-label). */}
          <ol className="gov-exec" aria-label={t("executive.ariaLabel")}>
            <li className="gov-exec__item">
              <div className="gov-exec__node gov-exec__node--top">
                <h3 className="gov-exec__title">{t("executive.president.title")}</h3>
                <p className="gov-exec__text">{t("executive.president.text")}</p>
              </div>
            </li>
            <li className="gov-exec__item">
              <div className="gov-exec__join gov-exec__join--labelled">
                <span aria-hidden="true" className="gov-exec__join-line" />
                <span className="gov-exec__join-label">{t("executive.relation.title")}</span>
              </div>
            </li>
            <li className="gov-exec__item">
              <div className="gov-exec__node">
                <h3 className="gov-exec__title">{t("executive.government.title")}</h3>
                <p className="gov-exec__text">{t("executive.government.text")}</p>
              </div>
            </li>
            <li aria-hidden="true" className="gov-exec__item">
              <div className="gov-exec__join">
                <span className="gov-exec__join-line" />
                <span className="gov-exec__join-bar" />
              </div>
            </li>
            <li className="gov-exec__item">
              <div className="gov-exec__branch">
                <div className="gov-exec__node">
                  <h3 className="gov-exec__title">{t("executive.ministries.title")}</h3>
                  <p className="gov-exec__text">{t("executive.ministries.text")}</p>
                </div>
                <div className="gov-exec__node">
                  <h3 className="gov-exec__title">{t("executive.secretariats.title")}</h3>
                  <p className="gov-exec__text">{t("executive.secretariats.text")}</p>
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
                <h3 className="gov-exec__title">{t("executive.administrations.title")}</h3>
                <p className="gov-exec__text">{t("executive.administrations.text")}</p>
              </div>
            </li>
          </ol>

          <p className="gov-caption">{t("executive.note")}</p>
        </div>
      </section>

      {/* 04 — L'organisation du Gouvernement */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-organisation-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("organisation.kicker")}</p>
          <h2 id="gov-organisation-title" className="gov-section__title">
            {t("organisation.title")}
          </h2>
          <p className="gov-lead">{t("organisation.lead")}</p>
          <ul className="gov-rows">
            {organisationItems.map((item) => (
              <li key={item.key} className="gov-row">
                <h3>{t(`organisation.items.${item.key}.title`)}</h3>
                <p className="gov-row__text">{t(`organisation.items.${item.key}.text`)}</p>
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
          <div className="gov-section-cta">
            <CtaButtonsGroup
              buttons={[
                {
                  children: t("organisation.detailAction"),
                  href: governmentPaths.organisation,
                  priority: "primary",
                  iconId: "fr-icon-arrow-right-line",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 05 — Les ministères */}
      <section className="gov-section" aria-labelledby="gov-ministries-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("ministries.kicker")}</p>
          <h2 id="gov-ministries-title" className="gov-section__title">
            {t("ministries.title")}
          </h2>
          <p className="gov-lead">{t("ministries.lead")}</p>
          <p className="gov-prose-paragraph">{t("ministries.paragraph")}</p>

          {ministryRecords.length === 0 ? (
            <div className="gov-section-notice">
              <NoticeCallout iconId="fr-icon-information-line" title={t("ministries.emptyTitle")}>
                {t("ministries.emptyText")}
              </NoticeCallout>
            </div>
          ) : (
            /* Feed slot: renders `government.ministries.records.<key>` rows
               once `ministryRecords` is populated — no layout rework needed. */
            <ul className="gov-rows">
              {ministryRecords.map((record) => (
                <li key={record.key} className="gov-row">
                  <h3>{t(`ministries.records.${record.key}.title`)}</h3>
                  <p className="gov-row__text">{t(`ministries.records.${record.key}.text`)}</p>
                  {record.href && (
                    <p className="gov-row__actions">
                      <Link className="gov-row__link" href={record.href}>
                        {t("readMore")}
                        <span aria-hidden="true" className="fr-icon-arrow-right-line" />
                      </Link>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}

          <h3 className="gov-section__subtitle">{t("ministries.ficheTitle")}</h3>
          <ul className="gov-fiche-list">
            {(["name", "description", "competences", "titulaire", "page"] as const).map((field) => (
              <li key={field}>{t(`ministries.fiche.${field}`)}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 06 — Le Conseil des ministres */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-council-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("council.kicker")}</p>
          <h2 id="gov-council-title" className="gov-section__title">
            {t("council.title")}
          </h2>
          <p className="gov-lead">{t("council.lead")}</p>
          <p className="gov-prose-paragraph">{t("council.paragraph")}</p>

          {councilRecords.length === 0 ? (
            <div className="gov-section-notice">
              <NoticeCallout iconId="fr-icon-calendar-line" title={t("council.emptyTitle")}>
                {t("council.emptyText")}
              </NoticeCallout>
            </div>
          ) : (
            /* Feed slot: renders `government.council.records.<key>` rows once
               councils are published — no layout rework needed. */
            <ul className="gov-rows">
              {councilRecords.map((record) => (
                <li key={record.key} className="gov-row">
                  <h3>{t(`council.records.${record.key}.title`)}</h3>
                  <p className="gov-row__text">{t(`council.records.${record.key}.text`)}</p>
                  {record.href && (
                    <p className="gov-row__actions">
                      <Link className="gov-row__link" href={record.href}>
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

      {/* 07 — L'action du Gouvernement */}
      <section className="gov-section" aria-labelledby="gov-action-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("action.kicker")}</p>
          <h2 id="gov-action-title" className="gov-section__title">
            {t("action.title")}
          </h2>
          <p className="gov-lead">{t("action.lead")}</p>
          <ul className="gov-rows">
            {actionItems.map((item) => (
              <li key={item.key} className="gov-row">
                <h3>{t(`action.items.${item.key}.title`)}</h3>
                <p className="gov-row__text">{t(`action.items.${item.key}.text`)}</p>
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
          <div className="gov-section-cta">
            <CtaButtonsGroup
              buttons={[
                {
                  children: t("action.cta"),
                  // « L'action publique » hub — published with that section;
                  // destination already carried by the main navigation.
                  href: ACTION_PUBLIQUE_PATH,
                  priority: "primary",
                  iconId: "fr-icon-arrow-right-line",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 08 — Agenda & travaux */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-productions-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("productions.kicker")}</p>
          <h2 id="gov-productions-title" className="gov-section__title">
            {t("productions.title")}
          </h2>
          <p className="gov-lead">{t("productions.lead")}</p>
          <div className="gov-section-notice">
            <NoticeCallout iconId="fr-icon-information-line" title={t("productions.emptyTitle")}>
              {t("productions.emptyText")}
            </NoticeCallout>
          </div>
          <h3 className="gov-section__subtitle">{t("productions.channelsTitle")}</h3>
          <ul className="gov-rows">
            {productionChannels.map((channel) => (
              <li key={channel.key} className="gov-row">
                <h3>{t(`productions.channels.${channel.key}.title`)}</h3>
                <p className="gov-row__text">{t(`productions.channels.${channel.key}.text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 09 — Informations gouvernementales */}
      <section className="gov-section" aria-labelledby="gov-info-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("info.kicker")}</p>
          <h2 id="gov-info-title" className="gov-section__title">
            {t("info.title")}
          </h2>
          <p className="gov-lead">{t("info.lead")}</p>
          <ul className="gov-rows gov-rows--compact">
            {infoItems.map((item) => (
              <li key={item.key} className="gov-row">
                <h3>{t(`info.items.${item.key}.title`)}</h3>
                <p className="gov-row__text">{t(`info.items.${item.key}.text`)}</p>
                {item.href &&
                  (item.external ? (
                    <p className="gov-row__actions">
                      <a className="gov-row__link" href={item.href}>
                        {t("info.readMore")}
                        <span aria-hidden="true" className="fr-icon-arrow-right-line" />
                      </a>
                    </p>
                  ) : (
                    <p className="gov-row__actions">
                      <Link className="gov-row__link" href={item.href}>
                        {t("info.readMore")}
                        <span aria-hidden="true" className="fr-icon-arrow-right-line" />
                      </Link>
                    </p>
                  ))}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
