import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { Link } from "@/i18n/navigation";
import { getCurrentGovernment } from "@/lib/government-members";
import { presidentPaths, relatedItems, responsibilityItems } from "@/lib/government-president";
import { CtaButtonsGroup, NoticeCallout } from "@/components/public/content/ads-fragments";

const PAGE_PATH = "/government/liamvonastoria";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  const t = await getTranslations({ locale, namespace: "pages.president" });

  return {
    title: t("title"),
    description: t("description"),
    ...localizedAlternates(locale, PAGE_PATH),
  };
}

/**
 * `/government/liamvonastoria` — the official presidential page of the
 * Republic of Astoria, dedicated to the office and to its current holder.
 *
 * The page says « here is the President of the Republic, his institutional
 * role and responsibilities, and currently the person exercising this
 * office: Liam Von Astoria » — never the reverse. The President is first the
 * central executive office of the Astorian model (Head of State, executive
 * power, direction and coordination of the Government), the person only the
 * temporary holder of that office.
 *
 * The holder is joined from the shared data model (`government-ministries.ts`
 * via `government-members.ts`), never hardcoded in this page: a future
 * succession archives the current holder and attaches the next one as a data
 * update. No biography, portrait, agenda, speech or news is published yet —
 * none is invented. The institutional sections below are the clean base the
 * future content will plug into.
 */
export default async function PresidentPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "president" });
  const tOffices = await getTranslations({ locale, namespace: "government.offices" });

  const president = getCurrentGovernment().president;
  const presidentName = president
    ? `${president.person.firstName} ${president.person.lastName}`
    : null;
  const officeTitle = president ? tOffices(president.office.titleKey) : tOffices("president");

  return (
    <>
      {/* 01 — Hero : the office first, then the person who holds it.
             CV-style lockup: official portrait on the left, identity (title,
             office, description) on the right — the portrait is an
             identification element, not a decorative one. */}
      <section className="gov-section gov-page-hero gov-president-hero" aria-labelledby="gov-president-hero-title">
        <div className="gov-section__container">
          <div className="gov-president-hero__layout">
            {president?.person.photo && (
              <img
                className="gov-president-hero__portrait"
                src={president.person.photo}
                alt={t("hero.portraitAlt", {
                  name: presidentName ?? "",
                  office: officeTitle,
                })}
              />
            )}
            <div className="gov-president-hero__identity">
              <p className="gov-kicker">{officeTitle}</p>
              <h1 id="gov-president-hero-title">{presidentName ?? officeTitle}</h1>
              <p className="gov-page-hero__subtitle">{t("hero.subtitle")}</p>
              <p className="gov-lead">{t("hero.intro")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — La fonction : what the President of the Republic is */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-president-office-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("office.kicker")}</p>
          <h2 id="gov-president-office-title" className="gov-section__title">
            {t("office.title")}
          </h2>
          <p className="gov-lead">{t("office.lead")}</p>
          <p className="gov-prose-paragraph">{t("office.paragraph1")}</p>
          <p className="gov-prose-paragraph">{t("office.paragraph2")}</p>
        </div>
      </section>

      {/* 03 — Les responsabilités du Président */}
      <section className="gov-section" aria-labelledby="gov-president-responsibilities-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("responsibilities.kicker")}</p>
          <h2 id="gov-president-responsibilities-title" className="gov-section__title">
            {t("responsibilities.title")}
          </h2>
          <p className="gov-lead">{t("responsibilities.lead")}</p>
          <ul className="gov-rows">
            {responsibilityItems.map((item) => (
              <li key={item.key} className="gov-row">
                <h3>{t(`responsibilities.items.${item.key}.title`)}</h3>
                <p className="gov-row__text">{t(`responsibilities.items.${item.key}.text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 04 — Le Président et le Gouvernement : institutional diagram */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-president-diagram-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("diagram.kicker")}</p>
          <h2 id="gov-president-diagram-title" className="gov-section__title">
            {t("diagram.title")}
          </h2>
          <p className="gov-lead">{t("diagram.lead")}</p>

          {/* Diagram — readable as a plain list (see aria-label). */}
          <ol className="gov-exec" aria-label={t("diagram.ariaLabel")}>
            <li className="gov-exec__item">
              <div className="gov-exec__node gov-exec__node--top">
                <h3 className="gov-exec__title">{t("diagram.president.title")}</h3>
                <p className="gov-exec__text">{t("diagram.president.text")}</p>
              </div>
            </li>
            <li className="gov-exec__item">
              <div className="gov-exec__join gov-exec__join--labelled">
                <span aria-hidden="true" className="gov-exec__join-line" />
                <span className="gov-exec__join-label">{t("diagram.relation.title")}</span>
              </div>
            </li>
            <li className="gov-exec__item">
              <div className="gov-exec__node">
                <h3 className="gov-exec__title">{t("diagram.government.title")}</h3>
                <p className="gov-exec__text">{t("diagram.government.text")}</p>
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
                  <h3 className="gov-exec__title">{t("diagram.ministries.title")}</h3>
                  <p className="gov-exec__text">{t("diagram.ministries.text")}</p>
                </div>
                <div className="gov-exec__node">
                  <h3 className="gov-exec__title">{t("diagram.secretariats.title")}</h3>
                  <p className="gov-exec__text">{t("diagram.secretariats.text")}</p>
                </div>
                <div className="gov-exec__node">
                  <h3 className="gov-exec__title">{t("diagram.administrations.title")}</h3>
                  <p className="gov-exec__text">{t("diagram.administrations.text")}</p>
                </div>
              </div>
            </li>
          </ol>

          <p className="gov-caption">{t("diagram.note")}</p>
        </div>
      </section>

      {/* 05 — Le Président et l'action publique : bridge to public action */}
      <section className="gov-section" aria-labelledby="gov-president-action-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("action.kicker")}</p>
          <h2 id="gov-president-action-title" className="gov-section__title">
            {t("action.title")}
          </h2>
          <p className="gov-lead">{t("action.lead")}</p>
          <div className="gov-section-cta">
            <CtaButtonsGroup
              buttons={[
                {
                  children: t("action.cta"),
                  // « L'action du Gouvernement » is documented on the
                  // institutional hub (published) until the dedicated
                  // public-action section ships.
                  href: presidentPaths.hub,
                  priority: "primary",
                  iconId: "fr-icon-arrow-right-line",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 06 — Le mandat présidentiel : the office, its current holder */}
      {president && (
        <section className="gov-section gov-section--subtle" aria-labelledby="gov-president-mandate-title">
          <div className="gov-section__container">
            <p className="gov-kicker">{t("mandate.kicker")}</p>
            <h2 id="gov-president-mandate-title" className="gov-section__title">
              {t("mandate.title")}
            </h2>
            <p className="gov-lead">{t("mandate.lead")}</p>

            <article className="gov-office">
              <p className="gov-office__type">{officeTitle}</p>
              <h3 className="gov-office__name">{presidentName}</h3>
              {president.holder.startDate && (
                <p className="gov-office__text">
                  {t("mandate.sinceLabel")} {president.holder.startDate}
                </p>
              )}
              <p className="gov-office__holder">
                <Link className="gov-row__link" href={presidentPaths.membres}>
                  {t("mandate.membersLink")}
                  <span aria-hidden="true" className="fr-icon-arrow-right-line" />
                </Link>
              </p>
            </article>
          </div>
        </section>
      )}

      {/* 07 — Agenda, discours et actualités : institutional empty state.
             Each of these spaces will get its own section as soon as the
             editorial data is published — no content is invented. */}
      <section className="gov-section" aria-labelledby="gov-president-activity-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("activity.kicker")}</p>
          <h2 id="gov-president-activity-title" className="gov-section__title">
            {t("activity.title")}
          </h2>
          <p className="gov-lead">{t("activity.lead")}</p>
          <div className="gov-section-notice">
            <NoticeCallout iconId="fr-icon-calendar-line" title={t("activity.emptyTitle")}>
              {t("activity.emptyText")}
            </NoticeCallout>
          </div>
        </div>
      </section>

      {/* 08 — Institutions liées : outbound links */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-president-related-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("related.kicker")}</p>
          <h2 id="gov-president-related-title" className="gov-section__title">
            {t("related.title")}
          </h2>
          <p className="gov-lead">{t("related.lead")}</p>
          <ul className="gov-rows">
            {relatedItems.map((item) => (
              <li key={item.key} className="gov-row">
                <h3>{t(`related.items.${item.key}.title`)}</h3>
                <p className="gov-row__text">{t(`related.items.${item.key}.text`)}</p>
                <p className="gov-row__actions">
                  <Link className="gov-row__link" href={item.href}>
                    {t("readMore")}
                    <span aria-hidden="true" className="fr-icon-arrow-right-line" />
                  </Link>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}