"use client";

import { Footer } from "@codegouvaor/react-ads/Footer";
import type { FooterProps } from "@codegouvaor/react-ads/Footer";
import { useTranslations } from "next-intl";
import { legalPaths, pageAnchors, sectionPaths, searchPath } from "@/lib/site-structure";
import { GovernmentBrand } from "../brand/government-brand";

const HOME_PATH = "/";
const GOVERNMENT_PATH = "/government";
const NEWS_PATH = "/news";
const SERVICES_PATH = "/services";
const CONTACT_PATH = "/contact";

/**
 * Link structure of the Government Footer columns. Hrefs come from the
 * centralized site structure, labels from the message catalogs — no user-visible
 * text is hard-coded here.
 */
const footerColumns: ReadonlyArray<{
  columnKey: "government" | "news" | "portal";
  links: ReadonlyArray<{ labelKey: string; href: string }>;
}> = [
  {
    columnKey: "government",
    links: [
      { labelKey: "footer.linkLabels.government", href: GOVERNMENT_PATH },
      { labelKey: "footer.linkLabels.composition", href: sectionPaths.composition },
      { labelKey: "footer.linkLabels.contact", href: CONTACT_PATH },
    ],
  },
  {
    columnKey: "news",
    links: [
      { labelKey: "footer.linkLabels.news", href: NEWS_PATH },
      { labelKey: "footer.linkLabels.services", href: SERVICES_PATH },
    ],
  },
  {
    columnKey: "portal",
    links: [
      { labelKey: "footer.linkLabels.search", href: searchPath },
      { labelKey: "footer.linkLabels.sitemap", href: legalPaths.sitemap },
    ],
  },
];

/**
 * Government Footer of the Astoria portal.
 *
 * ADS provides the markup (columns, accessibility line, bottom bar) and the
 * responsive behaviour. This component only decides *what* is shown —
 * institutional links, legal pages and licence — from the message catalogs.
 */
export function GovernmentFooter() {
  const t = useTranslations();

  const linkList: FooterProps.LinkList.List = footerColumns.map((column) => ({
    categoryName: t(`footer.columns.${column.columnKey}.title`),
    links: column.links.map(({ labelKey, href }) => ({
      text: t(labelKey),
      linkProps: { href },
    })),
  })) as FooterProps.LinkList.List;

  return (
    <Footer
      id={pageAnchors.footer}
      className="gov-footer"
      accessibility="partially compliant"
      brandTop={<GovernmentBrand />}
      homeLinkProps={{
        href: HOME_PATH,
        title: t("header.homeTitle"),
      }}
      contentDescription={t("footer.contentDescription")}
      websiteMapLinkProps={{ href: legalPaths.sitemap }}
      accessibilityLinkProps={{ href: legalPaths.accessibility }}
      termsLinkProps={{ href: legalPaths.terms }}
      bottomItems={[
        {
          text: t("footer.bottom.privacy"),
          linkProps: { href: legalPaths.privacy },
        },
        {
          text: t("footer.bottom.cookies"),
          linkProps: { href: legalPaths.cookies },
        },
      ]}
      license={t("footer.license")}
      linkList={linkList}
    />
  );
}
