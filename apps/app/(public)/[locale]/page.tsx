import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { sectionPaths } from "@/lib/site-structure";
import { CtaButtonsGroup, LinkTile } from "@/components/public/content/ads-fragments";

const NEWS_PATH = "/news";
const SERVICES_PATH = "/services";
const GOVERNMENT_PATH = "/government";
const CONTACT_PATH = "/contact";

/** « Top tasks » shortcuts of the home page. */
const topTasks: ReadonlyArray<{ id: string; href: string }> = [
  { id: "composition", href: sectionPaths.composition },
  { id: "news", href: NEWS_PATH },
  { id: "services", href: SERVICES_PATH },
  { id: "contact", href: CONTACT_PATH },
];

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);

  const tHome = await getTranslations({ locale, namespace: "home" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });

  return {
    title: tHome("title"),
    description: tMeta("description"),
    ...localizedAlternates(locale, "/"),
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const tHome = await getTranslations({ locale, namespace: "home" });

  return (
    <>
      {/* Hero */}
      <div className="gov-hero gov-section">
        <div className="gov-section__container gov-prose">
          <p className="gov-kicker">{tHome("kicker")}</p>
          <h1>{tHome("title")}</h1>
          <p className="gov-lead">{tHome("lead")}</p>
          <CtaButtonsGroup
            buttons={[
              {
                children: tHome("ctaPrimary"),
                href: GOVERNMENT_PATH,
                iconId: "fr-icon-arrow-right-line",
              },
              {
                children: tHome("ctaSecondary"),
                href: SERVICES_PATH,
                priority: "secondary",
              },
            ]}
          />
        </div>
      </div>

      {/* Top tasks */}
      <div className="gov-section gov-section--subtle">
        <div className="gov-section__container">
          <div className="gov-prose">
            <h2>{tHome("tasksTitle")}</h2>
          </div>
          <div className="fr-grid-row fr-grid-row--gutters">
            {topTasks.map((task) => (
              <div key={task.id} className="fr-col-12 fr-col-md-6 fr-col-lg-3">
                <LinkTile
                  title={tHome(`tasks.${task.id}.title`)}
                  desc={tHome(`tasks.${task.id}.desc`)}
                  href={task.href}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* News teaser */}
      <div className="gov-section">
        <div className="gov-section__container gov-prose">
          <h2>{tHome("newsTitle")}</h2>
          <p className="gov-lead">{tHome("newsLead")}</p>
          <CtaButtonsGroup
            buttons={[
              {
                children: tHome("newsCta"),
                href: NEWS_PATH,
                priority: "secondary",
                iconId: "fr-icon-arrow-right-line",
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}
