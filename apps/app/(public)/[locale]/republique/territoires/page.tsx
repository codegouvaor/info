import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { Link } from "@/i18n/navigation";
import {
  territories,
  territoryLevels,
  distinctionItems,
  navigationLinks,
} from "@/lib/territories";
import { NoticeCallout } from "@/components/public/content/ads-fragments";

const PAGE_PATH = "/republique/territoires";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  const t = await getTranslations({ locale, namespace: "pages.territoires" });

  return {
    title: t("title"),
    description: t("description"),
    ...localizedAlternates(locale, PAGE_PATH),
  };
}

/**
 * `/republique/territoires` — the institutional reference page for the
 * territorial organisation of the Republic of Astoria.
 *
 * This page serves as the institutional directory of territorial structures.
 * It is distinct from:
 *   - /republique/organisation (how the State is organised)
 *   - /republique/administrations (administrative structures)
 *   - /republique/autorites-publiques (public authorities)
 *   - /services-publics (the services accessible to citizens)
 *
 * The page works with an empty or partial directory: when no territories
 * are officially published, it renders a clean institutional "under
 * construction" state rather than any fabricated content.
 */
export default async function TerritoiresPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "territoires" });

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="gov-section gov-page-hero" aria-labelledby="territoires-hero-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("hero.kicker")}</p>
          <h1 id="territoires-hero-title">{t("hero.title")}</h1>
          <p className="gov-page-hero__subtitle">{t("hero.subtitle")}</p>
          <p className="gov-lead">{t("hero.lead")}</p>
        </div>
      </section>

      {/* ── Introduction ──────────────────────────────────────────────── */}
      <section className="gov-section gov-section--subtle" aria-labelledby="territoires-intro-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("intro.kicker")}</p>
          <h2 id="territoires-intro-title" className="gov-section__title">
            {t("intro.title")}
          </h2>
          <p className="gov-lead">{t("intro.lead")}</p>
          <p className="gov-gov-intro">{t("intro.note")}</p>
        </div>
      </section>

      {/* ── Distinctions ──────────────────────────────────────────────── */}
      <section className="gov-section" aria-labelledby="territoires-distinctions-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("distinctions.kicker")}</p>
          <h2 id="territoires-distinctions-title" className="gov-section__title">
            {t("distinctions.title")}
          </h2>
          <p className="gov-lead">{t("distinctions.lead")}</p>
          <ul className="gov-rows">
            {distinctionItems.map((item) => (
              <li key={item.key} className="gov-row">
                <h3>{t(`distinctions.items.${item.key}.title`)}</h3>
                <p className="gov-row__text">{t(`distinctions.items.${item.key}.text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Territorial levels ────────────────────────────────────────── */}
      <section className="gov-section gov-section--subtle" id="territoires-levels" aria-labelledby="territoires-levels-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("levels.kicker")}</p>
          <h2 id="territoires-levels-title" className="gov-section__title">
            {t("levels.title")}
          </h2>
          <p className="gov-lead">{t("levels.lead")}</p>

          {territoryLevels.length === 0 ? (
            <div className="gov-administrations-empty">
              <NoticeCallout iconId="fr-icon-information-line" title={t("levels.emptyTitle")}>
                {t("levels.emptyText")}
              </NoticeCallout>
            </div>
          ) : (
            <ul className="gov-rows">
              {territoryLevels.map((level) => (
                <li key={level.id} className="gov-row">
                  <h3>{level.name}</h3>
                  <p className="gov-row__text">{level.description}</p>
                  {level.responsibilities && level.responsibilities.length > 0 && (
                    <p className="gov-row__text">
                      <strong>{t("directory.competencesLabel")}</strong>{" "}
                      {level.responsibilities.join(", ")}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ── Directory ─────────────────────────────────────────────────── */}
      <section className="gov-section" id="territoires-directory" aria-labelledby="territoires-directory-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("directory.kicker")}</p>
          <h2 id="territoires-directory-title" className="gov-section__title">
            {t("directory.title")}
          </h2>
          <p className="gov-lead">{t("directory.lead")}</p>

          {territories.length === 0 ? (
            /* ── Empty state: directory under construction ──────────────── */
            <div className="gov-administrations-empty">
              <NoticeCallout iconId="fr-icon-information-line" title={t("directory.emptyTitle")}>
                {t("directory.emptyText")}
              </NoticeCallout>

              <p className="gov-administrations-empty__fiche-title">
                {t("directory.ficheTitle")}
              </p>
              <ul className="gov-fiche-list">
                <li>{t("directory.fiche.name")}</li>
                <li>{t("directory.fiche.description")}</li>
                <li>{t("directory.fiche.type")}</li>
                <li>{t("directory.fiche.competences")}</li>
                <li>{t("directory.fiche.rattachement")}</li>
                <li>{t("directory.fiche.page")}</li>
              </ul>
            </div>
          ) : (
            /* ── Populated state: territory cards ───────────────────────── */
            <ul className="gov-administration-list">
              {territories.map((territory) => (
                <li key={territory.id} className="gov-administration-card">
                  <h3 className="gov-administration-card__name">{territory.name}</h3>
                  <p className="gov-administration-card__description">{territory.description}</p>

                  {territory.type && (
                    <p className="gov-administration-card__domain">
                      <span className="gov-administration-card__domain-label">
                        {t("directory.typeLabel")}
                      </span>{" "}
                      {territory.type}
                    </p>
                  )}

                  {territory.responsibilities && territory.responsibilities.length > 0 && (
                    <>
                      <p className="gov-administration-card__section-title">
                        {t("directory.competencesLabel")}
                      </p>
                      <ul className="gov-administration-card__competences">
                        {territory.responsibilities.map((resp) => (
                          <li key={resp} className="gov-administration-card__competence">
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {territory.institutionalAuthority && (
                    <p className="gov-administration-card__parent">
                      <span className="gov-administration-card__parent-label">
                        {t("directory.authorityLabel")}
                      </span>{" "}
                      {territory.institutionalAuthority}
                    </p>
                  )}

                  {territory.parentTerritoryId && (
                    <p className="gov-administration-card__parent">
                      <span className="gov-administration-card__parent-label">
                        {t("directory.parentLabel")}
                      </span>{" "}
                      {territory.parentTerritoryId}
                    </p>
                  )}

                  <div className="gov-administration-card__actions">
                    {territory.website && (
                      <a
                        href={`https://${territory.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gov-external-link-btn"
                      >
                        {t("directory.website")}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    )}
                    {territory.href && (
                      <Link className="gov-row__link" href={territory.href}>
                        {t("directory.viewDetails")}
                        <span aria-hidden="true" className="fr-icon-arrow-right-line" />
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ── State–territory relations ──────────────────────────────────── */}
      <section className="gov-section gov-section--subtle" aria-labelledby="territoires-state-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("stateTerritoryRelations.kicker")}</p>
          <h2 id="territoires-state-title" className="gov-section__title">
            {t("stateTerritoryRelations.title")}
          </h2>
          <p className="gov-lead">{t("stateTerritoryRelations.lead")}</p>
          <p className="gov-gov-intro">{t("stateTerritoryRelations.note")}</p>
        </div>
      </section>

      {/* ── Navigation links ──────────────────────────────────────────── */}
      <section className="gov-section" aria-labelledby="territoires-nav-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("navigation.kicker")}</p>
          <h2 id="territoires-nav-title" className="gov-section__title">
            {t("navigation.title")}
          </h2>
          <p className="gov-lead">{t("navigation.lead")}</p>
          <ul className="gov-rows">
            {navigationLinks.map((item) => (
              <li key={item.key} className="gov-row">
                <h3>{t(`navigation.items.${item.key}.title`)}</h3>
                <p className="gov-row__text">{t(`navigation.items.${item.key}.text`)}</p>
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
