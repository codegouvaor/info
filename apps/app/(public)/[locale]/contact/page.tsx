import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { SectionPage } from "@/components/public/content/section-page";
import ContactForm from "@/components/public/contact/contact-form";
import { ministries } from "@/lib/government-ministries";

const PAGE_PATH = "/contact";

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

/**
 * Build the list of contact recipients: the Presidency first, then every
 * ministry. Each recipient carries its institutional `mailto:` address
 * derived from the official website domain or a default portal address.
 */
function buildRecipients() {
  const portalEmail = "contact@info.gov.aor";

  const presidency = {
    id: "presidence",
    label: "Présidence de la République",
    email: "presidence@info.gov.aor",
  };

  const ministryRecipients = ministries
    .filter((m) => m.status === "active")
    .map((m) => ({
      id: m.id,
      label: m.name,
      email: m.officialWebsite
        ? `contact@${m.officialWebsite}`
        : portalEmail,
    }));

  return [presidency, ...ministryRecipients];
}

export default async function ContactPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const recipients = buildRecipients();

  return (
    <SectionPage locale={locale} kind="contact" paragraphCount={2}>
      <ContactForm recipients={recipients} />
    </SectionPage>
  );
}
