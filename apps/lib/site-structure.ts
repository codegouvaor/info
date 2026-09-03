/**
 * URL structure of the public portal.
 *
 * Hrefs are locale-agnostic pathnames: the next-intl Link (registered as the
 * ADS link renderer) prefixes the active locale automatically. Labels are
 * never stored here — they come from the message catalogs through the key
 * provided by each entry.
 */
export const PORTAL_HOME = "/";

export type PrimaryNavKey =
  | "aLaUne"
  | "decryptages"
  | "etatEtMoi"
  | "preventionDesRisques"
  | "gouvernement"
  | "suiviDesEngagements"
  | "liensUtiles";

/** A link inside a mega-menu panel; its label is a `nav.panel` message key. */
export type PrimaryNavLink = {
  labelKey: string;
  href: string;
};

export type MegaMenuCategory = {
  /** Message key (`nav.panel`) of the category heading. */
  titleKey: string;
  links: ReadonlyArray<PrimaryNavLink>;
};

/**
 * One top-level entry of the Government Header navigation, modelled after
 * info.gouv.fr: every section opens a mega-menu panel (leader + optional
 * categories). Some sections point to placeholder pages whose content is
 * published in an upcoming version.
 *
 * Top-level labels resolve under `nav.primary` (`labelKey`), panel content
 * under `nav.panel` (`titleKey`, `paragraphKey` and nested `labelKey`s).
 */
export type PrimaryNavItem =
  | {
      type: "link";
      labelKey: string;
      href: string;
    }
  | {
      type: "megaMenu";
      labelKey: string;
      href: string;
      leader: {
        titleKey: string;
        paragraphKey: string;
        /** Prominent panel link, like info.gouv.fr's “Discover” call-to-action. */
        link?: PrimaryNavLink;
      };
      categories?: ReadonlyArray<MegaMenuCategory>;
    };

export type FooterColumn = {
  /** Message key (`footer.columns`) of the column heading. */
  columnKey: string;
  links: ReadonlyArray<PrimaryNavLink>;
};

export const sectionPaths = {
  composition: "/government/composition",
  decryptages: "/decryptages",
  lEtatEtMoi: "/l-etat-et-moi",
  preventionDesRisques: "/prevention-des-risques",
  suiviDesEngagements: "/suivi-des-engagements",
  liensUtiles: "/liens-utiles",
} as const;

export const legalPaths = {
  accessibility: "/legal/accessibility",
  privacy: "/legal/privacy",
  terms: "/legal/terms",
  cookies: "/legal/cookies",
  sitemap: "/sitemap",
} as const;

export const searchPath = "/search";

/** Press area of the portal (dedicated page being published). */
export const pressPath = "/presse";

/** DOM ids used as skip-link targets. */
export const pageAnchors = {
  content: "main-content",
  footer: "main-footer",
} as const;

/**
 * Link columns of the Government Footer, mirroring info.gouv.fr:
 * Actualités, Grands dossiers, Prévenir les risques, Outils, L'État et moi.
 * Labels resolve under `nav.panel`, column titles under `footer.columns`.
 */
export const footerNavigation: ReadonlyArray<FooterColumn> = [
  {
    columnKey: "actualites",
    links: [
      { labelKey: "allNews", href: "/news" },
      {
        labelKey: "actualitePremierMinistre",
        href: "/news/actualite-du-premier-ministre",
      },
      { labelKey: "budget", href: "/news/budget" },
      { labelKey: "sante", href: "/news/sante" },
      { labelKey: "ceQuiChange", href: "/news/ce-qui-change" },
      { labelKey: "vosQuestions", href: "/news/vos-questions-nos-reponses" },
      { labelKey: "videos", href: "/news/videos" },
      { labelKey: "podcasts", href: "/news/podcasts" },
      { labelKey: "lettresInfo", href: "/news/newsletters" },
      { labelKey: "articlesAudio", href: "/news/articles-audio" },
    ],
  },
  {
    columnKey: "grandsDossiers",
    links: [
      { labelKey: "parlonsSanteMentale", href: "/news/parlons-sante-mentale" },
      { labelKey: "toutesEtTousEgaux", href: "/news/toutes-et-tous-egaux" },
      { labelKey: "relanceLogement", href: "/news/relance-logement" },
      { labelKey: "franceGrandAngle", href: "/news/la-france-en-grand-angle" },
      { labelKey: "france2030", href: "/news/france-2030" },
      { labelKey: "franceNationVerte", href: "/news/france-nation-verte" },
      { labelKey: "maisonsFranceServices", href: "/news/maisons-france-services" },
      { labelKey: "tousLesGrandsDossiers", href: "/news/grands-dossiers" },
    ],
  },
  {
    columnKey: "prevenirLesRisques",
    links: [
      {
        labelKey: "sePreparerUrgenceTitle",
        href: "/prevention-des-risques/se-preparer-a-une-situation-durgence",
      },
      {
        labelKey: "risquesNaturels",
        href: "/prevention-des-risques/risques-naturels-et-technologiques",
      },
      { labelKey: "risquesEpidemiques", href: "/prevention-des-risques/risques-epidemiques" },
      { labelKey: "menaceTerroriste", href: "/prevention-des-risques/menace-terroriste" },
      { labelKey: "menaceCyber", href: "/prevention-des-risques/menace-cyber" },
    ],
  },
  {
    columnKey: "outils",
    links: [
      { labelKey: "portailAccessibilite", href: legalPaths.accessibility },
      { labelKey: "marqueEtat", href: "/marque-de-letat" },
      { labelKey: "devenirPartenaireEtat", href: "/devenir-partenaire-de-letat" },
      { labelKey: "liensUtilesDemarches", href: sectionPaths.liensUtiles },
    ],
  },
  {
    columnKey: "lEtatEtMoi",
    links: [
      { labelKey: "homeLink", href: sectionPaths.lEtatEtMoi },
      { labelKey: "etatOrganisateur", href: "/l-etat-et-moi/etat-organisateur" },
      { labelKey: "etatProtecteur", href: "/l-etat-et-moi/etat-protecteur" },
      { labelKey: "etatFacilitateur", href: "/l-etat-et-moi/etat-facilitateur" },
      { labelKey: "etatMoteur", href: "/l-etat-et-moi/etat-moteur" },
      { labelKey: "etatPromoteur", href: "/l-etat-et-moi/etat-promoteur" },
      { labelKey: "etatInfluent", href: "/l-etat-et-moi/etat-influent" },
    ],
  },
];

/**
 * Main navigation of the Government Header, mirroring info.gouv.fr:
 * À la une, Décryptages, L'État et moi, Prévention des risques,
 * Le Gouvernement, Suivi des engagements, Liens utiles — each opening a
 * mega-menu panel.
 */
export const primaryNavigation: ReadonlyArray<PrimaryNavItem> = [
  {
    type: "megaMenu",
    labelKey: "aLaUne",
    href: "/",
    leader: {
      titleKey: "aLaUneTitle",
      paragraphKey: "aLaUneText",
      link: { labelKey: "homeLink", href: "/" },
    },
    categories: [
      {
        titleKey: "actualiteCategory",
        links: [
          { labelKey: "ceQuiChange", href: "/news/ce-qui-change" },
          { labelKey: "vosQuestions", href: "/news/vos-questions-nos-reponses" },
          { labelKey: "actualitePremierMinistre", href: "/news/actualite-du-premier-ministre" },
          { labelKey: "allNews", href: "/news" },
        ],
      },
      {
        titleKey: "mediasCategory",
        links: [
          { labelKey: "podcasts", href: "/news/podcasts" },
          { labelKey: "articlesAudio", href: "/news/articles-audio" },
          { labelKey: "newsletters", href: "/news/newsletters" },
          { labelKey: "videos", href: "/news/videos" },
        ],
      },
      {
        titleKey: "thematiquesCategory",
        links: [
          { labelKey: "budget", href: "/news/budget" },
          { labelKey: "harcelement", href: "/news/harcelement-a-lecole" },
          { labelKey: "laicite", href: "/news/laicite" },
          { labelKey: "narcotrafic", href: "/news/narcotrafic" },
          { labelKey: "sante", href: "/news/sante" },
          { labelKey: "handicap", href: "/news/handicap" },
          { labelKey: "rechercheInnovation", href: "/news/recherche-et-innovation" },
          { labelKey: "intelligenceArtificielle", href: "/news/intelligence-artificielle" },
        ],
      },
      {
        titleKey: "grandsDossiersCategory",
        links: [
          { labelKey: "parlonsSanteMentale", href: "/news/parlons-sante-mentale" },
          { labelKey: "relanceLogement", href: "/news/relance-logement" },
          { labelKey: "franceGrandAngle", href: "/news/la-france-en-grand-angle" },
          { labelKey: "france2030", href: "/news/france-2030" },
          { labelKey: "toutesEtTousEgaux", href: "/news/toutes-et-tous-egaux" },
          { labelKey: "franceNationVerte", href: "/news/france-nation-verte" },
          { labelKey: "maisonsFranceServices", href: "/news/maisons-france-services" },
          { labelKey: "tousLesGrandsDossiers", href: "/news/grands-dossiers" },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "decryptages",
    href: sectionPaths.decryptages,
    leader: {
      titleKey: "decryptagesTitle",
      paragraphKey: "decryptagesText",
      link: { labelKey: "decryptagesDiscover", href: sectionPaths.decryptages },
    },
    categories: [
      {
        titleKey: "decryptagesCategory",
        links: [{ labelKey: "allNews", href: "/news" }],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "etatEtMoi",
    href: sectionPaths.lEtatEtMoi,
    leader: {
      titleKey: "etatEtMoiMissionsTitle",
      paragraphKey: "etatEtMoiMissionsText",
      link: { labelKey: "etatEtMoiDiscover", href: sectionPaths.lEtatEtMoi },
    },
    categories: [
      {
        titleKey: "etatEtMoiCategory",
        links: [
          { labelKey: "etatOrganisateur", href: "/l-etat-et-moi/etat-organisateur" },
          { labelKey: "etatProtecteur", href: "/l-etat-et-moi/etat-protecteur" },
          { labelKey: "etatFacilitateur", href: "/l-etat-et-moi/etat-facilitateur" },
          { labelKey: "etatMoteur", href: "/l-etat-et-moi/etat-moteur" },
          { labelKey: "etatPromoteur", href: "/l-etat-et-moi/etat-promoteur" },
          { labelKey: "etatInfluent", href: "/l-etat-et-moi/etat-influent" },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "preventionDesRisques",
    href: sectionPaths.preventionDesRisques,
    leader: {
      titleKey: "sePreparerUrgenceTitle",
      paragraphKey: "sePreparerUrgenceText",
      link: {
        labelKey: "preventionDiscover",
        href: "/prevention-des-risques/se-preparer-a-une-situation-durgence",
      },
    },
    categories: [
      {
        titleKey: "prevenirLesRisquesCategory",
        links: [
          { labelKey: "risquesAccueil", href: sectionPaths.preventionDesRisques },
          {
            labelKey: "risquesNaturels",
            href: "/prevention-des-risques/risques-naturels-et-technologiques",
          },
          { labelKey: "cybercriminalite", href: "/prevention-des-risques/cybercriminalite" },
          { labelKey: "menaceTerroriste", href: "/prevention-des-risques/menace-terroriste" },
          {
            labelKey: "infectionsRespiratoires",
            href: "/prevention-des-risques/infections-respiratoires",
          },
          { labelKey: "kitUrgence", href: "/prevention-des-risques/kit-d-urgence" },
          { labelKey: "devenirVolontaire", href: "/prevention-des-risques/devenir-volontaire" },
        ],
      },
      {
        titleKey: "caniculeCategory",
        links: [
          { labelKey: "caniculeLink", href: "/prevention-des-risques/canicule-et-vagues-de-chaleur" },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "gouvernement",
    href: "/government",
    leader: {
      titleKey: "gouvernementTitle",
      paragraphKey: "gouvernementText",
      link: { labelKey: "gouvernementDiscover", href: "/government" },
    },
    categories: [
      {
        titleKey: "gouvernementCategory",
        links: [{ labelKey: "gouvernementComposition", href: sectionPaths.composition }],
      },
      {
        titleKey: "contactCategory",
        links: [{ labelKey: "contactLink", href: "/contact" }],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "suiviDesEngagements",
    href: sectionPaths.suiviDesEngagements,
    leader: {
      titleKey: "suiviTitle",
      paragraphKey: "suiviText",
      link: { labelKey: "suiviDiscover", href: sectionPaths.suiviDesEngagements },
    },
    categories: [
      {
        titleKey: "gouvernementCategory",
        links: [
          { labelKey: "gouvernementLink", href: "/government" },
          { labelKey: "gouvernementComposition", href: sectionPaths.composition },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "liensUtiles",
    href: sectionPaths.liensUtiles,
    leader: {
      titleKey: "liensTitle",
      paragraphKey: "liensText",
      link: { labelKey: "liensDiscover", href: sectionPaths.liensUtiles },
    },
    categories: [
      {
        titleKey: "liensSitesCategory",
        links: [
          { labelKey: "servicesLink", href: "/services" },
          { labelKey: "sitemapLink", href: legalPaths.sitemap },
        ],
      },
      {
        titleKey: "liensPortalCategory",
        links: [
          { labelKey: "searchLink", href: searchPath },
          { labelKey: "contactLink", href: "/contact" },
        ],
      },
    ],
  },
];