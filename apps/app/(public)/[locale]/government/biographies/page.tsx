import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { Link } from "@/i18n/navigation";
import {
  getAllBiographies,
  getActiveBiographies,
  relatedItems,
  type BiographyProfile,
} from "@/lib/government-biographies";
import { NoticeCallout } from "@/components/public/content/ads-fragments";

const PAGE_PATH = "/government/biographies";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  const t = await getTranslations({ locale, namespace: "pages.biographies" });

  return {
    title: t("title"),
    description: t("description"),
    ...localizedAlternates(locale, PAGE_PATH),
  };
}

/**
 * `/government/biographies` — the institutional biographical directory of
 * the Government of the Republic of Astoria.
 *
 * This page answers « who are the officials who make up or have made up the
 * Government, and what is their institutional background? », complementing
 * `/government/membres` (which answers « who currently holds the government
 * offices? ») and `/government/liamvonastoria` (the detailed presidential
 * profile).
 *
 * The President is presented first as a function with a specific institutional
 * status, then the other current officials, then any past officials. No
 * biography, function, date or portrait is invented: only officially published
 * data is rendered.
 */
export default async function BiographiesPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "biographies" });
  const tOffices = await getTranslations({ locale, namespace: "government.offices" });

  const allBiographies = getAllBiographies();
  const activeBiographies = getActiveBiographies();

  // The president is separated from the rest (institutional status)
  const president = allBiographies.find(
    (b) => b.currentOffice?.type === "president"
  );
  const otherActive = activeBiographies.filter(
    (b) => b.currentOffice?.type !== "president"
  );

  const hasAnyProfile = allBiographies.length > 0;

  return (
    <>
      {/* 01 — Hero : the institutional biographical directory */}
      <section className="gov-section gov-page-hero" aria-labelledby="gov-biographies-hero-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("hero.kicker")}</p>
          <h1 id="gov-biographies-hero-title">{t("hero.title")}</h1>
          <p className="gov-page-hero__subtitle">{t("hero.subtitle")}</p>
          <p className="gov-lead">{t("hero.intro")}</p>
        </div>
      </section>

      {/* 02 — Président de la République : the specific institutional status */}
      {president && (
        <section className="gov-section gov-section--subtle" aria-labelledby="gov-biographies-president-title">
          <div className="gov-section__container">
            <p className="gov-kicker">{t("president.kicker")}</p>
            <h2 id="gov-biographies-president-title" className="gov-section__title">
              {t("president.title")}
            </h2>
            <p className="gov-lead">{t("president.lead")}</p>

            <BiographyCard
              profile={president}
              t={t}
              tOffices={tOffices}
            />

            {president.profileHref && (
              <p className="gov-office__holder" style={{ marginTop: "1rem" }}>
                <Link className="gov-row__link" href={president.profileHref}>
                  {t("president.profileLink")}
                  <span aria-hidden="true" className="fr-icon-arrow-right-line" />
                </Link>
              </p>
            )}
          </div>
        </section>
      )}

      {/* 03 — Responsables actuellement en fonction */}
      <section className="gov-section" aria-labelledby="gov-biographies-current-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("current.kicker")}</p>
          <h2 id="gov-biographies-current-title" className="gov-section__title">
            {t("current.title")}
          </h2>
          <p className="gov-lead">{t("current.lead")}</p>

          {otherActive.length === 0 ? (
            <div className="gov-section-notice">
              <NoticeCallout iconId="fr-icon-information-line">
                {t("current.emptyText")}
              </NoticeCallout>
            </div>
          ) : (
            <ul className="gov-rows">
              {otherActive.map((profile) => (
                <li key={profile.person.id} className="gov-row">
                  <BiographyCard
                    profile={profile}
                    t={t}
                    tOffices={tOffices}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 04 — Pour aller plus loin : outbound links */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-biographies-related-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("related.kicker")}</p>
          <h2 id="gov-biographies-related-title" className="gov-section__title">
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

/**
 * Renders a single biographical profile card. The card is institutionally
 * sobe: official portrait, full name, office title, ministry, and a link
 * to the dedicated profile page when available.
 */
function BiographyCard({
  profile,
  t,
  tOffices,
}: {
  profile: BiographyProfile;
  t: Awaited<ReturnType<typeof getTranslations>>;
  tOffices: Awaited<ReturnType<typeof getTranslations>>;
}) {
  const fullName = `${profile.person.firstName} ${profile.person.lastName}`;
  const officeTitle = profile.currentOffice
    ? tOffices(profile.currentOffice.titleKey)
    : tOffices("president");

  return (
    <article className="gov-office">
      {profile.person.photo && (
        <img
          className="gov-members__portrait"
          src={profile.person.photo}
          alt={t("profile.portraitAlt", {
            name: fullName,
            title: officeTitle,
          })}
        />
      )}
      <p className="gov-office__type">{officeTitle}</p>
      <h3 className="gov-office__name">{fullName}</h3>
      {profile.currentMinistry && (
        <p className="gov-office__text">
          {t("profile.ministryLabel")} {profile.currentMinistry.name}
        </p>
      )}
      {profile.currentHolder?.startDate && (
        <p className="gov-office__text">
          {t("profile.sinceLabel")} {profile.currentHolder.startDate}
        </p>
      )}
      {profile.profileHref && (
        <p className="gov-office__holder">
          <Link className="gov-row__link" href={profile.profileHref}>
            {t("profile.profileLink")}
            <span aria-hidden="true" className="fr-icon-arrow-right-line" />
          </Link>
        </p>
      )}
    </article>
  );
}
