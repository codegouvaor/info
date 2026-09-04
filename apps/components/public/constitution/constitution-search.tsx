"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

/**
 * Live search over the Constitution.
 *
 * The corpus (article label, structural context, official text) is passed as
 * plain serializable data; filtering and snippet extraction happen entirely
 * client-side, so the reader page stays a server component. Every result
 * links to the stable anchor of its disposition (`#article-42`).
 */

export type ConstitutionSearchItem = {
  id: string;
  /** Chrome label of the article, e.g. "Article 42". */
  label: string;
  /** Structural context, e.g. "Titre IV · Chapitre II". */
  context: string;
  /** Official text of the article. */
  content: string;
};

/** Fold accents/diacritics so searches like "president" find "Président". */
function normalizeForSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildIndexMap(text: string): { norm: string; map: number[] } {
  const chars: string[] = [];
  const map: number[] = [];

  for (let i = 0; i < text.length; i += 1) {
    const base = text[i].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (base.length === 0) {
      continue;
    }
    for (const char of base) {
      chars.push(char.toLowerCase());
      map.push(i);
    }
  }

  return { norm: chars.join(""), map };
}

/**
 * Builds an excerpt of `content` centred on the first token hit, returning
 * the original slice plus the ranges (in original offsets) to highlight.
 */
function buildExcerpt(content: string, tokens: string[]) {
  const { norm, map } = buildIndexMap(content);
  const positions = tokens
    .map((token) => ({ token, at: norm.indexOf(token) }))
    .filter((found) => found.at >= 0)
    .sort((a, b) => a.at - b.at);

  let excerpt = content;
  let prefix = "";
  let suffix = "";

  if (positions.length > 0 && norm.length > 300) {
    const first = positions[0];
    const startNorm = Math.max(0, first.at - 90);
    const endNorm = Math.min(norm.length, first.at + first.token.length + 150);
    let start = map[startNorm];
    let end = map[endNorm - 1] + 1;

    // Do not cut a word in half when possible.
    if (start > 0) {
      const before = content.lastIndexOf(" ", start - 1);
      start = before === -1 || before < start - 30 ? start : before + 1;
    }
    if (end < content.length) {
      const after = content.indexOf(" ", end);
      if (after !== -1 && after - end < 30) {
        end = after + 1;
      }
    }

    prefix = start > 0 ? "… " : "";
    suffix = end < content.length ? " …" : "";
    excerpt = content.slice(start, end);
  }

  // Highlight occurrences inside the excerpt, mapped back to original text.
  const { norm: excerptNorm, map: excerptMap } = buildIndexMap(excerpt);
  const regex = new RegExp(
    tokens.map((token) => `(${escapeRegExp(token)})`).join("|"),
    "gi",
  );
  const flagged = new Array<boolean>(excerpt.length).fill(false);

  for (const match of excerptNorm.matchAll(regex)) {
    if (match.index === undefined) {
      continue;
    }
    const startNorm = match.index;
    const endNorm = startNorm + match[0].length;
    for (let i = startNorm; i < endNorm; i += 1) {
      flagged[excerptMap[i]] = true;
    }
  }

  const pieces: Array<{ text: string; mark: boolean }> = [];
  let current: { text: string; mark: boolean } | null = null;

  for (let i = 0; i < excerpt.length; i += 1) {
    if (!current || current.mark !== flagged[i]) {
      if (current) {
        pieces.push(current);
      }
      current = { text: excerpt[i], mark: flagged[i] };
    } else {
      current.text += excerpt[i];
    }
  }
  if (current) {
    pieces.push(current);
  }

  return { prefix, suffix, pieces };
}

function HighlightedExcerpt({
  content,
  tokens,
}: {
  content: string;
  tokens: string[];
}) {
  const { prefix, suffix, pieces } = buildExcerpt(content, tokens);

  return (
    <>
      {prefix}
      {pieces.map((piece, index) =>
        piece.mark ? <mark key={index}>{piece.text}</mark> : piece.text,
      )}
      {suffix}
    </>
  );
}

export function ConstitutionSearch({
  items,
}: {
  items: ReadonlyArray<ConstitutionSearchItem>;
}) {
  const t = useTranslations("constitution");
  const [query, setQuery] = React.useState("");

  const inputId = React.useId();
  const resultsId = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const trimmed = query.trim();
  const normalizedQuery = normalizeForSearch(trimmed);
  const tokens =
    normalizedQuery.length > 0
      ? normalizedQuery.split(/\s+/).filter(Boolean)
      : [];

  const results = React.useMemo(() => {
    if (tokens.length === 0) {
      return [] as Array<{ item: ConstitutionSearchItem; tokens: string[] }>;
    }

    const matches: Array<{ item: ConstitutionSearchItem; tokens: string[] }> =
      [];

    for (const item of items) {
      const haystack = normalizeForSearch(
        `${item.label} ${item.context} ${item.content}`,
      );
      const matchedTokens = tokens.filter((token) =>
        haystack.includes(token),
      );
      if (matchedTokens.length > 0) {
        matches.push({ item, tokens: matchedTokens });
      }
    }

    return matches;
  }, [items, tokens]);

  const visible = trimmed.length > 0;

  const goToFirstResult = () => {
    const first = results[0];
    if (!first) {
      return;
    }
    const target = document.getElementById(first.item.id);
    if (target) {
      window.history.replaceState(null, "", `#${first.item.id}`);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const clear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <form className="gov-constitution-search" onSubmit={(event) => {
      event.preventDefault();
      goToFirstResult();
    }}>
      <div className="fr-search-bar fr-search-bar--lg gov-constitution-search__bar">
        <label className="gov-visually-hidden" htmlFor={inputId}>
          {t("search.ariaLabel")}
        </label>
        <input
          ref={inputRef}
          id={inputId}
          className="fr-input"
          type="search"
          value={query}
          placeholder={t("search.placeholder")}
          autoComplete="off"
          aria-controls={resultsId}
          aria-expanded={visible}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              clear();
            }
          }}
        />
        <button type="submit" className="fr-btn">
          {t("search.buttonLabel")}
        </button>
      </div>

      {visible && (
        <div id={resultsId} className="gov-constitution-search__results">
          {trimmed.length > 0 && (
            <button
              type="button"
              className="gov-constitution-search__clear"
              onClick={clear}
            >
              {t("search.clearLabel")}
              <span aria-hidden="true" className="fr-icon-close-line" />
            </button>
          )}

          {results.length === 0 ? (
            <div className="gov-constitution-search__empty">
              <p role="status" aria-live="polite">
                {t("search.countLabel", { count: 0 })}
              </p>
              <p className="gov-constitution-search__empty-title">
                {t("search.noResultsTitle")}
              </p>
              <p className="gov-constitution-search__empty-text">
                {t("search.noResultsText", { query: trimmed })}
              </p>
            </div>
          ) : (
            <>
              <p
                className="gov-constitution-search__count"
                role="status"
                aria-live="polite"
              >
                {t("search.countLabel", { count: results.length })}
              </p>
              <ul className="gov-constitution-search__list">
                {results.map(({ item, tokens: itemTokens }) => (
                  <li key={item.id} className="gov-constitution-search__result">
                    <a
                      className="gov-constitution-search__link"
                      href={`#${item.id}`}
                    >
                      <span className="gov-constitution-search__result-title">
                        {item.label}
                      </span>
                      <span className="gov-constitution-search__result-excerpt">
                        <HighlightedExcerpt
                          content={item.content}
                          tokens={itemTokens}
                        />
                      </span>
                      <span className="gov-constitution-search__result-context">
                        {item.context}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </form>
  );
}
