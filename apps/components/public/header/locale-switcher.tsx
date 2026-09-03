"use client";

import { Suspense, useCallback } from "react";
import { LanguageSelect } from "@codegouvaor/react-ads/LanguageSelect";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { localeDisplayNames } from "@/i18n/locales";

/**
 * Language switcher shown in the Government Header quick-access area.
 *
 * It reuses the ADS `LanguageSelect` component (visual + behaviour source of
 * truth) and plugs the next-intl router into it so that switching language:
 *  - keeps the current page,
 *  - keeps the current URL query parameters,
 *  - uses the i18n routing (the locale prefix is managed by next-intl).
 *
 * The list of languages comes from the centralized `routing` configuration,
 * never from hard-coded JSX.
 */

function LocaleSwitcherContent() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setLang = useCallback(
    (nextLang: string) => {
      const nextLocale = routing.locales.includes(nextLang as Locale)
        ? (nextLang as Locale)
        : routing.defaultLocale;

      if (nextLocale === locale) {
        return;
      }

      const query = searchParams.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        locale: nextLocale,
      });
    },
    [locale, pathname, router, searchParams]
  );

  return (
    <LanguageSelect
      supportedLangs={routing.locales}
      fullNameByLang={localeDisplayNames}
      lang={locale as Locale}
      setLang={setLang}
    />
  );
}

export function LocaleSwitcher() {
  // `useSearchParams` suspends during static rendering: the boundary lets the
  // header be prerendered while the interactive switcher hydrates client-side.
  return (
    <Suspense
      fallback={
        <LanguageSelect
          supportedLangs={routing.locales}
          fullNameByLang={localeDisplayNames}
          lang={routing.defaultLocale}
          setLang={() => undefined}
        />
      }
    >
      <LocaleSwitcherContent />
    </Suspense>
  );
}
