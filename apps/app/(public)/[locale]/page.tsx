import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { Link } from "@/i18n/navigation";
import {
  featuredArticle,
  governmentItems,
  heroPopularSearches,
  policyItems,
  quickAccessPrimaryItems,
  quickAccessSecondaryItems,
  republicItems,
  secondaryArticles,
  serviceCategories,
  socialLinks,
  usefulLinks,
} from "@/lib/home-content";
import { PortalSearchBar } from "@/components/public/search/portal-search-bar";
import {
  ArticleCard,
  CtaButtonsGroup,
  LinkTile,
  NoticeCallout,
  SearchSuggestionTag,
} from "@/components/public/content/ads-fragments";

const HOME_PATH = "/";
const NEWS_PATH = "/news";
const SERVICES_PATH = "/services";
const PUBLIC_ACTION_PATH = "/politiques-publiques";

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
 * Eight sections answering: "What are the main entry points of the digital
 * Republic of Astoria?"
 *
 *   01 — Hero + Search
 *   02 — Quick access
 *   03 — News (actualités)
 *   04 — Public action (l'action publique)
 *   05 — Public services (services publics)
 *   06 — The Government (le Gouvernement)
 *   07 — The Republic (la République)
 *   08 — Useful information (informations utiles)
 *   09 — Social network
 */
export default async function HomePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <>
      {/* 01 — Hero: the official entry point with the global search */}
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
          <div className="gov-home-hero__popular">
            <p className="gov-home-hero__popular-label" id="popular-searches-label">
              {t("hero.popularSearchesLabel")}
            </p>
            <ul className="gov-popular-searches" aria-labelledby="popular-searches-label">
              {heroPopularSearches.map((search) => (
                <li key={search.key}>
                  <SearchSuggestionTag
                    label={t(`hero.popularSearches.${search.key}`)}
                    href={search.href}
                  />
                </li>
              ))}
            </ul>
          </div>
          <p className="gov-home-hero__trust">
            <span aria-hidden="true" className="fr-icon-lock-line" />
            {t("hero.trust")}
          </p>
        </div>
      </section>

      {/* 02 — Accès rapides: the four main portals + secondary entries */}
      <section className="gov-section gov-section--subtle" aria-labelledby="quick-access-title">
        <div className="gov-section__container">
          <h2 id="quick-access-title" className="gov-section__title">
            {t("quickAccess.title")}
          </h2>
          <div className="fr-grid-row fr-grid-row--gutters">
            {quickAccessPrimaryItems.map((item) => (
              <div key={item.key} className="fr-col-12 fr-col-sm-6 fr-col-lg-3">
                <LinkTile
                  title={t(`quickAccess.primaryItems.${item.key}.title`)}
                  desc={t(`quickAccess.primaryItems.${item.key}.desc`)}
                  href={item.href}
                  iconId={item.iconId}
                />
              </div>
            ))}
          </div>
          <div className="fr-grid-row fr-grid-row--gutters" style={{ marginTop: "1rem" }}>
            {quickAccessSecondaryItems.map((item) => (
              <div key={item.key} className="fr-col-6 fr-col-sm-4 fr-col-lg">
                <LinkTile
                  small
                  horizontal
                  title={t(`quickAccess.secondaryItems.${item.key}.title`)}
                  desc={t(`quickAccess.secondaryItems.${item.key}.desc`)}
                  href={item.href}
                  iconId={item.iconId}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — Actualités: 1 featured + 3 secondary */}
      <section className="gov-section" aria-labelledby="news-title">
        <div className="gov-section__container">
          <div className="gov-section__header">
            <div>
              <h2 id="news-title" className="gov-section__title">
                {t("news.title")}
              </h2>
              <p className="gov-lead">{t("news.lead")}</p>
            </div>
            <CtaButtonsGroup
              buttons={[
                {
                  children: t("news.link"),
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
                title={t("news.featured.title")}
                desc={t("news.featured.text")}
                tag={t("news.featured.tag")}
                date={t("news.featured.date")}
                href={featuredArticle.href}
                size="large"
              />
            </div>
            <div className="fr-col-12 fr-col-lg-5">
              <ul className="gov-card-list">
                {secondaryArticles.map((article) => (
                  <li key={article.key}>
                    <ArticleCard
                      title={t(`news.items.${article.key}.title`)}
                      tag={t(`news.items.${article.key}.tag`)}
                      date={t(`news.items.${article.key}.date`)}
                      href={article.href}
                      size="small"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="gov-section-notice">
            <NoticeCallout iconId="fr-icon-information-line">{t("news.emptyNotice")}</NoticeCallout>
          </div>
        </div>
      </section>

      {/* 04 — L'action publique */}
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
                  href: PUBLIC_ACTION_PATH,
                  priority: "secondary",
                  iconId: "fr-icon-arrow-right-line",
                },
              ]}
            />
          </div>
          <div className="fr-grid-row fr-grid-row--gutters">
            {policyItems.map((item) => (
              <div key={item.key} className="fr-col-12 fr-col-sm-6 fr-col-lg-4">
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

      {/* 05 — Services publics */}
      <section className="gov-section" aria-labelledby="services-title">
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
          <div className="gov-section-notice">
            <NoticeCallout iconId="fr-icon-information-line">{t("services.notice")}</NoticeCallout>
          </div>
          <div className="fr-grid-row fr-grid-row--gutters">
            {serviceCategories.map((item) => (
              <div key={item.key} className="fr-col-12 fr-col-sm-6 fr-col-lg-4">
                <LinkTile
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

      {/* 06 — Le Gouvernement */}
      <section className="gov-section gov-section--subtle" aria-labelledby="government-title">
        <div className="gov-section__container">
          <div className="gov-section__header">
            <div>
              <p className="gov-kicker">{t("government.kicker")}</p>
              <h2 id="government-title" className="gov-section__title">
                {t("government.title")}
              </h2>
              <p className="gov-lead">{t("government.lead")}</p>
            </div>
          </div>
          <div className="fr-grid-row fr-grid-row--gutters">
            {governmentItems.map((item) => (
              <div key={item.key} className="fr-col-12 fr-col-sm-6 fr-col-lg-3">
                <LinkTile
                  grey
                  title={t(`government.items.${item.key}.title`)}
                  desc={t(`government.items.${item.key}.desc`)}
                  href={item.href}
                  iconId={item.iconId}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07 — La République */}
      <section className="gov-section" aria-labelledby="republic-title">
        <div className="gov-section__container">
          <div className="gov-section__header">
            <div>
              <p className="gov-kicker">{t("republic.kicker")}</p>
              <h2 id="republic-title" className="gov-section__title">
                {t("republic.title")}
              </h2>
              <p className="gov-lead">{t("republic.lead")}</p>
            </div>
          </div>
          <div className="fr-grid-row fr-grid-row--gutters">
            {republicItems.map((item) => (
              <div key={item.key} className="fr-col-12 fr-col-sm-6 fr-col-lg-4">
                <LinkTile
                  title={t(`republic.items.${item.key}.title`)}
                  desc={t(`republic.items.${item.key}.desc`)}
                  href={item.href}
                  iconId={item.iconId}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 08 — Informations utiles */}
      <section className="gov-section gov-section--subtle" aria-labelledby="useful-info-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("usefulInfo.kicker")}</p>
          <h2 id="useful-info-title" className="gov-section__title">
            {t("usefulInfo.title")}
          </h2>
          <p className="gov-lead">{t("usefulInfo.lead")}</p>
          <div className="fr-grid-row fr-grid-row--gutters">
            {usefulLinks.map((item) => (
              <div key={item.key} className="fr-col-12 fr-col-sm-6 fr-col-md-4 fr-col-lg-3">
                <LinkTile
                  small
                  horizontal
                  title={t(`usefulInfo.items.${item.key}.title`)}
                  href={item.href}
                  iconId={item.iconId}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 09 — Social network: newsletter + social media links */}
      <section className="gov-section" aria-labelledby="social-network-title">
        <div className="gov-section__container">
          <div className="gov-home-social">
            <div className="gov-home-social__newsletter">
              <p className="gov-kicker">{t("socialNetwork.kicker")}</p>
              <h2 id="social-network-title" className="gov-section__title">
                {t("socialNetwork.newsletter.title")}
              </h2>
              <p className="gov-lead">{t("socialNetwork.newsletter.desc")}</p>
              <CtaButtonsGroup
                buttons={[{
                  children: t("socialNetwork.newsletter.cta"),
                  href: t("socialNetwork.newsletter.href"),
                  priority: "primary",
                  iconId: "fr-icon-mail-line",
                }]}
              />
            </div>
            <div className="gov-home-social__follow">
              <h3 className="gov-home-social__follow-title">
                {t("socialNetwork.title")}
              </h3>
              <ul className="gov-home-social__list" role="list">
                {socialLinks.map((link) => (
                  <li key={link.key}>
                    <a
                      className="gov-home-social__icon"
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(`socialNetwork.socials.${link.key}`)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox={`0 0 ${link.svgW} ${link.svgH}`}
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d={link.svgPath} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
