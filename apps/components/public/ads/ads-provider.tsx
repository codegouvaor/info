"use client";

import {
  DsfrProviderBase,
  StartDsfrOnHydration,
  type DsfrProviderProps,
} from "@codegouvaor/react-ads/next-app-router";
import { Link } from "@/i18n/navigation";
import { registerAdsTranslations } from "./ads-translations";

/**
 * Wires the Astoria Design System runtime to the portal:
 *  - registers the next-intl Link as the link renderer used by every ADS
 *    component (so all ADS internal links stay localized),
 *  - announces the active locale to ADS (internal aria strings, etc.),
 *  - starts the ADS core behaviours on hydration (modals, collapses, menus…),
 *  - applies the system color scheme (light/dark) to ADS components.
 *
 * This component must wrap every ADS component rendered on the page.
 */
registerAdsTranslations();

export function AdsProvider({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: DsfrProviderProps["lang"];
}) {
  return (
    <DsfrProviderBase lang={lang} Link={Link} defaultColorScheme="system">
      {children}
      <StartDsfrOnHydration />
    </DsfrProviderBase>
  );
}
