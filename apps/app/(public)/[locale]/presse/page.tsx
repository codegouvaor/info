import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { NoticeCallout } from "@/components/public/content/ads-fragments";

const PAGE_PATH = "/presse";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  const t = await getTranslations({ locale, namespace: "pages.presse" });

  return {
    title: t("title"),
    description: t("description"),
    ...localizedAlternates(locale, PAGE_PATH),
  };
}

/** Quick-access entry rendered as a compact link tile. */
function QuickAccessItem({
  label,
  href,
  iconId,
}: {
  label: string;
  href: string;
  iconId: string;
}) {
  return (
    <a href={href} className="gov-press-quick-access__item">
      <span className={`gov-press-quick-access__icon ${iconId}`} aria-hidden="true" />
      <span className="gov-press-quick-access__label">{label}</span>
    </a>
  );
}

/**
 * Press Center page of the official portal of the Republic of Astoria.
 *
 * This page provides journalists, media, researchers and citizens with
 * quick access to official press resources: press releases, dossiers,
 * speeches, agenda, contacts and media resources.
 *
 * The page is designed to be useful even with minimal content and to
 * scale progressively as the Government is formed and publications
 * become available.
 */
export default async function PressePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "pages.presse" });

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="gov-section gov-press-hero" aria-labelledby="press-hero-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("kicker")}</p>
          <h1 id="press-hero-title">{t("title")}</h1>
          <p className="gov-lead">{t("lead")}</p>
          <p>{t("paragraphs.p1")}</p>
        </div>
      </section>

      {/* ── Quick access ──────────────────────────────────────────────── */}
      <section className="gov-section gov-section--subtle" aria-labelledby="press-quick-access-title">
        <div className="gov-section__container">
          <h2 id="press-quick-access-title" className="sr-only">
            {t("quickAccess.title")}
          </h2>
          <div className="gov-press-quick-access">
            <QuickAccessItem
              label={t("quickAccess.communiques")}
              href="/communiques"
              iconId="fr-icon-newspaper-line"
            />
            <QuickAccessItem
              label={t("quickAccess.dossiers")}
              href="/dossiers-de-presse"
              iconId="fr-icon-folder-2-line"
            />
            <QuickAccessItem
              label={t("quickAccess.discours")}
              href="/discours-et-rapports"
              iconId="fr-icon-chat-quote-line"
            />
            <QuickAccessItem
              label={t("quickAccess.agenda")}
              href="/agenda"
              iconId="fr-icon-calendar-line"
            />
            <QuickAccessItem
              label={t("quickAccess.conferences")}
              href="/actualites/conferences-de-presse"
              iconId="fr-icon-mic-line"
            />
            <QuickAccessItem
              label={t("quickAccess.contacts")}
              href="/contact"
              iconId="fr-icon-mail-line"
            />
          </div>
        </div>
      </section>

      {/* ── Latest press releases ─────────────────────────────────────── */}
      <section className="gov-section" aria-labelledby="press-communiques-title">
        <div className="gov-section__container">
          <h2 id="press-communiques-title" className="gov-section__title">
            {t("latestCommuniques.title")}
          </h2>
          <NoticeCallout iconId="fr-icon-information-line">
            {t("latestCommuniques.empty")}
          </NoticeCallout>
        </div>
      </section>

      {/* ── Press dossiers ────────────────────────────────────────────── */}
      <section className="gov-section gov-section--subtle" aria-labelledby="press-dossiers-title">
        <div className="gov-section__container">
          <h2 id="press-dossiers-title" className="gov-section__title">
            {t("dossiers.title")}
          </h2>
          <NoticeCallout iconId="fr-icon-folder-2-line">
            {t("dossiers.empty")}
          </NoticeCallout>
        </div>
      </section>

      {/* ── Speeches and declarations ─────────────────────────────────── */}
      <section className="gov-section" aria-labelledby="press-discours-title">
        <div className="gov-section__container">
          <h2 id="press-discours-title" className="gov-section__title">
            {t("discours.title")}
          </h2>
          <NoticeCallout iconId="fr-icon-chat-quote-line">
            {t("discours.empty")}
          </NoticeCallout>
        </div>
      </section>

      {/* ── Press agenda ──────────────────────────────────────────────── */}
      <section className="gov-section gov-section--subtle" aria-labelledby="press-agenda-title">
        <div className="gov-section__container">
          <h2 id="press-agenda-title" className="gov-section__title">
            {t("agenda.title")}
          </h2>
          <NoticeCallout iconId="fr-icon-calendar-line">
            {t("agenda.empty")}
          </NoticeCallout>
        </div>
      </section>

      {/* ── Press contacts ────────────────────────────────────────────── */}
      <section className="gov-section" aria-labelledby="press-contacts-title">
        <div className="gov-section__container">
          <h2 id="press-contacts-title" className="gov-section__title">
            {t("contacts.title")}
          </h2>
          <div className="gov-press-contacts">
            <div className="gov-press-contacts__card">
              <h3 className="gov-press-contacts__name">{t("contacts.government")}</h3>
              <dl className="gov-press-contacts__details">
                <div className="gov-press-contacts__field">
                  <dt>{t("contacts.emailLabel")}</dt>
                  <dd>
                    <a href="mailto:presse@gouv.aor">presse@gouv.aor</a>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="gov-press-contacts__card">
              <h3 className="gov-press-contacts__name">{t("contacts.presidency")}</h3>
              <dl className="gov-press-contacts__details">
                <div className="gov-press-contacts__field">
                  <dt>{t("contacts.emailLabel")}</dt>
                  <dd>
                    <a href="mailto:presse@presidence.gouv.aor">presse@presidence.gouv.aor</a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            <NoticeCallout iconId="fr-icon-information-line">
              {t("contacts.note")}
            </NoticeCallout>
          </div>
        </div>
      </section>

      {/* ── Media resources ───────────────────────────────────────────── */}
      <section className="gov-section gov-section--subtle" aria-labelledby="press-resources-title">
        <div className="gov-section__container">
          <h2 id="press-resources-title" className="gov-section__title">
            {t("resources.title")}
          </h2>
          <NoticeCallout iconId="fr-icon-image-line">
            {t("resources.empty")}
          </NoticeCallout>
        </div>
      </section>
    </>
  );
}
