import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { Link } from "@/i18n/navigation";
import { governmentPaths } from "@/lib/government-content";
import { NoticeCallout } from "@/components/public/content/ads-fragments";

const PAGE_PATH = governmentPaths.sig;

/**
 * Mission rows of the SIG page. Labels and texts resolve from the
 * `sig.missions.items.<key>` message catalog — every word rendered here
 * comes from the catalogs, the structure lives in this file.
 */
const SIG_MISSIONS = ["informer", "portail", "presse", "campagnes"] as const;

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  const t = await getTranslations({ locale, namespace: "pages.sig" });

  return {
    title: t("title"),
    description: t("description"),
    ...localizedAlternates(locale, PAGE_PATH),
  };
}

/**
 * `/government/sig` — the dedicated institutional page of the Service
 * d'Information du Gouvernement (SIG) of the Republic of Astoria.
 *
 * The SIG is a particular service of the Government: it is presented here
 * as an autonomous institution — its identity, its missions and the
 * institutional empty states for publications, news and contact. Every word
 * comes from the `sig.*` message catalogs; sections grow as official data
 * becomes available, without any front-end rework.
 */
export default async function GovernmentSigPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "sig" });

  return (
    <>
      {/* 01 — Hero : the service identity */}
      <section className="gov-section gov-page-hero" aria-labelledby="gov-sig-hero-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("hero.kicker")}</p>
          <h1 id="gov-sig-hero-title">{t("hero.title")}</h1>
          <p className="gov-page-hero__subtitle">{t("hero.subtitle")}</p>
          <p className="gov-lead">{t("hero.intro")}</p>
        </div>
      </section>

      {/* 02 — Présentation : the institutional description */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-sig-presentation-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("presentation.kicker")}</p>
          <h2 id="gov-sig-presentation-title" className="gov-section__title">
            {t("presentation.title")}
          </h2>
          <p className="gov-lead">{t("presentation.lead")}</p>
        </div>
      </section>

      {/* 03 — Missions : the key missions of the service */}
      <section className="gov-section" aria-labelledby="gov-sig-missions-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("missions.kicker")}</p>
          <h2 id="gov-sig-missions-title" className="gov-section__title">
            {t("missions.title")}
          </h2>
          <p className="gov-lead">{t("missions.lead")}</p>
          <ul className="gov-rows">
            {SIG_MISSIONS.map((key) => (
              <li key={key} className="gov-row">
                <h3>{t(`missions.items.${key}.title`)}</h3>
                <p className="gov-row__text">{t(`missions.items.${key}.text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 04 — Publications : institutional empty state */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-sig-publications-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("publications.kicker")}</p>
          <h2 id="gov-sig-publications-title" className="gov-section__title">
            {t("publications.title")}
          </h2>
          <div className="gov-section-notice">
            <NoticeCallout iconId="fr-icon-file-text-line">
              {t("publications.empty")}
            </NoticeCallout>
          </div>
        </div>
      </section>

      {/* 05 — Actualités : institutional empty state */}
      <section className="gov-section" aria-labelledby="gov-sig-news-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("news.kicker")}</p>
          <h2 id="gov-sig-news-title" className="gov-section__title">
            {t("news.title")}
          </h2>
          <div className="gov-section-notice">
            <NoticeCallout iconId="fr-icon-newspaper-line">
              {t("news.empty")}
            </NoticeCallout>
          </div>
        </div>
      </section>

      {/* 06 — Contact : institutional empty state */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-sig-contact-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("contact.kicker")}</p>
          <h2 id="gov-sig-contact-title" className="gov-section__title">
            {t("contact.title")}
          </h2>
          <div className="gov-section-notice">
            <NoticeCallout iconId="fr-icon-mail-line">
              {t("contact.empty")}
            </NoticeCallout>
          </div>
        </div>
      </section>

      {/* 07 — Retour au Gouvernement */}
      <section className="gov-section" aria-labelledby="gov-sig-back">
        <div className="gov-section__container">
          <p className="gov-office__holder">
            <Link className="gov-row__link" href={governmentPaths.organisation}>
              {t("backLink")}
              <span aria-hidden="true" className="fr-icon-arrow-right-line" />
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}