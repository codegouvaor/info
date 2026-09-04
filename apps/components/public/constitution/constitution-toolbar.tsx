"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

/**
 * Actions bar of the constitutional reader (design §8): the main search
 * action, then the accessory actions of the document — view versions,
 * copy the official text, print, share.
 *
 * The copy/share helpers never receive the constitutional text as props:
 * they read the rendered document (plain server markup) at click time, so no
 * legal content is ever serialized into the client bundle.
 */

export type ConstitutionRevisionRow = {
  id: string;
  date: string;
  description: string;
};

async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    textarea.remove();
    return ok;
  } catch {
    return false;
  }
}

/** Assembled official text of the whole document, with per-article context. */
function buildFullText(): string {
  const title =
    document.querySelector<HTMLElement>(".gov-constitution-doc__title")
      ?.textContent?.trim() ?? "";

  const articles = Array.from(
    document.querySelectorAll<HTMLElement>(".gov-constitution-article"),
  );

  const parts: string[] = [];
  for (const article of articles) {
    const label =
      article.querySelector<HTMLElement>(".gov-constitution-article__number")
        ?.textContent?.trim() ?? "";
    const content =
      article.querySelector<HTMLElement>(".gov-constitution-article__content")
        ?.textContent?.trim() ?? "";
    parts.push([label, content].filter(Boolean).join("\n\n"));
  }

  return [title, ...parts].filter(Boolean).join("\n\n\n");
}

export function ConstitutionToolbar({
  versionLabel,
  revisions,
}: {
  /** Consolidation label of the current text, when published. */
  versionLabel?: string;
  /** Constitutional revisions (history of the text), if any. */
  revisions: ReadonlyArray<ConstitutionRevisionRow>;
}) {
  const t = useTranslations("constitution");
  const statusRef = React.useRef<HTMLSpanElement>(null);
  const feedbackTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [versionsOpen, setVersionsOpen] = React.useState(false);
  const [feedback, setFeedback] = React.useState<"copy" | "share" | null>(null);

  React.useEffect(() => {
    return () => {
      if (feedbackTimer.current) {
        clearTimeout(feedbackTimer.current);
      }
    };
  }, []);

  const announce = (message: string) => {
    const status = statusRef.current;
    if (!status) {
      return;
    }
    status.textContent = "";
    // Force a new announcement even when the same message repeats.
    window.setTimeout(() => {
      status.textContent = message;
    }, 0);
  };

  const flash = (kind: "copy" | "share", message: string) => {
    setFeedback(kind);
    announce(message);
    if (feedbackTimer.current) {
      clearTimeout(feedbackTimer.current);
    }
    feedbackTimer.current = setTimeout(() => {
      setFeedback(null);
    }, 2400);
  };

  const focusSearch = React.useCallback(() => {
    const zone = document.getElementById("constitution-search-zone");
    if (zone) {
      zone.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    const input =
      zone?.querySelector<HTMLInputElement>('input[type="search"]') ??
      document.querySelector<HTMLInputElement>(
        '.gov-constitution-search input[type="search"]',
      );
    window.setTimeout(() => {
      input?.focus({ preventScroll: true });
    }, 60);
  }, []);

  // The search action can be triggered with the "/" shortcut.
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      focusSearch();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [focusSearch]);

  // Close the versions panel with Escape.
  React.useEffect(() => {
    if (!versionsOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setVersionsOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [versionsOpen]);

  const handleCopyText = async () => {
    const ok = await copyTextToClipboard(buildFullText());
    if (ok) {
      flash("copy", t("toolbar.textCopied"));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const title =
      document.querySelector<HTMLElement>(".gov-constitution-doc__title")
        ?.textContent?.trim() ?? t("hero.title");
    const url = window.location.href;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // The user cancelled the native sheet — nothing to announce.
        return;
      }
    }

    const ok = await copyTextToClipboard(url);
    if (ok) {
      flash("share", t("articleNav.copied"));
    }
  };

  const versionsPanelId = "constitution-versions-panel";

  return (
    <div className="gov-constitution-toolbar">
      <div
        className="gov-constitution-toolbar__actions"
        role="group"
        aria-label={t("toolbar.ariaLabel")}
      >
        <button
          type="button"
          className="gov-constitution-toolbar__action gov-constitution-toolbar__action--primary"
          onClick={focusSearch}
        >
          <span aria-hidden="true" className="fr-icon-search-line" />
          <span>{t("search.title")}</span>
        </button>

        <button
          type="button"
          className="gov-constitution-toolbar__action"
          aria-expanded={versionsOpen}
          aria-controls={versionsOpen ? versionsPanelId : undefined}
          onClick={() => setVersionsOpen((open) => !open)}
        >
          <span aria-hidden="true" className="fr-icon-time-line" />
          <span>{t("toolbar.versions")}</span>
        </button>

        <button
          type="button"
          className="gov-constitution-toolbar__action"
          data-feedback={feedback === "copy" ? "true" : undefined}
          onClick={handleCopyText}
        >
          <span aria-hidden="true" className="fr-icon-clipboard-line" />
          <span className="gov-constitution-toolbar__label">
            {t("toolbar.copyText")}
          </span>
          <span className="gov-constitution-toolbar__label gov-constitution-toolbar__label--done">
            {t("toolbar.textCopied")}
          </span>
        </button>

        <button
          type="button"
          className="gov-constitution-toolbar__action"
          onClick={handlePrint}
        >
          <span aria-hidden="true" className="fr-icon-printer-line" />
          <span>{t("toolbar.print")}</span>
        </button>

        <button
          type="button"
          className="gov-constitution-toolbar__action"
          data-feedback={feedback === "share" ? "true" : undefined}
          onClick={handleShare}
        >
          <span aria-hidden="true" className="fr-icon-share-line" />
          <span>{t("toolbar.share")}</span>
        </button>
      </div>

      {versionsOpen && (
        <section
          id={versionsPanelId}
          className="gov-constitution-versions"
          aria-label={t("versions.title")}
        >
          <h2 className="gov-constitution-versions__title">
            {t("versions.title")}
          </h2>
          <p className="gov-constitution-versions__lead">{t("versions.lead")}</p>

          <ul className="gov-constitution-versions__list">
            <li className="gov-constitution-versions__row gov-constitution-versions__row--current">
              <p className="gov-constitution-versions__row-title">
                {t("versions.current")}
              </p>
              <p className="gov-constitution-versions__row-meta">
                <span className="gov-constitution-info__badge">
                  {t("info.statusCurrent")}
                </span>
                {versionLabel && (
                  <span className="gov-constitution-versions__version">
                    {versionLabel}
                  </span>
                )}
              </p>
            </li>
          </ul>

          {revisions.length > 0 ? (
            <ul className="gov-constitution-versions__list">
              {revisions.map((revision) => (
                <li key={revision.id} className="gov-constitution-versions__row">
                  <p className="gov-constitution-versions__row-title">
                    {revision.date}
                  </p>
                  <p className="gov-constitution-versions__row-text">
                    {revision.description}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="gov-constitution-versions__empty">
              <p className="gov-constitution-versions__empty-title">
                {t("versions.emptyTitle")}
              </p>
              <p className="gov-constitution-versions__empty-text">
                {t("versions.empty")}
              </p>
            </div>
          )}
        </section>
      )}

      <span
        ref={statusRef}
        role="status"
        aria-live="polite"
        className="gov-visually-hidden"
      />
    </div>
  );
}
