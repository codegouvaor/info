"use client";

import { Header } from "@codegouvaor/react-ads/Header";
import { SkipLinks } from "@codegouvaor/react-ads/SkipLinks";
import type { MainNavigationProps } from "@codegouvaor/react-ads/MainNavigation";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { pageAnchors, primaryNavigation, searchPath } from "@/lib/site-structure";
import { GovernmentBrand } from "../brand/government-brand";
import { LocaleSwitcher } from "./locale-switcher";

/**
 * Government Header of the Astoria portal.
 *
 * ADS provides the markup, the responsive behaviour (desktop navigation row,
 * accessible mobile menu) and the accessibility. This component only supplies
 * the *content* — identity, navigation structure, search access and language
 * switching — entirely from the message catalogs and the centralized
 * `site-structure` configuration.
 */
export function GovernmentHeader() {
  const t = useTranslations();
  const tPrimaryNav = useTranslations("nav.primary");
  const pathname = usePathname();

  const navigationItems: MainNavigationProps.Item[] = primaryNavigation.map(
    ({ key, href }) => ({
      isActive:
        href === "/"
          ? pathname === "/"
          : pathname === href || pathname.startsWith(`${href}/`),
      text: tPrimaryNav(key),
      linkProps: { href },
    })
  );

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
            iconId: "fr-icon-search-line",
            text: t("header.search"),
            linkProps: {
              href: searchPath,
              title: t("header.searchLinkTitle"),
            },
          },
          <LocaleSwitcher key="locale-switcher" />,
        ]}
        // The ADS “Display” widget (text size / colour scheme) is part of the
        // generic design system, but the Astorian portal manages its own
        // accessibility preferences. Disabled for now to keep the header lean.
        disableDisplay
      />
    </>
  );
}
