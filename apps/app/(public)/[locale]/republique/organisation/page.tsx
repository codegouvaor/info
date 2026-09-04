import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { Link } from "@/i18n/navigation";
import {
  institutions,
  governmentComponent,
  distinctions,
  navigationLinks,
} from "@/lib/republic-organisation";
import { CtaButtonsGroup } from "@/components/public/content/ads-fragments";

const PAGE_PATH = "/republique/organisation";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  const t = await getTranslations({ locale, namespace: "organisation" });

  return {
    title: t("title"),
    description: t("description"),
    ...localizedAlternates(locale, PAGE_PATH),
  };
}

/**
 * `/republique/organisation` — the institutional reference page for the
 * organisation of the Republic of Astoria.
 *
 * This page presents the general institutional structure: how the State is
 * organised, what its main components are and how they relate to each other.
 * It does NOT duplicate /government — it provides the overview to which
 * the detailed institutional pages are linked.
 */
export default async function OrganisationPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "organisation" });

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="gov-section gov-page-hero" aria-labelledby="organisation-hero-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("hero.kicker")}</p>
          <h1 id="organisation-hero-title">{t("hero.title")}</h1>
          <p className="gov-page-hero__subtitle">{t("hero.subtitle")}</p>
          <p className="gov-lead">{t("hero.intro")}</p>
          <div className="gov-page-hero__actions">
            <CtaButtonsGroup
              buttons={[
                {
                  children: t("readMore"),
                  href: "#organisation-institutions",
                  priority: "secondary",
                  iconId: "fr-icon-arrow-right-line",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── Overview ──────────────────────────────────────────────────── */}
      <section className="gov-section gov-section--subtle" aria-labelledby="organisation-overview-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("overview.kicker")}</p>
          <h2 id="organisation-overview-title" className="gov-section__title">
            {t("overview.title")}
          </h2>
          <p className="gov-lead">{t("overview.lead")}</p>
          <p className="gov-gov-intro">{t("overview.note")}</p>
        </div>
      </section>

      {/* ── Main institutions ─────────────────────────────────────────── */}
      <section className="gov-section" id="organisation-institutions" aria-labelledby="organisation-institutions-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("institutions.kicker")}</p>
          <h2 id="organisation-institutions-title" className="gov-section__title">
            {t("institutions.title")}
          </h2>
          <p className="gov-lead">{t("institutions.lead")}</p>
          <ul className="gov-rows">
            {institutions.map((item) => (
              <li key={item.key} className="gov-row">
                <h3>{t(`institutions.items.${item.key}.title`)}</h3>
                <p className="gov-row__text">{t(`institutions.items.${item.key}.text`)}</p>
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

      {/* ── The Government in the State ───────────────────────────────── */}
      <section className="gov-section gov-section--subtle" aria-labelledby="organisation-gov-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("governmentSection.kicker")}</p>
          <h2 id="organisation-gov-title" className="gov-section__title">
            {t("governmentSection.title")}
          </h2>
          <p className="gov-lead">{t("governmentSection.lead")}</p>
          <p className="gov-prose-paragraph">{t("governmentSection.intro")}</p>
          <div className="gov-section-cta">
            <CtaButtonsGroup
              buttons={[
                {
                  children: t("readMore"),
                  href: governmentComponent.href ?? "/government",
                  priority: "primary",
                  iconId: "fr-icon-arrow-right-line",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── From institution to administration ────────────────────────── */}
      <section className="gov-section" aria-labelledby="organisation-levels-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("levels.kicker")}</p>
          <h2 id="organisation-levels-title" className="gov-section__title">
            {t("levels.title")}
          </h2>
          <p className="gov-lead">{t("levels.lead")}</p>
          <ul className="gov-rows">
            {distinctions.map((item) => (
              <li key={item.key} className="gov-row">
                <h3>{t(`levels.items.${item.key}.title`)}</h3>
                <p className="gov-row__text">{t(`levels.items.${item.key}.text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── How institutions work together ────────────────────────────── */}
      <section className="gov-section gov-section--subtle" aria-labelledby="organisation-relations-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("relations.kicker")}</p>
          <h2 id="organisation-relations-title" className="gov-section__title">
            {t("relations.title")}
          </h2>
          <p className="gov-lead">{t("relations.lead")}</p>

          {/* Institutional diagram — readable as a plain list (see aria-label). */}
          <ol className="gov-exec" aria-label={t("relations.title")}>
            <li className="gov-exec__item">
              <div className="gov-exec__node gov-exec__node--top">
                <h3 className="gov-exec__title">{t("relations.items.constitution.title")}</h3>
                <p className="gov-exec__text">{t("relations.items.constitution.text")}</p>
              </div>
            </li>
            <li className="gov-exec__item">
              <div className="gov-exec__join gov-exec__join--labelled">
                <span aria-hidden="true" className="gov-exec__join-line" />
                <span className="gov-exec__join-label">{t("relations.items.institutions.title")}</span>
              </div>
            </li>
            <li className="gov-exec__item">
              <div className="gov-exec__node">
                <h3 className="gov-exec__title">{t("relations.items.institutions.title")}</h3>
                <p className="gov-exec__text">{t("relations.items.institutions.text")}</p>
              </div>
            </li>
            <li className="gov-exec__item">
              <div className="gov-exec__join gov-exec__join--labelled">
                <span aria-hidden="true" className="gov-exec__join-line" />
                <span className="gov-exec__join-label">{t("relations.items.government.title")}</span>
              </div>
            </li>
            <li className="gov-exec__item">
              <div className="gov-exec__node">
                <h3 className="gov-exec__title">{t("relations.items.government.title")}</h3>
                <p className="gov-exec__text">{t("relations.items.government.text")}</p>
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
                  <h3 className="gov-exec__title">{t("relations.items.ministries.title")}</h3>
                  <p className="gov-exec__text">{t("relations.items.ministries.text")}</p>
                </div>
                <div className="gov-exec__node">
                  <h3 className="gov-exec__title">{t("relations.items.administrations.title")}</h3>
                  <p className="gov-exec__text">{t("relations.items.administrations.text")}</p>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* ── Reference pages ───────────────────────────────────────────── */}
      <section className="gov-section" aria-labelledby="organisation-nav-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("navigation.kicker")}</p>
          <h2 id="organisation-nav-title" className="gov-section__title">
            {t("navigation.title")}
          </h2>
          <p className="gov-lead">{t("navigation.lead")}</p>
          <ul className="gov-rows">
            {navigationLinks.map((item) => (
              <li key={item.key} className="gov-row">
                <h3>{t(`navigation.items.${item.key}.title`)}</h3>
                <p className="gov-row__text">{t(`navigation.items.${item.key}.text`)}</p>
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
