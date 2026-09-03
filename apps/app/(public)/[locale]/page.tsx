import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { sectionPaths } from "@/lib/site-structure";
import {
  featuredArticle,
  homeEvents,
  institutionItems,
  openRepublicItems,
  policyItems,
  quickAccessItems,
  secondaryArticles,
  serviceItems,
} from "@/lib/home-content";
import { PortalSearchBar } from "@/components/public/search/portal-search-bar";
import {
  ArticleCard,
  CtaButtonsGroup,
  LinkTile,
  NoticeCallout,
} from "@/components/public/content/ads-fragments";

const HOME_PATH = "/";
const NEWS_PATH = "/news";
const SERVICES_PATH = "/services";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);

  const tHome = await getTranslations({ locale, namespace: "home" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });

  return {
    title: { absolute: tHome("metaTitle") },
    description: tMeta("description"),
    ...localizedAlternates(locale, HOME_PATH),
  };
}

/**
 * Home page of the official portal of the Republic of Astoria.
 *
 * Eight sections, in order: hero (with the portal search), quick access,
 * headlines, the Government's public policies, government & institutions,
 * services & procedures, the Government's agenda and the open Republic.
 *
 * The structure (hrefs, icons, order) lives in `lib/home-content.ts` and every
 * label comes from the `home.*` message catalogs, so the page can be fed by a
 * CMS or an API later without reworking the layout.
 */
export default async function HomePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <>
      {/* 01 — Hero / Introduction */}
      <section className="gov-home-hero gov-section" aria-labelledby="home-hero-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("hero.kicker")}</p>
          <h1 id="home-hero-title">{t("hero.title")}</h1>
          <p className="gov-lead">{t("hero.lead")}</p>
          <div className="gov-home-hero__search">
            <PortalSearchBar
              label={t("hero.searchLabel")}
              placeholder={t("hero.searchPlaceholder")}
            />
          </div>
        </div>
      </section>

      {/* 02 — Accès rapides */}
      <section className="gov-section gov-section--subtle" aria-labelledby="quick-access-title">
        <div className="gov-section__container">
          <h2 id="quick-access-title" className="gov-section__title">
            {t("quickAccess.title")}
          </h2>
          <div className="fr-grid-row fr-grid-row--gutters">
            {quickAccessItems.map((item) => (
              <div key={item.key} className="fr-col-12 fr-col-sm-6 fr-col-lg-3">
                <LinkTile
                  title={t(`quickAccess.items.${item.key}.title`)}
                  desc={t(`quickAccess.items.${item.key}.desc`)}
                  href={item.href}
                  iconId={item.iconId}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — À la une */}
      <section className="gov-section" aria-labelledby="headlines-title">
        <div className="gov-section__container">
          <div className="gov-section__header">
            <div>
              <h2 id="headlines-title" className="gov-section__title">
                {t("aLaUne.title")}
              </h2>
              <p className="gov-lead">{t("aLaUne.lead")}</p>
            </div>
            <CtaButtonsGroup
              buttons={[
                {
                  children: t("aLaUne.link"),
                  href: NEWS_PATH,
                  priority: "secondary",
                  iconId: "fr-icon-arrow-right-line",
                },
              ]}
            />
          </div>
          <div className="fr-grid-row fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-lg-7">
              <ArticleCard
                title={t("aLaUne.featured.title")}
                desc={t("aLaUne.featured.text")}
                tag={t("aLaUne.featured.tag")}
                date={t("aLaUne.featured.date")}
                href={featuredArticle.href}
                size="large"
              />
            </div>
            <div className="fr-col-12 fr-col-lg-5">
              <ul className="gov-card-list">
                {secondaryArticles.map((article) => (
                  <li key={article.key}>
                    <ArticleCard
                      title={t(`aLaUne.items.${article.key}.title`)}
                      tag={t(`aLaUne.items.${article.key}.tag`)}
                      date={t(`aLaUne.items.${article.key}.date`)}
                      href={article.href}
                      size="small"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — L'action du Gouvernement */}
      <section className="gov-section gov-section--subtle" aria-labelledby="policies-title">
        <div className="gov-section__container">
          <div className="gov-section__header">
            <div>
              <p className="gov-kicker">{t("policies.kicker")}</p>
              <h2 id="policies-title" className="gov-section__title">
                {t("policies.title")}
              </h2>
              <p className="gov-lead">{t("policies.lead")}</p>
            </div>
            <CtaButtonsGroup
              buttons={[
                {
                  children: t("policies.link"),
                  href: sectionPaths.suiviDesEngagements,
                  priority: "secondary",
                  iconId: "fr-icon-arrow-right-line",
                },
              ]}
            />
          </div>
          <div className="fr-grid-row fr-grid-row--gutters">
            {policyItems.map((item) => (
              <div key={item.key} className="fr-col-12 fr-col-sm-6 fr-col-lg-3">
                <ArticleCard
                  title={t(`policies.items.${item.key}.title`)}
                  desc={t(`policies.items.${item.key}.desc`)}
                  href={item.href}
                  background
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 — Gouvernement & institutions */}
      <section className="gov-section" aria-labelledby="institutions-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("institutions.kicker")}</p>
          <h2 id="institutions-title" className="gov-section__title">
            {t("institutions.title")}
          </h2>
          <p className="gov-lead">{t("institutions.lead")}</p>
          <div className="fr-grid-row fr-grid-row--gutters">
            {institutionItems.map((item) => (
              <div key={item.key} className="fr-col-12 fr-col-sm-6 fr-col-lg-3">
                <LinkTile
                  grey
                  title={t(`institutions.items.${item.key}.title`)}
                  desc={t(`institutions.items.${item.key}.desc`)}
                  href={item.href}
                  iconId={item.iconId}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — Services & démarches */}
      <section className="gov-section gov-section--subtle" aria-labelledby="services-title">
        <div className="gov-section__container">
          <div className="gov-section__header">
            <div>
              <p className="gov-kicker">{t("services.kicker")}</p>
              <h2 id="services-title" className="gov-section__title">
                {t("services.title")}
              </h2>
              <p className="gov-lead">{t("services.lead")}</p>
            </div>
            <CtaButtonsGroup
              buttons={[
                {
                  children: t("services.link"),
                  href: SERVICES_PATH,
                  priority: "secondary",
                  iconId: "fr-icon-arrow-right-line",
                },
              ]}
            />
          </div>
          <div className="gov-services-notice">
            <NoticeCallout iconId="fr-icon-information-line">
              {t("services.notice")}
            </NoticeCallout>
          </div>
          <div className="fr-grid-row fr-grid-row--gutters">
            {serviceItems.map((item) => (
              <div key={item.key} className="fr-col-12 fr-col-md-6">
                <LinkTile
                  small
                  horizontal
                  title={t(`services.items.${item.key}.title`)}
                  desc={t(`services.items.${item.key}.desc`)}
                  href={item.href}
                  iconId={item.iconId}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07 — En ce moment */}
      <section className="gov-section" aria-labelledby="events-title">
        <div className="gov-section__container">
          <div className="gov-section__header">
            <div>
              <p className="gov-kicker">{t("events.kicker")}</p>
              <h2 id="events-title" className="gov-section__title">
                {t("events.title")}
              </h2>
              <p className="gov-lead">{t("events.lead")}</p>
            </div>
            <CtaButtonsGroup
              buttons={[
                {
                  children: t("events.link"),
                  href: NEWS_PATH,
                  priority: "secondary",
                  iconId: "fr-icon-arrow-right-line",
                },
              ]}
            />
          </div>
          <ul className="gov-event-list">
            {homeEvents.map((event) => (
              <li key={event.key} className="gov-event">
                <time className="gov-event__date" dateTime={event.isoDate}>
                  {t(`events.items.${event.key}.date`)}
                </time>
                <div className="gov-event__content">
                  <p className="gov-event__tag">{t(`events.items.${event.key}.tag`)}</p>
                  <h3 className="gov-event__title">{t(`events.items.${event.key}.title`)}</h3>
                  <p className="gov-event__text">{t(`events.items.${event.key}.text`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 08 — Une République ouverte */}
      <section className="gov-section gov-section--subtle" aria-labelledby="open-republic-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("openRepublic.kicker")}</p>
          <h2 id="open-republic-title" className="gov-section__title">
            {t("openRepublic.title")}
          </h2>
          <p className="gov-lead">{t("openRepublic.lead")}</p>
          <div className="fr-grid-row fr-grid-row--gutters">
            {openRepublicItems.map((item) => (
              <div key={item.key} className="fr-col-12 fr-col-md-6">
                <LinkTile
                  small
                  horizontal
                  title={t(`openRepublic.items.${item.key}.title`)}
                  desc={t(`openRepublic.items.${item.key}.desc`)}
                  href={item.href}
                  iconId={item.iconId}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}