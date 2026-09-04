import type { FrIconClassName } from "@codegouvaor/react-ads/fr";
import { legalPaths, pressPath, sectionPaths } from "./site-structure";

/**
 * Content structure of the home page — institutional architecture.
 *
 * The homepage answers: "What are the main entry points of the digital
 * Republic of Astoria?" It presents the great doors of the portal without
 * trying to reproduce the entire site tree.
 *
 * Structure:
 *   01 — Hero + Search
 *   02 — Quick access
 *   03 — News (actualités)
 *   04 — Public action (l'action publique)
 *   05 — Public services (services publics)
 *   06 — The Government (le Gouvernement)
 *   07 — The Republic (la République)
 *   08 — Useful information (informations utiles)
 */

/** A home page destination: message key + locale-agnostic href + ADS icon. */
export type HomeLinkItem = {
  /** Message key prefix under `home.<section>.items.<key>` (title/desc). */
  key: string;
  /** Locale-agnostic href, localized by the next-intl Link renderer. */
  href: string;
  /** ADS icon rendered by the tile/card pictogram. */
  iconId: FrIconClassName;
};

/** A home page popular search: message key + locale-agnostic href. */
export type HomePopularSearch = {
  key: string;
  href: string;
};

/* -------------------------------------------------------------------------- *
 * 01 — Hero: popular searches pointing to real portal content.              *
 * -------------------------------------------------------------------------- */

export const heroPopularSearches: ReadonlyArray<HomePopularSearch> = [
  { key: "gouvernement", href: "/government" },
  { key: "republique", href: "/republique" },
  { key: "services", href: "/services" },
  { key: "actualites", href: "/news" },
  { key: "constitution", href: "/republique/constitution" },
];

/* -------------------------------------------------------------------------- *
 * 02 — Quick access: the four main portals + secondary entries.             *
 * -------------------------------------------------------------------------- */

export const quickAccessPrimaryItems: ReadonlyArray<HomeLinkItem> = [
  { key: "gouvernement", href: "/government", iconId: "fr-icon-government-line" },
  { key: "services", href: "/services", iconId: "fr-icon-search-line" },
  { key: "actualites", href: "/news", iconId: "fr-icon-newspaper-line" },
  { key: "republique", href: "/republique", iconId: "fr-icon-building-line" },
];

export const quickAccessSecondaryItems: ReadonlyArray<HomeLinkItem> = [
  { key: "constitution", href: "/republique/constitution", iconId: "fr-icon-book-2-line" },
  { key: "ministeres", href: "/government/ministere", iconId: "fr-icon-archive-line" },
  { key: "territoires", href: "/republique/territoires", iconId: "fr-icon-map-pin-2-line" },
  { key: "administrations", href: "/republique/administrations", iconId: "fr-icon-community-line" },
  { key: "presse", href: pressPath, iconId: "fr-icon-megaphone-line" },
];

/* -------------------------------------------------------------------------- *
 * 03 — News: editorial feed, addressable by stable keys.                   *
 * -------------------------------------------------------------------------- */

export type HomeArticle = {
  key: string;
  href: string;
};

export const featuredArticle: HomeArticle = {
  key: "featured",
  href: "/news",
};

export const secondaryArticles: ReadonlyArray<HomeArticle> = [
  { key: "second1", href: "/news" },
  { key: "second2", href: "/news" },
  { key: "second3", href: "/news" },
];

/* -------------------------------------------------------------------------- *
 * 04 — Public action: the major public policy areas.                       *
 * -------------------------------------------------------------------------- */

export const policyItems: ReadonlyArray<HomeLinkItem> = [
  { key: "economie", href: "/politiques-publiques/economie", iconId: "fr-icon-money-euro-circle-line" },
  { key: "education", href: "/politiques-publiques/education", iconId: "fr-icon-school-line" },
  { key: "sante", href: "/politiques-publiques/sante", iconId: "fr-icon-stethoscope-line" },
  { key: "securite", href: "/politiques-publiques/securite", iconId: "fr-icon-shield-line" },
  { key: "environnement", href: "/politiques-publiques/environnement", iconId: "fr-icon-leaf-line" },
  { key: "numerique", href: "/politiques-publiques/numerique", iconId: "fr-icon-cpu-line" },
];

/* -------------------------------------------------------------------------- *
 * 05 — Public services: orientation toward service-public.gouv.aor.        *
 * -------------------------------------------------------------------------- */

export const serviceCategories: ReadonlyArray<HomeLinkItem> = [
  { key: "identite", href: "/services/demarches/identite", iconId: "fr-icon-passport-line" },
  { key: "fiscalite", href: "/services/demarches/fiscalite", iconId: "fr-icon-money-euro-circle-line" },
  { key: "logement", href: "/services/demarches/logement", iconId: "fr-icon-home-4-line" },
  { key: "transport", href: "/services/demarches/transport", iconId: "fr-icon-car-line" },
  { key: "education", href: "/services/demarches/education", iconId: "fr-icon-book-2-line" },
  { key: "sante", href: "/services/demarches/sante", iconId: "fr-icon-heart-line" },
];

/* -------------------------------------------------------------------------- *
 * 06 — The Government: links to the institutional pages.                   *
 * -------------------------------------------------------------------------- */

export const governmentItems: ReadonlyArray<HomeLinkItem> = [
  { key: "gouvernement", href: "/government", iconId: "fr-icon-government-line" },
  { key: "ministeres", href: "/government/ministere", iconId: "fr-icon-archive-line" },
  { key: "membres", href: "/government/membres", iconId: "fr-icon-team-line" },
  { key: "president", href: "/government/liamvonastoria", iconId: "fr-icon-user-star-line" },
];

/* -------------------------------------------------------------------------- *
 * 07 — The Republic: links to the institutional pages.                     *
 * -------------------------------------------------------------------------- */

export const republicItems: ReadonlyArray<HomeLinkItem> = [
  { key: "constitution", href: "/republique/constitution", iconId: "fr-icon-book-2-line" },
  { key: "organisation", href: "/republique/organisation", iconId: "fr-icon-layout-line" },
  { key: "administrations", href: "/republique/administrations", iconId: "fr-icon-community-line" },
  { key: "autorites", href: "/republique/autorites-publiques", iconId: "fr-icon-scales-3-line" },
  { key: "territoires", href: "/republique/territoires", iconId: "fr-icon-map-pin-2-line" },
];

/* -------------------------------------------------------------------------- *
 * 08 — Useful information: transversal resources.                          *
 * -------------------------------------------------------------------------- */

export const usefulLinks: ReadonlyArray<HomeLinkItem> = [
  { key: "presse", href: pressPath, iconId: "fr-icon-megaphone-line" },
  { key: "transparence", href: "/republique/transparence", iconId: "fr-icon-eye-line" },
  { key: "publications", href: "/publications-officielles", iconId: "fr-icon-file-text-line" },
  { key: "accessibilite", href: legalPaths.accessibility, iconId: "fr-icon-wheelchair-line" },
  { key: "participation", href: sectionPaths.participation, iconId: "fr-icon-chat-3-line" },
  { key: "prevention", href: sectionPaths.preventionDesRisques, iconId: "fr-icon-alert-line" },
  { key: "liensUtiles", href: sectionPaths.liensUtiles, iconId: "fr-icon-links-line" },
];

/* -------------------------------------------------------------------------- *
 * 09 — Social network: newsletter + social media.                          *
 * -------------------------------------------------------------------------- */

/** A social media link: message key + external URL + official SVG icon. */
export type SocialLink = {
  key: string;
  href: string;
  /** Inline SVG <path> d attribute for the brand icon. */
  svgPath: string;
  /** SVG viewBox width. */
  svgW: number;
  /** SVG viewBox height. */
  svgH: number;
};

export const socialLinks: ReadonlyArray<SocialLink> = [
  {
    key: "x",
    href: "https://x.com/info_gouv",
    svgPath: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    svgW: 24,
    svgH: 24,
  },
  {
    key: "facebook",
    href: "https://www.facebook.com/gouvernement",
    svgPath: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    svgW: 24,
    svgH: 24,
  },
  {
    key: "linkedin",
    href: "https://www.linkedin.com/company/gouvernement",
    svgPath: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    svgW: 24,
    svgH: 24,
  },
  {
    key: "instagram",
    href: "https://www.instagram.com/gouvernement",
    svgPath: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z",
    svgW: 24,
    svgH: 24,
  },
  {
    key: "threads",
    href: "https://www.threads.net/@gouvernement",
    svgPath: "M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z",
    svgW: 192,
    svgH: 192,
  },
  {
    key: "tiktok",
    href: "https://www.tiktok.com/@gouvernement",
    svgPath: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
    svgW: 24,
    svgH: 24,
  },
  {
    key: "whatsapp",
    href: "https://whatsapp.com/channel/0029Vabc",
    svgPath: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
    svgW: 24,
    svgH: 24,
  },
  {
    key: "youtube",
    href: "https://www.youtube.com/@gouvernement",
    svgPath: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    svgW: 24,
    svgH: 24,
  },
  {
    key: "github",
    href: "https://github.com/gouvernement",
    svgPath: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
    svgW: 24,
    svgH: 24,
  },
  {
    key: "rss",
    href: "/rss",
    svgPath: "M6.18 15.64a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36zM4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z",
    svgW: 24,
    svgH: 24,
  },
];
