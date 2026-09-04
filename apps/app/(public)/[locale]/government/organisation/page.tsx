import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { SectionPage } from "@/components/public/content/section-page";

const PAGE_PATH = "/government/organisation";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  const t = await getTranslations({ locale, namespace: "pages.organisation" });

  return {
    title: t("title"),
    description: t("description"),
    ...localizedAlternates(locale, PAGE_PATH),
  };
}

export default async function GovernmentOrganisationPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  return <SectionPage locale={locale} kind="organisation" paragraphCount={2} showNotice />;
}
