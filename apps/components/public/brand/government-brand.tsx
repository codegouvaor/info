"use client";

import { useTranslations } from "next-intl";
import { AstoriaEmblem } from "./astoria-emblem";

/**
 * Institutional lockup of the Republic of Astoria, shared by the Government
 * Header and the Government Footer. The visual part (emblem + layout) lives
 * here; every word comes from the message catalogs so a new language never
 * requires touching a component.
 */
export function GovernmentBrand() {
  const t = useTranslations("brand");

  return (
    <>
      <AstoriaEmblem className="ast-brand__emblem" />
      <span className="ast-brand__name">{t("republicName")}</span>
    </>
  );
}
