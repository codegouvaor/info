import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { Link } from "@/i18n/navigation";
import { ministries, relatedItems, understandItems } from "@/lib/government-ministries";
import { NoticeCallout } from "@/components/public/content/ads-fragments";

const PAGE_PATH = "/government/ministere";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  const t = await getTranslations({ locale, namespace: "pages.ministere" });

  return {
    title: t("title"),
    description: t("description"),
    ...localizedAlternates(locale, PAGE_PATH),
  };
}

/**
 * `/government/ministere` — the institutional directory of the ministries of
 * the Republic of Astoria.
 *
 * The page presents the ministries themselves — the departments of State in
 * charge of public policies — not a list of ministers. The model is explicit:
 * a ministry is an institution, a minister is a person who may be appointed
 * to lead it. The structure lives in `lib/government-ministries.ts`, every
 * word comes from the `ministere.*` message catalogs, and the official list
 * is fed by the `ministries` array of that file (today empty: the directory
 * shows its institutional empty state instead of inventing portfolios).
 *
 * The page is the entry point of the « Le Gouvernement → Ministères » mega
 * menu entry and stays coherent with `/government` and
 * `/government/composition`. Each ministry may later get its own page at
 * `/government/ministere/[slug]`; the directory only links to published
 * pages — no dead links.
 */
export default async function GovernmentMinistryPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "ministere" });

  return (
    <>
      {/* 01 — Hero : what the ministries are */}
      <section className="gov-section gov-page-hero" aria-labelledby="gov-min-hero-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("hero.kicker")}</p>
          <h1 id="gov-min-hero-title">{t("hero.title")}</h1>
          <p className="gov-page-hero__subtitle">{t("hero.subtitle")}</p>
          <p className="gov-lead">{t("hero.intro")}</p>
        </div>
      </section>

      {/* 02 — Comprendre : a ministry is an institution */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-min-understand-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("understand.kicker")}</p>
          <h2 id="gov-min-understand-title" className="gov-section__title">
            {t("understand.title")}
          </h2>
          <p className="gov-lead">{t("understand.lead")}</p>
          <ul className="gov-rows">
            {understandItems.map((item) => (
              <li key={item.key} className="gov-row">
                <h3>{t(`understand.items.${item.key}.title`)}</h3>
                <p className="gov-row__text">{t(`understand.items.${item.key}.text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 03 — L'annuaire des ministères */}
      <section className="gov-section" aria-labelledby="gov-min-directory-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("directory.kicker")}</p>
          <h2 id="gov-min-directory-title" className="gov-section__title">
            {t("directory.title")}
          </h2>
          <p className="gov-lead">{t("directory.lead")}</p>

          {ministries.length === 0 ? (
            <div className="gov-section-notice">
              <NoticeCallout iconId="fr-icon-information-line" title={t("directory.emptyTitle")}>
                {t("directory.emptyText")}
              </NoticeCallout>
            </div>
          ) : (
            /* Feed slot: renders one row per ministry once `ministries` is
               populated. The ministry stays the primary information — name,
               description, areas of responsibility — and the holder, joined
               from `governmentOffices` + `officeHolders` + `persons` when the
               Government is constituted, stays secondary. The `href` of each
               entry points to its published page; no layout rework needed. */
            <ul className="gov-rows">
              {ministries.map((ministry) => (
                <li key={ministry.id} className="gov-row">
                  <h3>{ministry.name}</h3>
                  <p className="gov-row__text">{ministry.description}</p>
                  <p className="gov-row__text">
                    <strong>{t("directory.responsibilitiesLabel")}</strong>{" "}
                    {ministry.responsibilities.join(" · ")}
                  </p>
                  {ministry.href && (
                    <p className="gov-row__actions">
                      <Link className="gov-row__link" href={ministry.href}>
                        {t("readMore")}
                        <span aria-hidden="true" className="fr-icon-arrow-right-line" />
                      </Link>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}

          <h3 className="gov-section__subtitle">{t("directory.ficheTitle")}</h3>
          <ul className="gov-fiche-list">
            {(["name", "description", "competences", "titulaire", "page"] as const).map((field) => (
              <li key={field}>{t(`directory.fiche.${field}`)}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 04 — Pour aller plus loin : outbound links */}
      <section className="gov-section gov-section--subtle" aria-labelledby="gov-min-related-title">
        <div className="gov-section__container">
          <p className="gov-kicker">{t("related.kicker")}</p>
          <h2 id="gov-min-related-title" className="gov-section__title">
            {t("related.title")}
          </h2>
          <p className="gov-lead">{t("related.lead")}</p>
          <ul className="gov-rows">
            {relatedItems.map((item) => (
              <li key={item.key} className="gov-row">
                <h3>{t(`related.items.${item.key}.title`)}</h3>
                <p className="gov-row__text">{t(`related.items.${item.key}.text`)}</p>
                <p className="gov-row__actions">
                  <Link className="gov-row__link" href={item.href}>
                    {t("readMore")}
                    <span aria-hidden="true" className="fr-icon-arrow-right-line" />
                  </Link>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}