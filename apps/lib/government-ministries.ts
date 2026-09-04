/**
 * Content structure and data model of the `/government/ministere`
 * institutional page.
 *
 * Same architecture as `government-composition.ts`: the *structure* of the
 * page lives here, every UI word comes from the message catalogs
 * (`ministere.*` in `apps/messages/`), and no data is ever invented.
 *
 * Data model — institutions and people are never mixed:
 *
 *   MINISTÈRE (institution)
 *        │  exists independently of any holder
 *   FONCTION GOUVERNEMENTALE (poste)
 *        │  e.g. « Ministre de l'Économie » or a secretary of state
 *   PERSONNE
 *        └─ may hold a post for a given period (OfficeHolder)
 *
 * A ministry is a department of State: it exists even when no minister is
 * appointed, it survives changes of Government, and its dedicated page (to
 * come at `/government/ministere/[slug]`) describes the institution — the
 * holder is only a secondary piece of information.
 *
 * The page works today without any ministry defined (it renders its
 * institutional empty state) and welcomes the official list later by filling
 * the arrays below and the matching messages — no front-end rework. Linking
 * principle (same as `/government`): an entry only carries an `href` when its
 * dedicated page is actually published — no dead links.
 */

/** Sub-pages related to this page (all currently published). */
export const ministryPaths = {
  hub: "/government",
  composition: "/government/composition",
  organisation: "/government/organisation",
  index: "/government/ministere",
} as const;

/**
 * A ministry — the department of State in charge of an area of public policy.
 * The institution exists independently of its office holder.
 */
export type Ministry = {
  id: string;
  /** Stable URL segment of the dedicated page (`/government/ministere/<slug>`). */
  slug: string;
  /** Official name of the ministry (data, not a UI label). */
  name: string;
  /** Short name / abbreviation when one exists officially. */
  shortName?: string;
  /** Institutional description of the ministry (data). */
  description: string;
  /** Main areas of responsibility of the ministry (data). */
  responsibilities: ReadonlyArray<string>;
  /** Operational status of the ministry within the institutional framework. */
  status?: "active" | "inactive";
  /** Dedicated page once published; omitted while unpublished (no dead link). */
  href?: string;

  /* ---------------------------------------------------------------------- *
   * Detailed page fields — populated as official data becomes available.
   * None of these are invented: they are left undefined until documented.
   * ---------------------------------------------------------------------- */

  /** Extended institutional description for the dedicated page. */
  longDescription?: string;

  /** Key missions of the ministry, each with a title and explanation. */
  missions?: ReadonlyArray<{ title: string; text: string }>;

  /** Administrations or agencies formally attached to the ministry. */
  attachedAdministrations?: ReadonlyArray<{ name: string; description?: string }>;

  /** Core policy domains the ministry operates in. */
  policyDomains?: ReadonlyArray<string>;

  /** Official institutional website (e.g. "interieur.gouv.aor"). */
  officialWebsite?: string;
};

/**
 * A ministry resolution result: the ministry joined with its current holder
 * (if any) for display on the directory page.
 */
export type MinistryWithHolder = {
  ministry: Ministry;
  holder?: {
    person: Person;
    office: GovernmentOffice;
    officeHolder: OfficeHolder;
  };
};

/**
 * A post within the Government. The President of the Republic is a post like
 * the others in this model — an institutional function a person may hold —
 * even though the members page presents it separately (it is the central
 * executive office of the Astorian model, not a ministry post).
 */
export type GovernmentOfficeType = "president" | "minister" | "state-secretary";

export type GovernmentOffice = {
  id: string;
  /**
   * Message key of the official title of the post (resolved under
   * `government.offices`), e.g. `president` → « Président de la République ».
   * Titles are institutional words and must be localizable.
   */
  titleKey: string;
  type: GovernmentOfficeType;
  /** Ministry the post belongs to, when it is attached to one. */
  ministryId?: string;
};

/**
 * A person — may hold one or more government posts over time. Names are data
 * (never translated); the optional `slug` and `photo` feed the future
 * individual pages (`/government/membres/<slug>`) and official portraits.
 */
export type Person = {
  id: string;
  /** Stable URL segment of the future individual page, when published. */
  slug?: string;
  firstName: string;
  lastName: string;
  /** Official portrait once an official source exists. */
  photo?: string;
};

/** A person holding a government post over a given period. */
export type OfficeHolder = {
  officeId: string;
  personId: string;
  startDate?: string;
  endDate?: string;
};

/**
 * Official list of ministries of the Republic of Astoria. Each entry is an
 * autonomous institution — the ministry exists independently of any minister.
 * Fill this array and set `href` once the dedicated pages are published.
 */
export const ministries: ReadonlyArray<Ministry> = [
  {
    id: "interieur",
    slug: "interieur",
    name: "Ministère de l'Intérieur",
    description:
      "Le ministère de l'Intérieur est chargé de la sécurité intérieure, de l'administration territoriale et de la citoyenneté. Il veille au maintien de l'ordre public, coordonne les services de sécurité et administre le territoire national.",
    longDescription:
      "Le ministère de l'Intérieur est l'un des piliers de l'organisation étatique de la République d'Astoria. Il assure la sécurité intérieure du territoire, coordonne les forces de l'ordre et garantit le bon fonctionnement de l'administration territoriale. Le ministère veille également à la délivrance des documents officiels, à la gestion de la citoyenneté et à la protection des institutions. Son action couvre l'ensemble du territoire national, des communes aux grandes métropoles.",
    responsibilities: [
      "Sécurité intérieure",
      "Administration territoriale",
      "Citoyenneté",
    ],
    missions: [
      {
        title: "Maintien de l'ordre public",
        text: "Coordination des forces de l'ordre — police nationale, gendarmerie — pour garantir la sécurité des personnes et des biens sur l'ensemble du territoire.",
      },
      {
        title: "Administration du territoire",
        text: "Organisation et pilotage de l'administration préfectorale, décentralisée sur les collectivités territoriales de la République.",
      },
      {
        title: "Délivrance des documents officiels",
        text: "Gestion des pièces d'identité, passeports, titres de séjour et carte nationale d'identité.",
      },
      {
        title: "Protection des institutions",
        text: "Sécurisation des établissements publics, des manifestations et des événements d'État.",
      },
    ],
    attachedAdministrations: [
      { name: "Police nationale" },
      { name: "Gendarmerie nationale" },
      { name: "Direction générale de la sécurité civile et de la gestion des crises" },
    ],
    policyDomains: [
      "Sécurité intérieure",
      "Administration territoriale",
      "Gestion des crises",
      "Politique migratoire",
    ],
    officialWebsite: "interieur.gouv.aor",
    status: "active",
  },
  {
    id: "armees",
    slug: "armees",
    name: "Ministère des Armées et des Anciens combattants",
    description:
      "Le ministère des Armées et des Anciens combattants assure la défense nationale, gère les forces armées et accompagne les anciens combattants. Il garantit la protection de la souveraineté et de l'intégrité territoriale de la République.",
    longDescription:
      "Le ministère des Armées et des Anciens combattants est chargé de la défense de la souveraineté et de l'intégrité territoriale de la République d'Astoria. Il administre les forces armées — armée de terre, marine nationale, armée de l'air — et pilote la politique de défense nationale. Le ministère assure également l'accompagnement et la reconnaissance des anciens combattants, et participe aux opérations extérieures sous mandat international.",
    responsibilities: [
      "Défense nationale",
      "Forces armées",
      "Anciens combattants",
    ],
    missions: [
      {
        title: "Défense de la souveraineté",
        text: "Protection de l'intégrité territoriale et défense des intérêts fondamentaux de la République face aux menaces extérieures.",
      },
      {
        title: "Gestion des forces armées",
        text: "Organisation, équipement et préparation des armées — terre, mer, air — pour remplir leurs missions de défense et de sécurité.",
      },
      {
        title: "Opérations extérieures",
        text: "Engagement des forces dans le cadre de mandats internationaux et de missions de paix sous couvert multilatéral.",
      },
      {
        title: "Accompagnement des anciens combattants",
        text: "Reconnaissance, soutien social et médico-social des anciens combattants et de leurs ayants droit.",
      },
    ],
    attachedAdministrations: [
      { name: "État-major des armées" },
      { name: "Direction générale de l'armement" },
      { name: "Service historique de la Défense" },
    ],
    policyDomains: [
      "Défense nationale",
      "Sécurité et défense",
      "Politique d'engagement extérieur",
      "Mémoire et reconnaissance",
    ],
    officialWebsite: "defense.gouv.aor",
    status: "active",
  },
  {
    id: "justice",
    slug: "justice",
    name: "Ministère de la Justice",
    description:
      "Le ministère de la Justice est chargé de l'organisation de la justice, du droit et de l'administration pénitentiaire. Il veille au bon fonctionnement des juridictions et à l'application des lois de la République.",
    longDescription:
      "Le ministère de la Justice garantit l'indépendance du pouvoir judiciaire et veille au respect de l'État de droit. Il organise le fonctionnement des juridictions, pilote la rédaction et la publication des textes législatifs et réglementaires, et administre le régime pénitentiaire. Le ministère assure également la protection des droits fondamentaux des citoyens et accompagne les victimes d'infractions.",
    responsibilities: [
      "Justice",
      "Juridictions",
      "Droit",
      "Administration pénitentiaire",
    ],
    missions: [
      {
        title: "Organisation judiciaire",
        text: "Pilotage du fonctionnement des juridictions — tribunaux judiciaires, cours d'appel, cour de cassation — et des services concourant à l'administration de la justice.",
      },
      {
        title: "Rédaction législative",
        text: "Préparation des projets de loi et des ordonnances, veille juridique et codification du droit positif.",
      },
      {
        title: "Administration pénitentiaire",
        text: "Gestion de l'exécution des peines, du régime carcéral et des mesures de réinsertion.",
      },
      {
        title: "Droits fondamentaux",
        text: "Protection des libertés publiques, garantie de l'accès au droit et lutte contre les discriminations.",
      },
    ],
    attachedAdministrations: [
      { name: "Direction de l'administration judiciaire" },
      { name: "Direction de la protection judiciaire de la jeunesse" },
      { name: "Administration pénitentiaire" },
    ],
    policyDomains: [
      "Justice",
      "Droit public",
      "Sécurité judiciaire",
      "Réinsertion",
    ],
    officialWebsite: "justice.gouv.aor",
    status: "active",
  },
  {
    id: "europe-affaires-etrangeres",
    slug: "europe-affaires-etrangeres",
    name: "Ministère de l'Europe et des Affaires étrangères",
    description:
      "Le ministère de l'Europe et des Affaires étrangères conduit la diplomatie de la République, les relations internationales et la coopération. Il représente la République d'Astoria sur la scène internationale.",
    longDescription:
      "Le ministère de l'Europe et des Affaires étrangères conduit la politique étrangère de la République d'Astoria et représente le pays sur la scène internationale. Il pilote les relations bilatérales et multilatérales, anime la diplomatie européenne et assure la protection des ressortissants astoriens à l'étranger. Le ministère développe également la coopération internationale et la solidarité avec les nations partenaires.",
    responsibilities: [
      "Diplomatie",
      "Relations internationales",
      "Coopération",
    ],
    missions: [
      {
        title: "Diplomatie bilatérale",
        text: "Gestion des relations avec chaque État partenaire, accords bilatéraux et représentation diplomatique permanente.",
      },
      {
        title: "Diplomatie multilatérale",
        text: "Engagement dans les organisations internationales — Nations Unies, organisations régionales — et défense du multilatéralisme.",
      },
      {
        title: "Coopération et développement",
        text: "Programmes d'aide au développement, coopération technique et culturelle avec les pays partenaires.",
      },
      {
        title: "Protection des ressortissants",
        text: "Assistance consulaire, aide aux ressortissants à l'étranger et gestion des situations de crise.",
      },
    ],
    attachedAdministrations: [
      { name: "Direction générale des affaires politiques et des affaires européennes" },
      { name: "Direction générale de la mondialisation et des affaires économiques" },
      { name: "Direction générale des Astoriens à l'étranger et de l'administration consulaire" },
    ],
    policyDomains: [
      "Diplomatie",
      "Affaires européennes",
      "Coopération internationale",
      "Consulat et protection des citoyens",
    ],
    officialWebsite: "diplomatie.gouv.aor",
    status: "active",
  },
  {
    id: "economie-finances",
    slug: "economie-finances",
    name: "Ministère de l'Économie, des Finances et de l'Industrie",
    description:
      "Le ministère de l'Économie, des Finances et de l'Industrie pilote la politique économique, le budget de l'État, la fiscalité et les finances publiques. Il assure la stabilité économique et le développement industriel de la République.",
    longDescription:
      "Le ministère de l'Économie, des Finances et de l'Industrie est l'un des ministères les plus étendus de la République. Il pilote la politique économique nationale, gère les finances publiques, la fiscalité et le budget de l'État. Le ministère veille à la stabilité macroéconomique, soutient la compétitivité industrielle et accompagne la transition vers une économie durable et innovate.",
    responsibilities: [
      "Économie",
      "Budget",
      "Fiscalité",
      "Finances publiques",
      "Industrie",
    ],
    missions: [
      {
        title: "Politique budgétaire",
        text: "Élaboration et exécution du budget de l'État, pilotage des dépenses publiques et contrôle de la soutenabilité des finances.",
      },
      {
        title: "Politique fiscale",
        text: "Conception de la fiscalité, lutte contre la fraude fiscale et optimisation de l'assiette fiscale.",
      },
      {
        title: "Politique économique",
        text: "Analyse macroéconomique, pilotage de la croissance et soutien à la compétitivité des entreprises.",
      },
      {
        title: "Politique industrielle",
        text: "Soutien à l'industrie nationale, développement des secteurs stratégiques et accompagnement de la transition écologique.",
      },
    ],
    attachedAdministrations: [
      { name: "Direction générale du Trésor" },
      { name: "Direction générale des Finances publiques" },
      { name: "Direction générale de la Concurrence, de la Consommation et de la Répression des fraudes" },
    ],
    policyDomains: [
      "Économie",
      "Finances publiques",
      "Industrie",
      "Fiscalité",
    ],
    officialWebsite: "economie.gouv.aor",
    status: "active",
  },
  {
    id: "commerce-artisanat-pme",
    slug: "commerce-artisanat-pme",
    name: "Ministère du Commerce, de l'Artisanat et des PME",
    description:
      "Le ministère du Commerce, de l'Artisanat et des PME soutient le développement du commerce, de l'artisanat et des petites et moyennes entreprises. Il favorise l'entrepreneuriat et la dynamique économique du territoire.",
    longDescription:
      "Le ministère du Commerce, de l'Artisanat et des PME accompagne le tissu économique de la République en soutenant les commerces, les artisans et les petites et moyennes entreprises. Il développe le cadre réglementaire favorable à l'entrepreneuriat, lutte contre la concurrence déloyale et accompagne la modernisation du commerce de proximité. Le ministère est un acteur clé de la vitalité économique des territoires.",
    responsibilities: [
      "Commerce",
      "Entreprises",
      "Artisanat",
      "Entrepreneuriat",
    ],
    missions: [
      {
        title: "Soutien aux PME",
        text: "Accompagnement financier, technique et réglementaire des petites et moyennes entreprises pour leur création et leur développement.",
      },
      {
        title: "Commerce de proximité",
        text: "Développement du commerce de détail, modernisation des enseignes et adaptation aux évolutions numériques.",
      },
      {
        title: "Artisanat",
        text: "Reconnaissance et promotion des métiers artisanaux, formation professionnelle et soutien à la transmission des savoir-faire.",
      },
    ],
    attachedAdministrations: [
      { name: "Direction générale des entreprises" },
    ],
    policyDomains: [
      "Commerce",
      "Entrepreneuriat",
      "Artisanat",
      "Compétitivité",
    ],
    officialWebsite: "entreprises.gouv.aor",
    status: "active",
  },
  {
    id: "travail-emploi",
    slug: "travail-emploi",
    name: "Ministère du Travail et de l'Emploi",
    description:
      "Le ministère du Travail et de l'Emploi définit la politique de l'emploi, veille au respect du droit du travail et développe la formation professionnelle. Il accompagne les salariés et les demandeurs d'emploi.",
    longDescription:
      "Le ministère du Travail et de l'Emploi pilote la politique de l'emploi et veille à la protection des droits des salariés. Il définit le cadre du droit du travail, accompagne la formation professionnelle continue et lutte contre le chômage. Le ministère joue un rôle central dans la négociation sociale entre l'État, les partenaires sociaux et les organisations syndicales.",
    responsibilities: [
      "Emploi",
      "Droit du travail",
      "Formation professionnelle",
    ],
    missions: [
      {
        title: "Politique de l'emploi",
        text: "Programmes d'insertion, accompagnement des demandeurs d'emploi et lutte contre le chômage de longue durée.",
      },
      {
        title: "Droit du travail",
        text: "Élaboration et application du cadre législatif et réglementaire régissant les relations individuelles et collectives du travail.",
      },
      {
        title: "Formation professionnelle",
        text: "Développement des dispositifs de formation continue, validation des acquis et anticipations des besoins en compétences.",
      },
    ],
    attachedAdministrations: [
      { name: "Direction générale du travail" },
      { name: "Direction de l'animation de la recherche, des études et des statistiques" },
    ],
    policyDomains: [
      "Emploi",
      "Droit du travail",
      "Formation",
      "Dialogue social",
    ],
    officialWebsite: "emploi.gouv.aor",
    status: "active",
  },
  {
    id: "solidarites-cohesion",
    slug: "solidarites-cohesion",
    name: "Ministère des Solidarités et de la Cohésion sociale",
    description:
      "Le ministère des Solidarités et de la Cohésion sociale lutte contre la pauvreté, promeut l'inclusion et renforce la solidarité nationale. Il veille à la cohésion de la société et à l'accès aux droits de chacun.",
    longDescription:
      "Le ministère des Solidarités et de la Cohésion sociale est le garant de la cohésion sociale de la République d'Astoria. Il lutte contre la pauvreté et l'exclusion, promeut l'inclusion de toutes les personnes et veille au bon fonctionnement des dispositifs de solidarité nationale — allocation du logement, minima sociaux, aide alimentaire. Le ministère accompagne les publics les plus vulnérables et renforce le lien social sur l'ensemble du territoire.",
    responsibilities: [
      "Solidarité",
      "Lutte contre la pauvreté",
      "Inclusion",
    ],
    missions: [
      {
        title: "Lutte contre la pauvreté",
        text: "Mise en œuvre des stratégies nationales de lutte contre la pauvreté et coordination des acteurs de la solidarité.",
      },
      {
        title: "Inclusion des publics vulnérables",
        text: "Accompagnement des personnes en situation de handicap, des personnes âgées et des publics isolés.",
      },
      {
        title: "Cohésion sociale",
        text: "Promotion du lien social, soutien à l'engagement associatif et lutte contre les discriminations.",
      },
    ],
    attachedAdministrations: [
      { name: "Direction de la cohésion sociale" },
      { name: "Caisse nationale des allocations familiales" },
    ],
    policyDomains: [
      "Solidarité",
      "Inclusion sociale",
      "Aide sociale",
      "Politique de la ville",
    ],
    officialWebsite: "solidarites-sante.gouv.aor",
    status: "active",
  },
  {
    id: "sante",
    slug: "sante",
    name: "Ministère de la Santé",
    description:
      "Le ministère de la Santé organise et pilote la santé publique, le système de soins et la prévention. Il veille à la santé de la population et à la qualité du dispositif de soins.",
    longDescription:
      "Le ministère de la Santé est chargé de la politique de santé publique de la République d'Astoria. Il pilote l'organisation du système de soins, la prévention sanitaire et la lutte contre les épidémies. Le ministère veille à l'accès aux soins pour tous, à la qualité des établissements de santé et à la formation des professionnels médicaux et paramédicaux.",
    responsibilities: [
      "Santé publique",
      "Système de soins",
      "Prévention",
    ],
    missions: [
      {
        title: "Santé publique",
        text: "Politique de prévention, lutte contre les maladies et coordination de la réponse sanitaire face aux crises.",
      },
      {
        title: "Organisation des soins",
        text: "Pilotage du système hospitalier, régulation des dépenses de santé et amélioration de l'accès aux soins.",
      },
      {
        title: "Prévention",
        text: "Programmes de prévention, dépistage et promotion de la santé pour l'ensemble de la population.",
      },
    ],
    attachedAdministrations: [
      { name: "Direction générale de la santé" },
      { name: "Agence nationale de sécurité sanitaire" },
    ],
    policyDomains: [
      "Santé publique",
      "Organisation des soins",
      "Prévention",
      "Politique du médicament",
    ],
    officialWebsite: "sante.gouv.aor",
    status: "active",
  },
  {
    id: "education-nationale",
    slug: "education-nationale",
    name: "Ministère de l'Éducation nationale",
    description:
      "Le ministère de l'Éducation nationale organise et administre les écoles, l'enseignement primaire et secondaire. Il garantit l'accès à l'éducation pour tous les enfants et jeunes de la République.",
    longDescription:
      "Le ministère de l'Éducation nationale est chargé de l'organisation, du fonctionnement et du pilotage de l'école de la République. Il couvre l'enseignement primaire et secondaire, du cycle des apprentissages fondamentaux à la préparation du baccalauréat. Le ministère veille à l'égalité des chances, à la qualité de l'enseignement et à l'adaptation des programmes aux évolutions de la société.",
    responsibilities: [
      "Écoles",
      "Enseignement primaire",
      "Enseignement secondaire",
    ],
    missions: [
      {
        title: "Enseignement primaire",
        text: "Organisation de l'école élémentaire, enseignement des savoirs fondamentaux — lecture, écriture, calcul — et accompagnement des premiers apprentissages.",
      },
      {
        title: "Enseignement secondaire",
        text: "Fonctionnement des collèges et lycées, préparation aux examens nationaux et orientation scolaire.",
      },
      {
        title: "Égalité des chances",
        text: "Lutte contre le décrochage scolaire, soutien aux élèves en difficulté et promotion de l'inclusion scolaire.",
      },
    ],
    attachedAdministrations: [
      { name: "Direction générale de l'enseignement scolaire" },
      { name: "Direction de l'évaluation, de la prospective et de la performance" },
    ],
    policyDomains: [
      "Enseignement scolaire",
      "Programmes éducatifs",
      "Égalité des chances",
      "Vie scolaire",
    ],
    officialWebsite: "education.gouv.aor",
    status: "active",
  },
  {
    id: "enseignement-superieur-recherche",
    slug: "enseignement-superieur-recherche",
    name: "Ministère de l'Enseignement supérieur et de la Recherche",
    description:
      "Le ministère de l'Enseignement supérieur et de la Recherche pilote les universités, la recherche scientifique et l'innovation. Il développe la connaissance et la compétitivité scientifique de la République.",
    longDescription:
      "Le ministère de l'Enseignement supérieur et de la Recherche pilote l'enseignement supérieur universitaire et non universitaire, la recherche scientifique et l'innovation. Il accompagne les établissements d'enseignement supérieur, soutient la recherche fondamentale et appliquée, et développe les partenariats entre le monde académique et le monde économique. Le ministère veille à l'attractivité de la formation supérieure astorienne et à la diffusion de la connaissance.",
    responsibilities: [
      "Universités",
      "Recherche",
      "Innovation scientifique",
    ],
    missions: [
      {
        title: "Enseignement supérieur",
        text: "Pilotage des universités et des grandes écoles, accès à l'enseignement supérieur et réussite étudiante.",
      },
      {
        title: "Recherche scientifique",
        text: "Soutien à la recherche fondamentale et aux projets de recherche d'excellence dans les disciplines scientifiques.",
      },
      {
        title: "Innovation",
        text: "Transfert technologique, incubation et accompagnement des projets innovants issus de la recherche.",
      },
    ],
    attachedAdministrations: [
      { name: "Direction générale de l'enseignement supérieur et de l'insertion professionnelle" },
      { name: "Direction générale de la recherche et de l'innovation" },
    ],
    policyDomains: [
      "Enseignement supérieur",
      "Recherche",
      "Innovation",
      "Attractivité internationale",
    ],
    officialWebsite: "enseignement-superieur.gouv.aor",
    status: "active",
  },
  {
    id: "transition-ecologique",
    slug: "transition-ecologique",
    name: "Ministère de la Transition écologique et du Climat",
    description:
      "Le ministère de la Transition écologique et du Climat conduit la politique environnementale, la lutte contre le dérèglement climatique et la préservation de la biodiversité. Il pilote la transition écologique de la République.",
    longDescription:
      "Le ministère de la Transition écologique et du Climat conduit la politique environnementale de la République d'Astoria. Il pilote la lutte contre le dérèglement climatique, la préservation de la biodiversité et la transition vers un modèle de développement durable. Le ministère élabore les stratégies nationales d'adaptation et d'atténuation du changement climatique, et coordonne l'action des différents acteurs de la transition écologique.",
    responsibilities: [
      "Climat",
      "Environnement",
      "Biodiversité",
      "Transition écologique",
    ],
    missions: [
      {
        title: "Lutte contre le changement climatique",
        text: "Élaboration et mise en œuvre de la stratégie nationale bas-carbone, réduction des émissions de gaz à effet de serre.",
      },
      {
        title: "Préservation de la biodiversité",
        text: "Protection des espèces et des habitats naturels, gestion des aires protégées et restauration des écosystèmes.",
      },
      {
        title: "Transition énergétique",
        text: "Accompagnement de la transition vers les énergies renouvelables et amélioration de la performance énergétique des bâtiments.",
      },
    ],
    attachedAdministrations: [
      { name: "Direction générale de l'énergie et du climat" },
      { name: "Direction générale de la prévention des risques" },
      { name: "Office national des forêts" },
    ],
    policyDomains: [
      "Climat",
      "Environnement",
      "Biodiversité",
      "Énergie renouvelable",
    ],
    officialWebsite: "ecologie.gouv.aor",
    status: "active",
  },
  {
    id: "energie",
    slug: "energie",
    name: "Ministère de l'Énergie",
    description:
      "Le ministère de l'Énergie est chargé de la production, de la distribution et de la transition énergétique. Il veille à la souveraineté énergétique de la République et à l'accès à une énergie sûre et durable.",
    longDescription:
      "Le ministère de l'Énergie est chargé de garantir la sécurité énergétique de la République d'Astoria, de piloter la production et la distribution d'énergie, et d'accompagner la transition énergétique. Il veille à la souveraineté énergétique, soutient le développement des énergies propres et régule le marché de l'énergie pour assurer un accès stable et abordable pour tous les citoyens.",
    responsibilities: [
      "Production énergétique",
      "Distribution",
      "Transition énergétique",
      "Souveraineté énergétique",
    ],
    missions: [
      {
        title: "Souveraineté énergétique",
        text: "Garantie de l'indépendance énergétique de la République, diversification des sources d'approvisionnement et stockage stratégique.",
      },
      {
        title: "Production d'énergie",
        text: "Pilotage du mix énergétique national, développement des énergies renouvelables et maintenance des infrastructures de production.",
      },
      {
        title: "Régulation du marché",
        text: "Supervision du marché de l'énergie, protection des consommateurs et veille à la stabilité des prix.",
      },
    ],
    attachedAdministrations: [
      { name: "Direction générale de l'énergie et du climat" },
      { name: "Autorité de régulation de l'énergie" },
    ],
    policyDomains: [
      "Énergie",
      "Transition énergétique",
      "Sécurité d'approvisionnement",
      "Régulation",
    ],
    officialWebsite: "energie.gouv.aor",
    status: "active",
  },
  {
    id: "agriculture",
    slug: "agriculture",
    name: "Ministère de l'Agriculture et de la Souveraineté alimentaire",
    description:
      "Le ministère de l'Agriculture et de la Souveraineté alimentaire soutient l'agriculture, l'élevage et le monde rural. Il garantit la sécurité alimentaire et développe les filières agricoles de la République.",
    longDescription:
      "Le ministère de l'Agriculture et de la Souveraineté alimentaire accompagne l'ensemble des filières agricoles et agroalimentaires de la République d'Astoria. Il veille à la souveraineté alimentaire, soutient les agriculteurs et les éleveurs, et développe le tissu économique rural. Le ministère pilote la politique agricole commune et promeut une agriculture durable, respectueuse de l'environnement et de la santé publique.",
    responsibilities: [
      "Agriculture",
      "Élevage",
      "Alimentation",
      "Monde rural",
    ],
    missions: [
      {
        title: "Souveraineté alimentaire",
        text: "Garantie de l'autonomie alimentaire de la République, soutien aux filières agricoles et régulation des marchés.",
      },
      {
        title: "Agriculture durable",
        text: "Promotion de l'agro-écologie, réduction des intrants chimiques et préservation de la ressource en eau.",
      },
      {
        title: "Monde rural",
        text: "Aménagement du territoire rural, accompagnement des collectivités rurales et dynamisation des activities agricoles.",
      },
    ],
    attachedAdministrations: [
      { name: "Direction générale de l'alimentation" },
      { name: "Direction générale de la performance économique et environnementale des entreprises" },
    ],
    policyDomains: [
      "Agriculture",
      "Alimentation",
      "Souveraineté alimentaire",
      "Développement rural",
    ],
    officialWebsite: "agriculture.gouv.aor",
    status: "active",
  },
  {
    id: "transports",
    slug: "transports",
    name: "Ministère des Transports et des Mobilités",
    description:
      "Le ministère des Transports et des Mobilités organise et développe les infrastructures de transport : routes, réseau ferroviaire, aviation et mobilités. Il améliore l'accessibilité du territoire.",
    longDescription:
      "Le ministère des Transports et des Mobilités est chargé de l'organisation, du développement et de la régulation des infrastructures et services de transport de la République d'Astoria. Il pilote les réseaux routiers, ferroviaires, aéroportuaires et maritimes, et développe les solutions de mobilité durable pour les citoyens. Le ministère veille à l'accessibilité du territoire et à la sécurité de tous les usagers.",
    responsibilities: [
      "Routes",
      "Ferroviaire",
      "Aviation",
      "Mobilité",
    ],
    missions: [
      {
        title: "Infrastructures de transport",
        text: "Entretien et développement du réseau routier national, des voies ferrées et des aéroports.",
      },
      {
        title: "Mobilité durable",
        text: "Développement des transports en commun, du covoiturage et des solutions de mobilité douce.",
      },
      {
        title: "Sécurité des transports",
        text: "Régulation de la sécurité routière, ferroviaire et aérienne, et contrôle des normes d'exploitation.",
      },
    ],
    attachedAdministrations: [
      { name: "Direction générale des infrastructures, des transports et de la mer" },
      { name: "Sécurité et autonomie des transports" },
    ],
    policyDomains: [
      "Transport",
      "Mobilité",
      "Infrastructures",
      "Sécurité routière",
    ],
    officialWebsite: "transports.gouv.aor",
    status: "active",
  },
  {
    id: "logement",
    slug: "logement",
    name: "Ministère du Logement et de l'Aménagement du territoire",
    description:
      "Le ministère du Logement et de l'Aménagement du territoire pilote la politique du logement, l'urbanisme et l'aménagement du territoire. Il veille à l'accès au logement pour tous et à un développement territorial équilibré.",
    longDescription:
      "Le ministère du Logement et de l'Aménagement du territoire pilote la politique du logement et de l'urbanisme de la République d'Astoria. Il veille à l'accès au logement pour tous, lutte contre l'habitat indigne et accompagne la rénovation énergétique des bâtiments. Le ministère développe également la politique d'aménagement du territoire pour assurer un développement équilibré entre les zones urbaines et rurales.",
    responsibilities: [
      "Habitat",
      "Urbanisme",
      "Aménagement du territoire",
    ],
    missions: [
      {
        title: "Accès au logement",
        text: "Programmes de construction de logements sociaux, aides au logement et lutte contre la vacance et l'habitat indigne.",
      },
      {
        title: "Urbanisme",
        text: "Cadre réglementaire de l'urbanisme, planification locale et contrôle du respect des documents d'urbanisme.",
      },
      {
        title: "Aménagement du territoire",
        text: "Politique d'aménagement équilibré du territoire, développement des centralités et revitalisation des centres-bourgs.",
      },
    ],
    attachedAdministrations: [
      { name: "Direction de l'habitat, de l'urbanisme et des paysages" },
      { name: "Agence nationale de l'habitat" },
    ],
    policyDomains: [
      "Logement",
      "Urbanisme",
      "Aménagement",
      "Rénovation énergétique",
    ],
    officialWebsite: "logement.gouv.aor",
    status: "active",
  },
  {
    id: "culture",
    slug: "culture",
    name: "Ministère de la Culture et du Patrimoine",
    description:
      "Le ministère de la Culture et du Patrimoine promeut la culture, la préservation du patrimoine, les arts et les médias culturels. Il favorise l'accès de tous à la vie culturelle.",
    longDescription:
      "Le ministère de la Culture et du Patrimoine promeut la vie culturelle et la création artistique de la République d'Astoria. Il préserve et valorise le patrimoine culturel — matériel et immatériel — soutient les institutions culturelles et favorise l'accès de tous à la culture. Le ministère accompagne les artistes, les établissements culturels et le secteur des médias culturels.",
    responsibilities: [
      "Culture",
      "Patrimoine",
      "Arts",
      "Médias culturels",
    ],
    missions: [
      {
        title: "Création artistique",
        text: "Soutien à la création contemporaine, aux artistes et aux lieux d'art et de culture sur l'ensemble du territoire.",
      },
      {
        title: "Patrimoine",
        text: "Protection, conservation et valorisation du patrimoine culturel — monuments, musées, collections — et du patrimoine immatériel.",
      },
      {
        title: "Accès à la culture",
        text: "Démocratisation culturelle, diffusion artistique dans les territoires et éducation artistique.",
      },
    ],
    attachedAdministrations: [
      { name: "Direction générale des patrimoines et de l'architecture" },
      { name: "Direction générale de la création artistique" },
    ],
    policyDomains: [
      "Culture",
      "Patrimoine",
      "Arts",
      "Médias",
    ],
    officialWebsite: "culture.gouv.aor",
    status: "active",
  },
  {
    id: "sports",
    slug: "sports",
    name: "Ministère des Sports, de la Jeunesse et de la Vie associative",
    description:
      "Le ministère des Sports, de la Jeunesse et de la Vie associative développe la politique sportive, accompagne la jeunesse et soutient les associations. Il promeut la pratique sportive et l'engagement citoyen.",
    longDescription:
      "Le ministère des Sports, de la Jeunesse et de la Vie associative promeut la pratique sportive, accompagne la jeunesse et soutient l'engagement associatif de la République d'Astoria. Il développe les politiques sportives, prépare l'accueil de manifestations sportives internationales et favorise l'accès au sport pour tous, quelle que soit l'âge ou la condition. Le ministère soutient également les associations, moteurs essentiels de la vie civique.",
    responsibilities: [
      "Sport",
      "Jeunesse",
      "Associations",
    ],
    missions: [
      {
        title: "Politique sportive",
        text: "Développement de la pratique sportive, soutien aux fédérations et préparation des événements sportifs internationaux.",
      },
      {
        title: "Jeunesse",
        text: "Accompagnement de la jeunesse, politiques de prévention et promotion de l'engagement citoyen.",
      },
      {
        title: "Vie associative",
        text: "Soutien au tissu associatif, simplification administrative et promotion de l'économie sociale et solidaire.",
      },
    ],
    attachedAdministrations: [
      { name: "Direction de la jeunesse, de l'éducation populaire et de la vie associative" },
      { name: "Agence nationale du sport" },
    ],
    policyDomains: [
      "Sport",
      "Jeunesse",
      "Associations",
      "Éducation populaire",
    ],
    officialWebsite: "sports.gouv.aor",
    status: "active",
  },
  {
    id: "numerique",
    slug: "numerique",
    name: "Ministère du Numérique et des Communications",
    description:
      "Le ministère du Numérique et des Communications pilote la politique numérique, les télécommunications et les infrastructures numériques. Il poursuit la transformation numérique de l'État et la souveraineté numérique de la République.",
    longDescription:
      "Le ministère du Numérique et des Communications pilote la transformation numérique de l'État et de la société de la République d'Astoria. Il développe les infrastructures numériques, veille à la souveraineté numérique et accompagne l'ensemble des acteurs — citoyens, entreprises, administrations — dans la transition numérique. Le ministère régule également le secteur des télécommunications et veille à l'inclusion numérique sur l'ensemble du territoire.",
    responsibilities: [
      "Numérique",
      "Télécommunications",
      "Infrastructures numériques",
    ],
    missions: [
      {
        title: "Transformation numérique de l'État",
        text: "Modernisation des services publics en ligne, interopérabilité des systèmes d'information et dématérialisation des démarches.",
      },
      {
        title: "Souveraineté numérique",
        text: "Protection des données, cybersécurité et développement des technologies numériques stratégiques.",
      },
      {
        title: "Inclusion numérique",
        text: "Réduction de la fracture numérique, formation aux compétences numériques et accès au haut débit pour tous.",
      },
    ],
    attachedAdministrations: [
      { name: "Direction interministérielle du numérique" },
      { name: "Agence nationale de la sécurité des systèmes d'information" },
    ],
    policyDomains: [
      "Numérique",
      "Cybersécurité",
      "Télécommunications",
      "Données publiques",
    ],
    officialWebsite: "numerique.gouv.aor",
    status: "active",
  },
  {
    id: "fonction-publique",
    slug: "fonction-publique",
    name: "Ministère de la Fonction publique et de la Réforme de l'État",
    description:
      "Le ministère de la Fonction publique et de la Réforme de l'État modernise l'administration publique et améliore la qualité du service rendu aux citoyens. Il pilote la réforme de l'État et la gestion des ressources humaines de la fonction publique.",
    longDescription:
      "Le ministère de la Fonction publique et de la Réforme de l'État pilote la modernisation de l'administration publique de la République d'Astoria. Il améliore la qualité du service rendu aux citoyens, simplifie les procédures administratives et accompagne la transformation des métiers de la fonction publique. Le ministère veille à l'attractivité de la carrière publique et au bon fonctionnement des services de l'État.",
    responsibilities: [
      "Fonction publique",
      "Administration",
      "Modernisation",
    ],
    missions: [
      {
        title: "Modernisation de l'État",
        text: "Simplification administrative, transformation numérique des services et rationalisation des organisations.",
      },
      {
        title: "Gestion des ressources humaines",
        text: "Politique de rémunération, de formation et de mobilité des agents publics de l'État.",
      },
      {
        title: "Qualité du service public",
        text: "Évaluation des performances, satisfaction des usagers et amélioration continue des services publics.",
      },
    ],
    attachedAdministrations: [
      { name: "Direction générale de l'administration et de la fonction publique" },
    ],
    policyDomains: [
      "Fonction publique",
      "Réforme de l'État",
      "Simplification administrative",
      "Gestion publique",
    ],
    officialWebsite: "fonction-publique.gouv.aor",
    status: "active",
  },
  {
    id: "territoires",
    slug: "territoires",
    name: "Ministère des Territoires et des Collectivités",
    description:
      "Le ministère des Territoires et des Collectivités accompagne les collectivités territoriales, la décentralisation et le développement rural. Il veille à l'équité territoriale et au dynamisme des territoires.",
    longDescription:
      "Le ministère des Territoires et des Collectivités accompagne les collectivités territoriales — communes, départements, régions — dans l'exercice de leurs compétences et veille au bon fonctionnement de la décentralisation. Il développe la politique d'aménagement du territoire, soutient les territoires ruraux et assure l'équité territoriale entre les différentes parties de la République d'Astoria.",
    responsibilities: [
      "Collectivités territoriales",
      "Décentralisation",
      "Ruralité",
    ],
    missions: [
      {
        title: "Décentralisation",
        text: "Accompagnement des collectivités territoriales dans l'exercice de leurs compétences et respect du principe de libre administration.",
      },
      {
        title: "Équité territoriale",
        text: "Lutte contre les inégalités territoriales, péréquation financière et développement des territoires fragiles.",
      },
      {
        title: "Dynamisme des territoires",
        text: "Soutien à l'investissement local, revitalisation des centres-bourgs et attractivité des territoires ruraux.",
      },
    ],
    attachedAdministrations: [
      { name: "Direction générale des collectivités locales" },
    ],
    policyDomains: [
      "Collectivités territoriales",
      "Décentralisation",
      "Aménagement du territoire",
      "Ruralité",
    ],
    officialWebsite: "territoires.gouv.aor",
    status: "active",
  },
  {
    id: "mer",
    slug: "mer",
    name: "Ministère de la Mer et des Affaires maritimes",
    description:
      "Le ministère de la Mer et des Affaires maritimes défend les intérêts de la République en mer, pilote la marine civile et la pêche. Il veille à la protection du littoral et au développement des activités maritimes.",
    longDescription:
      "Le ministère de la Mer et des Affaires maritimes défend les intérêts de la République d'Astoria dans les espaces maritimes et côtiers. Il pilote la marine civile, la pêche maritime et la protection du littoral. Le ministère veille au développement durable des activités maritimes, à la sécurité en mer et à la préservation du milieu marin.",
    responsibilities: [
      "Littoral",
      "Marine civile",
      "Pêche",
      "Affaires maritimes",
    ],
    missions: [
      {
        title: "Protection du littoral",
        text: "Préservation du littoral face à l'érosion, gestion du trait de côte et aménagement côtier durable.",
      },
      {
        title: "Sécurité maritime",
        text: "Sauvetage en mer, surveillance des espaces maritimes et régulation de la pêche.",
      },
      {
        title: "Économie maritime",
        text: "Développement des filières maritimes — pêche, aquaculture, tourisme côtier — et soutien aux professionnels.",
      },
    ],
    attachedAdministrations: [
      { name: "Direction des affaires maritimes" },
      { name: "Institut de recherche pour le développement" },
    ],
    policyDomains: [
      "Affaires maritimes",
      "Pêche",
      "Littoral",
      "Économie bleue",
    ],
    officialWebsite: "mer.gouv.aor",
    status: "active",
  },
];

/**
 * Resolves the current holder of each ministry. A ministry has a current
 * holder when there is an active (no endDate) office of type "minister"
 * attached to it. Returns one entry per ministry, with `holder` set to
 * `undefined` when no minister is currently appointed — the ministry
 * remains fully displayed regardless.
 */
/**
 * Resolves a single ministry by its URL slug. Returns `undefined` when no
 * ministry matches — the detail page must call `notFound()` in that case.
 */
export function findMinistryBySlug(slug: string): Ministry | undefined {
  return ministries.find((m) => m.slug === slug);
}

export function getMinistriesWithHolders(): ReadonlyArray<MinistryWithHolder> {
  return ministries.map((ministry) => {
    const office = governmentOffices.find(
      (o) => o.ministryId === ministry.id && o.type === "minister"
    );
    if (!office) {
      return { ministry };
    }
    const activeHolder = officeHolders.find(
      (h) => h.officeId === office.id && h.endDate === undefined
    );
    if (!activeHolder) {
      return { ministry };
    }
    const person = persons.find((p) => p.id === activeHolder.personId);
    if (!person) {
      return { ministry };
    }
    return {
      ministry,
      holder: { person, office, officeHolder: activeHolder },
    };
  });
}

/**
 * Government posts currently defined. Today only the presidency is
 * officially established: replacing the president later means adding an
 * `endDate` to the current holder and a new `OfficeHolder` — never touching
 * the office itself or the pages.
 */
export const governmentOffices: ReadonlyArray<GovernmentOffice> = [
  {
    id: "president-of-the-republic",
    titleKey: "president",
    type: "president",
  },
];

/**
 * The people appearing on the pages. The current President of the Republic
 * is the only person officially published so far, with his official
 * portrait (`apps/public/liamvonastoria.jpeg`).
 */
export const persons: ReadonlyArray<Person> = [
  {
    id: "liam-von-astoria",
    slug: "liamvonastoria",
    firstName: "Liam",
    lastName: "Von Astoria",
    photo: "/liamvonastoria.jpeg",
  },
];

/**
 * Current and past holders of each post (temporal data: a post can be held
 * successively by several people, the previous holder is never overwritten).
 * The start date of the current presidential mandate is not published yet,
 * so it is omitted rather than invented.
 */
export const officeHolders: ReadonlyArray<OfficeHolder> = [
  {
    officeId: "president-of-the-republic",
    personId: "liam-von-astoria",
  },
];

/** « Comprendre » rows — message keys under `ministere.understand.items`. */
export const understandItems: ReadonlyArray<{ key: string }> = [
  { key: "institution" },
  { key: "minister" },
  { key: "administrations" },
];

/** « Pour aller plus loin » — natural outbound links (published pages). */
export const relatedItems: ReadonlyArray<{ key: string; href: string }> = [
  { key: "government", href: ministryPaths.hub },
  { key: "composition", href: ministryPaths.composition },
  { key: "organisation", href: ministryPaths.organisation },
];