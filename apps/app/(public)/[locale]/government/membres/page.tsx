import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { Link } from "@/i18n/navigation";
import { getCurrentGovernment, getMemberProfileHref, relatedItems } from "@/lib/government-members";
import { NoticeCallout } from "@/components/public/content/ads-fragments";

const PAGE_PATH = "/government/membres";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  const t = await getTranslations({ locale, namespace: "pages.membres" });

  return {
    title: t("title"),
    description: t("description"),
    ...localizedAlternates(locale, PAGE_PATH),
  };
}

/**
 * `/government/membres` — the official page on the members of the Government
 * of the Republic of Astoria.
 *
 * It answers « who currently holds the government offices? », complementing
 * `/government/composition` (which answers « what is the Government made
 * of? ») and `/government/ministere` (which presents the ministries): the
 * President of the Republic is presented separately — the central executive
 * office of the Astorian model, not a minister among others — then the
 * ministers, then the secretaries of state.
 *
 * The data comes from the shared model of `lib/government-ministries.ts`,
 * joined by `lib/government-members.ts` (person → holder → post → ministry).
 * Today no appointment is officially published: the page shows one clean
 * institutional empty state instead of empty grids or invented numbers. Once
 * the arrays of the shared model are fed, the sections render the members
 * without any front-end rework.
 */
export default async function GovernmentMembersPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "membres" });
  const tOffices = await getTranslations({ locale, namespace: "government.offices" });

  const current = getCurrentGovernment();
  const presidentProfileHref = current.president ? getMemberProfileHref(current.president) : undefined;
  const hasAnyMember =
    current.president !== undefined ||
    current.ministers.length > 0 ||
    current.secretaries.length > 0;

  return (
    <>
      {/* 01 — Hero : the members of the Government, in their institutional context */}
      <section className="gov-section gov-page-hero" aria-labelledby="gov-members-hero-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("hero.kicker")}</p>
          <h1 id="gov-members-hero-title">{t("hero.title")}</h1>
          <p className="gov-page-hero__subtitle">{t("hero.subtitle")}</p>
          <p className="gov-lead">{t("hero.intro")}</p>
        </div>
      </section>

      {/* 02 — Composition actuelle : synthesis, only when real data exists
             (no invented « 0 ministres » counts on an empty database). */}
      {hasAnyMember && (
        <section className="gov-section gov-section--subtle" aria-labelledby="gov-members-summary-title">
          <div className="gov-section__container">
            <p className="gov-kicker">{t("summary.kicker")}</p>
            <h2 id="gov-members-summary-title" className="gov-section__title">
              {t("summary.title")}
            </h2>
            <ul className="gov-rows gov-rows--compact">
              {current.president && (
                <li className="gov-row">
                  <h3>{t("summary.presidentLabel")}</h3>
                  <p className="gov-row__text">
                    {current.president.person.firstName} {current.president.person.lastName}
                  </p>
                </li>
              )}
              {current.ministers.length > 0 && (
                <li className="gov-row">
                  <h3>{t("summary.ministersLabel")}</h3>
                  <p className="gov-row__text">
                    {t("summary.membersCount", { count: current.ministers.length })}
                  </p>
                </li>
              )}
              {current.secretaries.length > 0 && (
                <li className="gov-row">
                  <h3>{t("summary.secretariesLabel")}</h3>
                  <p className="gov-row__text">
                    {t("summary.membersCount", { count: current.secretaries.length })}
                  </p>
                </li>
              )}
            </ul>
          </div>
        </section>
      )}

      {!hasAnyMember ? (
        /* 03 — État institutionnel : the Government is not constituted yet. */
        <section className="gov-section" aria-labelledby="gov-members-empty-title">
          <div className="gov-section__container">
            <p className="gov-kicker">{t("empty.kicker")}</p>
            <h2 id="gov-members-empty-title" className="gov-section__title">
              {t("empty.title")}
            </h2>
            <p className="gov-lead">{t("empty.lead")}</p>
            <div className="gov-section-notice">
              <NoticeCallout iconId="fr-icon-information-line" title={t("empty.noticeTitle")}>
                {t("empty.noticeText")}
              </NoticeCallout>
            </div>
          </div>
        </section>
      ) : (
        /* Sections rendered from the data as soon as the Government is
           constituted. Each empty section keeps a neutral institutional
           state (partial constitution is supported: no grid is shown for a
           category without published holders). */
        <>
          {/* 03 — Le Président de la République, presented separately */}
          {current.president && (
            <section className="gov-section" aria-labelledby="gov-members-president-title">
              <div className="gov-section__container">
                <p className="gov-kicker">{t("president.kicker")}</p>
                <h2 id="gov-members-president-title" className="gov-section__title">
                  {t("president.title")}
                </h2>
                <p className="gov-lead">{t("president.lead")}</p>

                <article className="gov-office">
                  <p className="gov-office__type">{tOffices(current.president.office.titleKey)}</p>
                  <h3 className="gov-office__name">
                    {current.president.person.firstName} {current.president.person.lastName}
                  </h3>
                  {current.president.person.photo && (
                    <img
                      className="gov-members__portrait"
                      src={current.president.person.photo}
                      alt={t("members.portraitAlt", {
                        name: `${current.president.person.firstName} ${current.president.person.lastName}`,
                        title: tOffices(current.president.office.titleKey),
                      })}
                    />
                  )}
                  {current.president.holder.startDate && (
                    <p className="gov-office__text">
                      {t("president.sinceLabel")} {current.president.holder.startDate}
                    </p>
                  )}
                  {presidentProfileHref && (
                    <p className="gov-office__holder">
                      <Link className="gov-row__link" href={presidentProfileHref}>
                        {t("members.profileLink")}
                        <span aria-hidden="true" className="fr-icon-arrow-right-line" />
                      </Link>
                    </p>
                  )}
                </article>
              </div>
            </section>
          )}

          {/* 04 — Les ministres */}
          <section className="gov-section gov-section--subtle" aria-labelledby="gov-members-ministers-title">
            <div className="gov-section__container">
              <p className="gov-kicker">{t("ministers.kicker")}</p>
              <h2 id="gov-members-ministers-title" className="gov-section__title">
                {t("ministers.title")}
              </h2>
              <p className="gov-lead">{t("ministers.lead")}</p>

              {current.ministers.length === 0 ? (
                <div className="gov-section-notice">
                  <NoticeCallout iconId="fr-icon-information-line">{t("ministers.emptyText")}</NoticeCallout>
                </div>
              ) : (
                <ul className="gov-rows">
                  {current.ministers.map((membership) => {
                    const profileHref = getMemberProfileHref(membership);
                    return (
                      <li key={membership.office.id} className="gov-row">
                        <h3>
                          {membership.person.firstName} {membership.person.lastName}
                        </h3>
                        <p className="gov-row__text">{tOffices(membership.office.titleKey)}</p>
                        {membership.ministry && (
                          <p className="gov-row__text">
                            {t("members.ministryLabel")}{" "}
                            {membership.ministry.href ? (
                              <Link className="gov-row__link" href={membership.ministry.href}>
                                {membership.ministry.name}
                              </Link>
                            ) : (
                              membership.ministry.name
                            )}
                          </p>
                        )}
                        {membership.holder.startDate && (
                          <p className="gov-row__text">
                            {t("members.sinceLabel")} {membership.holder.startDate}
                          </p>
                        )}
                        {profileHref && (
                          <p className="gov-row__actions">
                            <Link className="gov-row__link" href={profileHref}>
                              {t("members.profileLink")}
                              <span aria-hidden="true" className="fr-icon-arrow-right-line" />
                            </Link>
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>

          {/* 05 — Les secrétaires d'État */}
          <section className="gov-section" aria-labelledby="gov-members-secretaries-title">
            <div className="gov-section__container">
              <p className="gov-kicker">{t("secretaries.kicker")}</p>
              <h2 id="gov-members-secretaries-title" className="gov-section__title">
                {t("secretaries.title")}
              </h2>
              <p className="gov-lead">{t("secretaries.lead")}</p>

              {current.secretaries.length === 0 ? (
                <div className="gov-section-notice">
                  <NoticeCallout iconId="fr-icon-information-line">{t("secretaries.emptyText")}</NoticeCallout>
                </div>
              ) : (
                <ul className="gov-rows">
                  {current.secretaries.map((membership) => {
                    const profileHref = getMemberProfileHref(membership);
                    return (
                      <li key={membership.office.id} className="gov-row">
                        <h3>
                          {membership.person.firstName} {membership.person.lastName}
                        </h3>
                        <p className="gov-row__text">{tOffices(membership.office.titleKey)}</p>
                        {membership.ministry && (
                          <p className="gov-row__text">
                            {t("members.ministryLabel")}{" "}
                            {membership.ministry.href ? (
                              <Link className="gov-row__link" href={membership.ministry.href}>
                                {membership.ministry.name}
                              </Link>
                            ) : (
                              membership.ministry.name
                            )}
                          </p>
                        )}
                        {membership.holder.startDate && (
                          <p className="gov-row__text">
                            {t("members.sinceLabel")} {membership.holder.startDate}
                          </p>
                        )}
                        {profileHref && (
                          <p className="gov-row__actions">
                            <Link className="gov-row__link" href={profileHref}>
                              {t("members.profileLink")}
                              <span aria-hidden="true" className="fr-icon-arrow-right-line" />
                            </Link>
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        </>
      )}

      {/* 06 — Pour aller plus loin : outbound links */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-members-related-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("related.kicker")}</p>
          <h2 id="gov-members-related-title" className="gov-section__title">
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