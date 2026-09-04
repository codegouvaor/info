import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { Link } from "@/i18n/navigation";
import {
  getMinistriesWithHolders,
  relatedItems,
  understandItems,
  type MinistryWithHolder,
} from "@/lib/government-ministries";
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
 * `/government/ministere` — the official directory of the ministries of
 * the Republic of Astoria.
 *
 * The page presents the ministries themselves — the departments of State in
 * charge of public policies — not a list of ministers. The model is explicit:
 * a ministry is an institution, a minister is a person who may be appointed
 * to lead it. The structure lives in `lib/government-ministries.ts`, every
 * word comes from the `ministere.*` message catalogs, and the official list
 * is fed by the `getMinistriesWithHolders()` resolver.
 *
 * Each ministry is rendered as an autonomous institutional entry with:
 *   - Official name
 *   - Description
 *   - Areas of responsibility
 *   - Current holder (or "No holder currently appointed")
 *   - Link to dedicated page (when published)
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
  const tOffices = await getTranslations({ locale, namespace: "government.offices" });

  const entries = getMinistriesWithHolders();

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

          {entries.length === 0 ? (
            <div className="gov-section-notice">
              <NoticeCallout iconId="fr-icon-information-line" title={t("directory.emptyTitle")}>
                {t("directory.emptyText")}
              </NoticeCallout>
            </div>
          ) : (
            <ul className="gov-ministry-list" role="list">
              {entries.map((entry) => (
                <MinistryCard key={entry.ministry.id} entry={entry} t={t} tOffices={tOffices} />
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

/**
 * Renders a single ministry as an autonomous institutional card.
 *
 * The ministry name is the dominant visual element. Description and
 * responsibilities allow immediate understanding of its role. Holder
 * information is deliberately secondary: when a minister is appointed, their
 * name appears with a link to their profile; when no minister is appointed,
 * a neutral institutional message is displayed — the ministry itself remains
 * fully visible.
 */
function MinistryCard({
  entry,
  t,
  tOffices,
}: {
  entry: MinistryWithHolder;
  t: Awaited<ReturnType<typeof getTranslations>>;
  tOffices: Awaited<ReturnType<typeof getTranslations>>;
}) {
  const { ministry, holder } = entry;

  return (
    <li className="gov-ministry-card">
      <h3 className="gov-ministry-card__name">
        {ministry.name}
        {ministry.shortName && (
          <span className="gov-ministry-card__short-name">({ministry.shortName})</span>
        )}
      </h3>

      <p className="gov-ministry-card__description">{ministry.description}</p>

      {ministry.responsibilities.length > 0 && (
        <>
          <p className="gov-ministry-card__section-title">{t("directory.responsibilitiesLabel")}</p>
          <ul className="gov-ministry-card__competences" aria-label={t("directory.responsibilitiesLabel")}>
            {ministry.responsibilities.map((resp) => (
              <li key={resp} className="gov-ministry-card__competence">
                {resp}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="gov-ministry-card__holder">
        <span className="gov-ministry-card__holder-label">{t("directory.holderLabel")}</span>
        {holder ? (
          <span className="gov-ministry-card__holder-value gov-ministry-card__holder-value--named">
            {holder.person.firstName} {holder.person.lastName}
          </span>
        ) : (
          <span className="gov-ministry-card__holder-value">
            {t("directory.holderEmpty")}
          </span>
        )}
      </div>

      {holder && holder.person.slug && (
        <p className="gov-ministry-card__actions">
          <Link
            className="gov-ministry-card__holder-link"
            href={`/government/membres/${holder.person.slug}`}
          >
            {t("directory.viewProfile")}
            <span aria-hidden="true" className="fr-icon-arrow-right-line" />
          </Link>
        </p>
      )}

      {ministry.officialWebsite && (
        <p className="gov-ministry-card__actions">
          <a
            href={`https://${ministry.officialWebsite}`}
            className="gov-external-link-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("directory.website")}
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
          </a>
        </p>
      )}

      <p className="gov-ministry-card__actions">
        <Link className="gov-row__link" href={`/government/ministere/${ministry.slug}`}>
          {t("readMore")}
          <span aria-hidden="true" className="fr-icon-arrow-right-line" />
        </Link>
      </p>
    </li>
  );
}
