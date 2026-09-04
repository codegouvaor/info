"use client";

import { Header } from "@codegouvaor/react-ads/Header";
import { SkipLinks } from "@codegouvaor/react-ads/SkipLinks";
import { headerFooterDisplayItem } from "@codegouvaor/react-ads/Display";
import type { MainNavigationProps } from "@codegouvaor/react-ads/MainNavigation";
import type { MegaMenuProps } from "@codegouvaor/react-ads/MainNavigation/MegaMenu";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { pageAnchors, pressPath, primaryNavigation, searchPath } from "@/lib/site-structure";
import { LocaleSwitcher } from "../locale-switcher";

/** Whether the current pathname corresponds to a navigation href. */
const isNavItemActive = (href: string, pathname: string): boolean =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/**
 * Government Header of the Astoria portal.
 *
 * Main navigation — the permanent architecture of the portal, six entries,
 * each answering one user intention:
 *
 *   Le Gouvernement      → Qui gouverne ?
 *   L'action publique    → Que fait la République ?
 *   Services publics     → Que puis-je faire avec l'État ?
 *   Actualités           → Que se passe-t-il actuellement ?
 *   La République        → Comment fonctionne l'État ?
 *   Informations utiles  → Où trouver une information pratique ?
 *
 * Every entry opens a mega-menu panel composed of:
 *  - a leader band: section name, a one-line description and the main
 *    section action (e.g. “→ Tout le Gouvernement”),
 *  - an optional featured zone (“À la une” in Actualités), fed by the shared
 *    `home.news.featured` messages so the headline has a single source,
 *  - a few columns of links — the panel shows the destinations that matter to
 *    the user journey, not the sitemap of the portal.
 *
 * The navigation content comes entirely from the centralized
 * `site-structure` configuration and the message catalogs (FR/EN), so a new
 * news item or a new government priority never requires touching the header.
 *
 * ADS provides the markup, the responsive behaviour (mega-menus on desktop,
 * progressive navigation in the mobile modal) and the accessibility (keyboard
 * navigation, aria-expanded/aria-controls, Escape and outside-click closing).
 * This component only supplies the *content*: identity, navigation structure,
 * search access, language switching and the display settings widget.
 */
export function GovernmentHeader() {
  const t = useTranslations();
  const tPrimaryNav = useTranslations("nav.primary");
  const tNavPanel = useTranslations("nav.panel");
  const tBrand = useTranslations("brand");
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems: MainNavigationProps.Item[] = primaryNavigation.map((item) => {
    const common = {
      isActive: isNavItemActive(item.href, pathname),
      text: tPrimaryNav(item.labelKey),
    };

    if (item.type === "link") {
      return { ...common, linkProps: { href: item.href } };
    }

    const categories: MegaMenuProps.Category[] = [
      // Featured zone — e.g. “À la une” in Actualités: the group title links
      // to the featured article, whose headline comes from the shared
      // `home.news.featured` messages (single source with the homepage).
      ...(item.featuredLink
        ? [
            {
              categoryMainLink: {
                text: tNavPanel(item.featuredLink.titleKey),
                linkProps: { href: item.featuredLink.href },
              },
              links: [
                {
                  text: t("home.news.featured.title"),
                  linkProps: { href: item.featuredLink.href },
                },
              ],
            } satisfies MegaMenuProps.Category,
          ]
        : []),
      ...(item.categories ?? []).map((category): MegaMenuProps.Category =>
        category.mainLink
          ? {
              categoryMainLink: {
                text: tNavPanel(category.mainLink.labelKey),
                linkProps: { href: category.mainLink.href },
              },
              links: category.links.map((link) => ({
                text: tNavPanel(link.labelKey),
                linkProps: { href: link.href },
              })),
            }
          : {
              categoryMainText: tNavPanel(category.titleKey),
              links: category.links.map((link) => ({
                text: tNavPanel(link.labelKey),
                linkProps: { href: link.href },
              })),
            }
      ),
    ];

    return {
      ...common,
      megaMenu: {
        leader: {
          title: tNavPanel(item.leader.titleKey),
          paragraph: tNavPanel(item.leader.paragraphKey),
          link: {
            text: tNavPanel(item.leader.link.labelKey),
            linkProps: { href: item.leader.link.href },
          },
        },
        categories,
      },
    };
  });

  const handleSearch = (text: string) => {
    const query = text.trim();
    router.push(query ? `${searchPath}?q=${encodeURIComponent(query)}` : searchPath);
  };

  return (
    <>
      <SkipLinks
        links={[
          { label: t("common.skipToContent"), anchor: `#${pageAnchors.content}` },
          { label: t("common.skipToFooter"), anchor: `#${pageAnchors.footer}` },
        ]}
      />
      <Header
        className="gov-header"
        identity={{
          imgUrl: "/astoria-gouv.png",
          alt: tBrand("republicName"),
          // The lockup artwork already carries the full wordmark, so no
          // institution line is displayed under the image. ADS requires the
          // field, hence the empty string.
          institution: "",
        }}
        homeLinkProps={{
          href: "/",
          title: t("header.homeTitle"),
        }}
        serviceTitle={t("header.serviceTitle")}
        serviceTagline={t("header.serviceTagline")}
        navigation={navigationItems}
        quickAccessItems={[
          {
            iconId: "fr-icon-newspaper-line",
            text: t("header.pressLink"),
            linkProps: { href: pressPath },
          },
          // “Paramètres d'affichage” — opens the theme dialog (light/dark/system)
          // rendered by the ADS `Display` component mounted by the Header.
          headerFooterDisplayItem,
        ]}
        renderSearchInput={(params) => (
          <input {...params} placeholder={t("meta.searchPlaceholder")} />
        )}
        onSearchButtonClick={handleSearch}
      />
    </>
  );
}
