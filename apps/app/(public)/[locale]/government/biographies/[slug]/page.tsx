import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { Link } from "@/i18n/navigation";
import { getAllBiographies } from "@/lib/government-biographies";
import { NoticeCallout } from "@/components/public/content/ads-fragments";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocaleParam(rawLocale);
  const t = await getTranslations({ locale, namespace: "pages.biographies" });

  const biographies = getAllBiographies();
  const profile = biographies.find((b) => b.person.slug === slug);

  if (!profile) {
    return { title: t("title"), description: t("description") };
  }

  const fullName = `${profile.person.firstName} ${profile.person.lastName}`;
  const tOffices = await getTranslations({ locale, namespace: "government.offices" });
  const officeTitle = profile.currentOffice
    ? tOffices(profile.currentOffice.titleKey)
    : tOffices("president");

  return {
    title: `${fullName} — ${officeTitle}`,
    description: t("description"),
    ...localizedAlternates(locale, `/government/biographies/${slug}`),
  };
}

/**
 * `/government/biographies/[slug]` — the detailed biographical profile of
 * a government official.
 *
 * This page presents the person's institutional identity, current function,
 * and sections for institutional career, professional background, education
 * and publications. Only officially published data is rendered: missing
 * sections display a neutral institutional notice rather than invented content.
 *
 * For the President of the Republic, this page provides a synthetic view and
 * links to the dedicated presidential profile at `/government/liamvonastoria`.
 */
export default async function BiographyDetailPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "biographies.detail" });
  const tOffices = await getTranslations({ locale, namespace: "government.offices" });

  const biographies = getAllBiographies();
  const profile = biographies.find((b) => b.person.slug === slug);

  if (!profile) {
    notFound();
  }

  const fullName = `${profile.person.firstName} ${profile.person.lastName}`;
  const officeTitle = profile.currentOffice
    ? tOffices(profile.currentOffice.titleKey)
    : tOffices("president");

  return (
    <>
      {/* 01 — Hero : person identity */}
      <section className="gov-section gov-page-hero gov-president-hero" aria-labelledby="gov-biography-hero-title">
        <div className="gov-section__container">
          <div className="gov-president-hero__layout">
            {profile.person.photo && (
              <img
                className="gov-president-hero__portrait"
                src={profile.person.photo}
                alt={t("identity.title") + ` — ${fullName}`}
              />
            )}
            <div className="gov-president-hero__identity">
              <p className="gov-kicker">{officeTitle}</p>
              <h1 id="gov-biography-hero-title">{fullName}</h1>
              {profile.currentMinistry && (
                <p className="gov-page-hero__subtitle">
                  {t("identity.ministryLabel")} {profile.currentMinistry.name}
                </p>
              )}
              {profile.currentHolder?.startDate && (
                <p className="gov-lead">
                  {t("identity.sinceLabel")} {profile.currentHolder.startDate}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 02 — Fonction actuelle */}
      {profile.currentOffice && (
        <section className="gov-section gov-section--subtle" aria-labelledby="gov-biography-office-title">
          <div className="gov-section__container">
            <p className="gov-kicker">{t("currentOffice.kicker")}</p>
            <h2 id="gov-biography-office-title" className="gov-section__title">
              {t("currentOffice.title")}
            </h2>
            <p className="gov-lead">{officeTitle}</p>
            {profile.currentMinistry && (
              <p className="gov-prose-paragraph">
                {t("currentOffice.roleLabel")} : {profile.currentMinistry.name}
              </p>
            )}
          </div>
        </section>
      )}

      {/* 03 — Parcours institutionnel */}
      <section className="gov-section" aria-labelledby="gov-biography-career-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("career.kicker")}</p>
          <h2 id="gov-biography-career-title" className="gov-section__title">
            {t("career.title")}
          </h2>
          <div className="gov-section-notice">
            <NoticeCallout iconId="fr-icon-information-line">
              {t("career.emptyText")}
            </NoticeCallout>
          </div>
        </div>
      </section>

      {/* 04 — Parcours professionnel */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-biography-professional-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("professional.kicker")}</p>
          <h2 id="gov-biography-professional-title" className="gov-section__title">
            {t("professional.title")}
          </h2>
          <div className="gov-section-notice">
            <NoticeCallout iconId="fr-icon-information-line">
              {t("professional.emptyText")}
            </NoticeCallout>
          </div>
        </div>
      </section>

      {/* 05 — Formation */}
      <section className="gov-section" aria-labelledby="gov-biography-education-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("education.kicker")}</p>
          <h2 id="gov-biography-education-title" className="gov-section__title">
            {t("education.title")}
          </h2>
          <div className="gov-section-notice">
            <NoticeCallout iconId="fr-icon-information-line">
              {t("education.emptyText")}
            </NoticeCallout>
          </div>
        </div>
      </section>

      {/* 06 — Publications & discours */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-biography-publications-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("publications.kicker")}</p>
          <h2 id="gov-biography-publications-title" className="gov-section__title">
            {t("publications.title")}
          </h2>
          <div className="gov-section-notice">
            <NoticeCallout iconId="fr-icon-information-line">
              {t("publications.emptyText")}
            </NoticeCallout>
          </div>
        </div>
      </section>

      {/* 07 — Lien vers le profil détaillé du Président (si applicable) */}
      {profile.currentOffice?.type === "president" && profile.profileHref && (
        <section className="gov-section" aria-labelledby="gov-biography-president-link">
          <div className="gov-section__container">
            <p className="gov-kicker">{t("identity.kicker")}</p>
            <h2 id="gov-biography-president-link" className="gov-section__title">
              {t("identity.title")}
            </h2>
            <p className="gov-lead">
              {t("biographyUnavailable", { name: fullName })}
            </p>
            <div className="gov-section-cta">
              <p className="gov-office__holder">
                <Link className="gov-row__link" href={profile.profileHref}>
                  {t("presidentLink")}
                  <span aria-hidden="true" className="fr-icon-arrow-right-line" />
                </Link>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 08 — Retour aux biographies */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-biography-back">
        <div className="gov-section__container">
          <p className="gov-office__holder">
            <Link className="gov-row__link" href="/government/biographies">
              {t("backLink")}
              <span aria-hidden="true" className="fr-icon-arrow-right-line" />
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
