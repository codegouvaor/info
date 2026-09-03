"use client";

import { Header } from "@codegouvaor/react-ads/Header";
import { SkipLinks } from "@codegouvaor/react-ads/SkipLinks";
import { headerFooterDisplayItem } from "@codegouvaor/react-ads/Display";
import type { MainNavigationProps } from "@codegouvaor/react-ads/MainNavigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { pageAnchors, pressPath, primaryNavigation, searchPath } from "@/lib/site-structure";
import { GovernmentBrand } from "../brand/government-brand";

/** Whether the current pathname corresponds to a navigation href. */
const isNavItemActive = (href: string, pathname: string): boolean =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/**
 * Government Header of the Astoria portal.
 *
 * Follows the info.gouv.fr header conventions:
 *  - brand block: emblem + republic name, service title and tagline,
 *  - main navigation row whose seven sections open mega-menu panels
 *    (leader + categories), mirroring info.gouv.fr (À la une, Décryptages,
 *    L'État et moi, Prévention des risques, Le Gouvernement, Suivi des
 *    engagements, Liens utiles),
 *  - quick-access tools: language switching and the display settings widget,
 *  - in-header search modal that navigates to the localized search page.
 *
 * ADS provides the markup, the responsive behaviour and the accessibility.
 * This component only supplies the *content* — identity, navigation
 * structure, search access and language switching — entirely from the
 * message catalogs and the centralized `site-structure` configuration.
 */
export function GovernmentHeader() {
  const t = useTranslations();
  const tPrimaryNav = useTranslations("nav.primary");
  const tNavPanel = useTranslations("nav.panel");
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

    return {
      ...common,
      megaMenu: {
        leader: {
          title: tNavPanel(item.leader.titleKey),
          paragraph: tNavPanel(item.leader.paragraphKey),
          ...(item.leader.link
            ? {
                link: {
                  text: tNavPanel(item.leader.link.labelKey),
                  linkProps: { href: item.leader.link.href },
                },
              }
            : {}),
        },
        categories: (item.categories ?? []).map((category) => ({
          categoryMainText: tNavPanel(category.titleKey),
          links: category.links.map((link) => ({
            text: tNavPanel(link.labelKey),
            linkProps: { href: link.href },
          })),
        })),
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
        brandTop={<GovernmentBrand />}
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