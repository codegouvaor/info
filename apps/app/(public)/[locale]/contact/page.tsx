import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { SectionPage } from "@/components/public/content/section-page";
import { CtaButtonsGroup } from "@/components/public/content/ads-fragments";

const PAGE_PATH = "/contact";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@info.gov.aor";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  const t = await getTranslations({ locale, namespace: "pages.contact" });

  return {
    title: t("title"),
    description: t("description"),
    ...localizedAlternates(locale, PAGE_PATH),
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const tContact = await getTranslations({ locale, namespace: "pages.contact" });

  return (
    <SectionPage locale={locale} kind="contact" paragraphCount={2}>
      <div style={{ marginTop: "1.5rem" }}>
        <CtaButtonsGroup
          buttons={[
            {
              children: tContact("emailLabel"),
              href: `mailto:${CONTACT_EMAIL}`,
              iconId: "fr-icon-mail-line",
            },
          ]}
        />
      </div>
    </SectionPage>
  );
}
