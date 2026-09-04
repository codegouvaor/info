import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { Link } from "@/i18n/navigation";
import { findMinistryBySlug, ministries } from "@/lib/government-ministries";
import { NoticeCallout } from "@/components/public/content/ads-fragments";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

/**
 * Static generation: pre-render one page per published ministry.
 * Only ministries whose `href` would be set get a slug page — but since we
 * now build them for all ministries, we enumerate every slug.
 */
export function generateStaticParams() {
  return ministries.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocaleParam(rawLocale);
  const t = await getTranslations({ locale, namespace: "pages.ministere" });

  const ministry = findMinistryBySlug(slug);
  if (!ministry) {
    return { title: t("title"), description: t("description") };
  }

  return {
    title: `${ministry.name} — ${t("title")}`,
    description: ministry.description,
    ...localizedAlternates(locale, `/government/ministere/${slug}`),
  };
}

/**
 * `/government/ministere/[slug]` — the detailed institutional page of a
 * ministry of the Republic of Astoria.
 *
 * The ministry is resolved from the shared data model via its slug. The page
 * presents the ministry as an autonomous institution — its description,
 * missions, competences, attached administrations and current holder — never
 * mixing institutional data with personal biography. Missing sections display
 * neutral institutional notices rather than invented content.
 *
 * Sections are designed to grow as official data becomes available: publications,
 * news, and contact information will appear here when published, without any
 * front-end rework.
 */
export default async function MinistryDetailPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const ministry = findMinistryBySlug(slug);
  if (!ministry) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "ministere.detail" });
  const tMinistere = await getTranslations({ locale, namespace: "ministere" });

  return (
    <>
      {/* 01 — Hero : the ministry identity */}
      <section className="gov-section gov-page-hero" aria-labelledby="gov-min-detail-hero-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("hero.kicker")}</p>
          <h1 id="gov-min-detail-hero-title">{ministry.name}</h1>
          <p className="gov-page-hero__subtitle">{t("hero.subtitle")}</p>
          <p className="gov-lead">{ministry.description}</p>
          <div className="gov-ministry-card__holder" style={{ marginTop: "1.5rem" }}>
            <span className="gov-ministry-card__holder-label">{t("holder.title")}</span>
            <span className="gov-ministry-card__holder-value">
              {t("holder.empty")}
            </span>
          </div>

          {ministry.officialWebsite && (
            <p style={{ marginTop: "1rem" }}>
              <a
                href={`https://${ministry.officialWebsite}`}
                className="gov-external-link-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("website")}
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
              </a>
            </p>
          )}
        </div>
      </section>

      {/* 02 — Présentation : the institutional description */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-min-detail-presentation-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("presentation.kicker")}</p>
          <h2 id="gov-min-detail-presentation-title" className="gov-section__title">
            {t("presentation.title")}
          </h2>
          {ministry.longDescription ? (
            <p className="gov-lead">{ministry.longDescription}</p>
          ) : (
            <p className="gov-lead">{ministry.description}</p>
          )}
        </div>
      </section>

      {/* 03 — Missions : the key missions of the ministry */}
      {ministry.missions && ministry.missions.length > 0 && (
        <section className="gov-section" aria-labelledby="gov-min-detail-missions-title">
          <div className="gov-section__container">
            <p className="gov-kicker">{t("missions.kicker")}</p>
            <h2 id="gov-min-detail-missions-title" className="gov-section__title">
              {t("missions.title")}
            </h2>
            <p className="gov-lead">{t("missions.lead")}</p>
            <ul className="gov-rows">
              {ministry.missions.map((mission) => (
                <li key={mission.title} className="gov-row">
                  <h3>{mission.title}</h3>
                  <p className="gov-row__text">{mission.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 04 — Compétences : policy domains and areas of responsibility */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-min-detail-competences-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("competences.kicker")}</p>
          <h2 id="gov-min-detail-competences-title" className="gov-section__title">
            {t("competences.title")}
          </h2>
          <p className="gov-lead">{t("competences.lead")}</p>

          {ministry.responsibilities.length > 0 && (
            <>
              <h3 className="gov-section__subtitle">{tMinistere("directory.responsibilitiesLabel")}</h3>
              <ul className="gov-ministry-card__competences" aria-label={tMinistere("directory.responsibilitiesLabel")}>
                {ministry.responsibilities.map((resp) => (
                  <li key={resp} className="gov-ministry-card__competence">
                    {resp}
                  </li>
                ))}
              </ul>
            </>
          )}

          {ministry.policyDomains && ministry.policyDomains.length > 0 && (
            <>
              <h3 className="gov-section__subtitle">{t("competences.title")}</h3>
              <ul className="gov-rows">
                {ministry.policyDomains.map((domain) => (
                  <li key={domain} className="gov-row gov-rows--compact">
                    <p className="gov-row__text">{domain}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      {/* 05 — Ministre : current holder */}
      <section className="gov-section" aria-labelledby="gov-min-detail-holder-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("holder.kicker")}</p>
          <h2 id="gov-min-detail-holder-title" className="gov-section__title">
            {t("holder.title")}
          </h2>
          <div className="gov-section-notice">
            <NoticeCallout iconId="fr-icon-information-line">
              {t("holder.empty")}
            </NoticeCallout>
          </div>
        </div>
      </section>

      {/* 06 — Administrations rattachées */}
      {ministry.attachedAdministrations && ministry.attachedAdministrations.length > 0 && (
        <section className="gov-section gov-section--subtle" aria-labelledby="gov-min-detail-admins-title">
          <div className="gov-section__container">
            <p className="gov-kicker">{t("administrations.kicker")}</p>
            <h2 id="gov-min-detail-admins-title" className="gov-section__title">
              {t("administrations.title")}
            </h2>
            <p className="gov-lead">{t("administrations.lead")}</p>
            <ul className="gov-rows">
              {ministry.attachedAdministrations.map((admin) => (
                <li key={admin.name} className="gov-row">
                  <h3>{admin.name}</h3>
                  {admin.description && (
                    <p className="gov-row__text">{admin.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 07 — Publications : institutional empty state */}
      <section className="gov-section" aria-labelledby="gov-min-detail-publications-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("publications.kicker")}</p>
          <h2 id="gov-min-detail-publications-title" className="gov-section__title">
            {t("publications.title")}
          </h2>
          <div className="gov-section-notice">
            <NoticeCallout iconId="fr-icon-file-text-line">
              {t("publications.empty")}
            </NoticeCallout>
          </div>
        </div>
      </section>

      {/* 08 — Actualités : institutional empty state */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-min-detail-news-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("news.kicker")}</p>
          <h2 id="gov-min-detail-news-title" className="gov-section__title">
            {t("news.title")}
          </h2>
          <div className="gov-section-notice">
            <NoticeCallout iconId="fr-icon-newspaper-line">
              {t("news.empty")}
            </NoticeCallout>
          </div>
        </div>
      </section>

      {/* 09 — Contact : institutional empty state */}
      <section className="gov-section" aria-labelledby="gov-min-detail-contact-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("contact.kicker")}</p>
          <h2 id="gov-min-detail-contact-title" className="gov-section__title">
            {t("contact.title")}
          </h2>
          <div className="gov-section-notice">
            <NoticeCallout iconId="fr-icon-mail-line">
              {t("contact.empty")}
            </NoticeCallout>
          </div>
        </div>
      </section>

      {/* 10 — Retour à l'annuaire */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-min-detail-back">
        <div className="gov-section__container">
          <p className="gov-office__holder">
            <Link className="gov-row__link" href="/government/ministere">
              {t("backLink")}
              <span aria-hidden="true" className="fr-icon-arrow-right-line" />
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
