import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { SectionPage } from "@/components/public/content/section-page";
import { PortalSearchBar } from "@/components/public/search/portal-search-bar";

const PAGE_PATH = "/search";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  const t = await getTranslations({ locale, namespace: "pages.search" });

  return {
    title: t("title"),
    description: t("description"),
    ...localizedAlternates(locale, PAGE_PATH),
  };
}

export default async function SearchPage({ params, searchParams }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const tSearch = await getTranslations({ locale, namespace: "pages.search" });

  return (
    <SectionPage locale={locale} kind="search">
      <div style={{ margin: "1.5rem 0" }}>
        <PortalSearchBar label={tSearch("title")} defaultValue={query} />
      </div>

      <h2>{tSearch("resultsTitle")}</h2>
      <p>
        {query === ""
          ? tSearch("noQuery")
          : tSearch("noResults", { query })}
      </p>
    </SectionPage>
  );
}
