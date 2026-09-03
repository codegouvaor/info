import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { legalPaths, primaryNavigation, sectionPaths, searchPath } from "@/lib/site-structure";
import { SectionPage } from "@/components/public/content/section-page";

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

export default async function SitemapPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const tNav = await getTranslations({ locale, namespace: "nav.primary" });

  const groups: ReadonlyArray<{
    titleKey: string;
    entries: ReadonlyArray<{ label: string; href: string }>;
  }> = [
    {
      titleKey: "pages.sitemap.groups.primary",
      entries: primaryNavigation.map((item) => ({
        label: tNav(item.labelKey),
        href: item.href,
      })),
    },
    {
      titleKey: "pages.sitemap.groups.sections",
      entries: [
        {
          label: t("footer.linkLabels.composition"),
          href: sectionPaths.composition,
        },
        { label: t("footer.linkLabels.search"), href: searchPath },
      ],
    },
    {
      titleKey: "pages.sitemap.groups.legal",
      entries: [
        { label: t("footer.legal.accessibility"), href: legalPaths.accessibility },
        { label: t("footer.legal.privacy"), href: legalPaths.privacy },
        { label: t("footer.legal.terms"), href: legalPaths.terms },
        { label: t("footer.legal.cookies"), href: legalPaths.cookies },
      ],
    },
  ];

  return (
    <SectionPage locale={locale} kind="sitemap">
      {groups.map((group) => (
        <div key={group.titleKey}>
          <h2>{t(group.titleKey)}</h2>
          <ul>
            {group.entries.map((entry) => (
              <li key={entry.href}>
                <Link href={entry.href}>{entry.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </SectionPage>
  );
}
