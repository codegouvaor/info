import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import {
  footerNavigation,
  legalPaths,
  primaryNavigation,
  pressPath,
  searchPath,
} from "@/lib/site-structure";

const PAGE_PATH = "/sitemap";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  const t = await getTranslations({ locale, namespace: "pages.sitemap" });

  return {
    title: t("title"),
    description: t("description"),
    ...localizedAlternates(locale, PAGE_PATH),
  };
}

/* -------------------------------------------------------------------------- *
 * Sitemap data model
 * -------------------------------------------------------------------------- */

type SitemapItem = {
  label: string;
  href: string;
  description?: string;
};

type SitemapSubsection = {
  title: string;
  items: SitemapItem[];
};

type SitemapSection = {
  title: string;
  description?: string;
  subsections: SitemapSubsection[];
};

/**
 * Build the full sitemap structure from the centralised `site-structure`
 * configuration. Each primary-navigation entry becomes a section whose
 * subsections are extracted from its mega-menu categories.
 */
function buildSitemap(tNavPanel: (key: string) => string): SitemapSection[] {
  const sections: SitemapSection[] = [];

  for (const item of primaryNavigation) {
    if (item.type === "link") {
      sections.push({
        title: tNavPanel(item.labelKey),
        subsections: [],
      });
      continue;
    }

    const subsections: SitemapSubsection[] = [];

    // Featured link (e.g. "À la une" in Actualités)
    if (item.featuredLink) {
      subsections.push({
        title: tNavPanel(item.featuredLink.titleKey),
        items: [
          {
            label: tNavPanel(item.featuredLink.titleKey),
            href: item.featuredLink.href,
          },
        ],
      });
    }

    // Categories from the mega-menu
    for (const category of item.categories ?? []) {
      const catTitle = category.mainLink
        ? tNavPanel(category.mainLink.labelKey)
        : tNavPanel(category.titleKey);

      const items: SitemapItem[] = [];

      // Main link itself (e.g. "Toutes les démarches")
      if (category.mainLink) {
        items.push({
          label: tNavPanel(category.mainLink.labelKey),
          href: category.mainLink.href,
        });
      }

      // Sub-links
      for (const link of category.links) {
        items.push({
          label: tNavPanel(link.labelKey),
          href: link.href,
        });
      }

      subsections.push({ title: catTitle, items });
    }

    // Leader link (e.g. "Tout le Gouvernement")
    const leaderItem: SitemapItem = {
      label: tNavPanel(item.leader.link.labelKey),
      href: item.leader.link.href,
    };

    sections.push({
      title: tNavPanel(item.leader.titleKey),
      description: tNavPanel(item.leader.paragraphKey),
      subsections: [
        // Insert the leader as the first subsection
        { title: "", items: [leaderItem] },
        ...subsections,
      ],
    });
  }

  return sections;
}

/**
 * Build footer-linked pages that don't appear in the primary navigation
 * but are publicly important (contact, search, press, etc.).
 */
function buildFooterSection(t: (key: string) => string): SitemapSection {
  const subsections: SitemapSubsection[] = [];

  for (const column of footerNavigation) {
    const title = t(`footer.columns.${column.columnKey}.title`);
    const items: SitemapItem[] = column.links.map((link) => ({
      label: t(`nav.panel.${link.labelKey}`),
      href: link.href,
    }));
    subsections.push({ title, items });
  }

  return {
    title: t("pages.sitemap.groups.footer"),
    subsections,
  };
}

/**
 * Build the legal / framework section.
 */
function buildLegalSection(
  t: (key: string) => string,
  tNavPanel: (key: string) => string
): SitemapSection {
  return {
    title: t("pages.sitemap.groups.legal"),
    subsections: [
      {
        title: "",
        items: [
          { label: t("footer.legal.accessibility"), href: legalPaths.accessibility },
          { label: t("footer.legal.privacy"), href: legalPaths.privacy },
          { label: t("footer.legal.terms"), href: legalPaths.terms },
          { label: t("footer.legal.cookies"), href: legalPaths.cookies },
          { label: t("footer.linkLabels.search"), href: searchPath },
          { label: tNavPanel("espacePresse"), href: pressPath },
          { label: t("footer.linkLabels.sitemap"), href: legalPaths.sitemap },
        ],
      },
    ],
  };
}

/* -------------------------------------------------------------------------- *
 * Page component
 * -------------------------------------------------------------------------- */

export default async function SitemapPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const tNavPanel = await getTranslations({ locale, namespace: "nav.panel" });

  const navSections = buildSitemap((key: string) => tNavPanel(key));
  const footerSection = buildFooterSection((key: string) => t(key));
  const legalSection = buildLegalSection(
    (key: string) => t(key),
    (key: string) => tNavPanel(key)
  );

  const allSections = [...navSections, footerSection, legalSection];

  return (
    <section className="gov-section" aria-labelledby="sitemap-title">
      <div className="gov-section__container">
        {/* Page header */}
        <p className="gov-kicker">{t("pages.sitemap.kicker")}</p>
        <h1 id="sitemap-title">{t("pages.sitemap.title")}</h1>
        <p className="gov-lead">{t("pages.sitemap.lead")}</p>

        {/* Section grid */}
        <div className="gov-sitemap">
          {allSections.map((section) => (
            <section
              key={section.title}
              className="gov-sitemap__section"
              aria-labelledby={`sitemap-${section.title}`}
            >
              <h2
                id={`sitemap-${section.title}`}
                className="gov-sitemap__section-title"
              >
                {section.title}
              </h2>

              {section.description && (
                <p className="gov-sitemap__section-desc">
                  {section.description}
                </p>
              )}

              {section.subsections.map((sub) =>
                sub.title ? (
                  <div key={sub.title} className="gov-sitemap__subsection">
                    <h3 className="gov-sitemap__subsection-title">
                      {sub.title}
                    </h3>
                    <ul className="gov-sitemap__list">
                      {sub.items.map((item) => (
                        <li key={item.href} className="gov-sitemap__item">
                          <Link href={item.href} className="gov-sitemap__link">
                            {item.label}
                          </Link>
                          {item.description && (
                            <span className="gov-sitemap__item-desc">
                              {item.description}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <ul
                    key={sub.items[0]?.href ?? "root"}
                    className="gov-sitemap__list"
                  >
                    {sub.items.map((item) => (
                      <li key={item.href} className="gov-sitemap__item">
                        <Link href={item.href} className="gov-sitemap__link">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )
              )}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
