"use client";

import * as React from "react";

/**
 * Accordion table of contents reproducing the Légifrance sommaire pattern:
 * structural rows ("Titre premier", "Chapitre II"…) collapse over their
 * entries, each entry keeps a stable in-document anchor, a "Expand all /
 * Collapse all" control drives every group at once, and the entry matching
 * the current URL anchor (`#article-42`, `#titre-1`…) is marked and revealed.
 *
 * The tree is plain serializable data (ids, labels, anchors) so the rest of
 * the page stays server-rendered. Groups are rendered expanded by default so
 * the sommaire remains fully usable (and readable) without JavaScript.
 *
 * Two presentations are rendered from the same tree:
 *   - a progressive `<details>` disclosure for mobile/tablet,
 *   - a permanent, sticky index column for desktop.
 * Only one is visible at a time (pure CSS), so the reader page itself never
 * depends on JavaScript to lay the columns out.
 */

export type ConstitutionSommaireItem = {
  /** Target id of the document block (also the group key when it has children). */
  id: string;
  /** Main label, e.g. "Titre premier", "Article 1". */
  label: string;
  /** Optional structural line, e.g. the official name of a title. */
  subtitle?: string;
  /** In-page anchor ("#titre-1", "#article-1"…). */
  href: string;
  /** Optional secondary text, e.g. "Articles 1 à 4". */
  meta?: string;
  children?: ReadonlyArray<ConstitutionSommaireItem>;
};

type SommaireLabels = {
  /** Accessible name of the navigation landmark. */
  navLabel: string;
  /** Short visible heading ("Sommaire" / "Contents"). */
  title: string;
  expandAllLabel: string;
  collapseAllLabel: string;
  expandGroupLabel: string;
  collapseGroupLabel: string;
};

function collectGroupIds(
  items: ReadonlyArray<ConstitutionSommaireItem>,
): string[] {
  const ids: string[] = [];
  for (const item of items) {
    if (item.children && item.children.length > 0) {
      ids.push(item.id);
      ids.push(...collectGroupIds(item.children));
    }
  }
  return ids;
}

/**
 * Maps every item id to the chain of *group* ancestors that contain it
 * (from the outermost down), so a targeted anchor can be revealed even when
 * its groups were collapsed by the user.
 */
function buildAncestorChains(
  items: ReadonlyArray<ConstitutionSommaireItem>,
): ReadonlyMap<string, string[]> {
  const chains = new Map<string, string[]>();

  const walk = (
    entries: ReadonlyArray<ConstitutionSommaireItem>,
    ancestors: string[],
  ) => {
    for (const entry of entries) {
      if (entry.children && entry.children.length > 0) {
        chains.set(entry.id, ancestors);
        walk(entry.children, [...ancestors, entry.id]);
      } else {
        chains.set(entry.id, ancestors);
      }
    }
  };

  walk(items, []);
  return chains;
}

function SommaireList({
  items,
  expanded,
  onToggle,
  labels,
}: {
  items: ReadonlyArray<ConstitutionSommaireItem>;
  expanded: ReadonlySet<string>;
  onToggle: (id: string) => void;
  labels: SommaireLabels;
}) {
  return (
    <ul className="gov-sommaire__list">
      {items.map((item) => {
        const hasChildren = Boolean(item.children && item.children.length > 0);

        if (!hasChildren) {
          return (
            <li key={item.id} className="gov-sommaire__item">
              <a
                className="gov-sommaire__link gov-sommaire__link--leaf"
                href={item.href}
              >
                <span className="gov-sommaire__link-label">{item.label}</span>
                {item.meta && (
                  <span className="gov-sommaire__meta">{item.meta}</span>
                )}
              </a>
            </li>
          );
        }

        const isOpen = expanded.has(item.id);
        const contentId = `sommaire-group-${item.id}`;

        return (
          <li key={item.id} className="gov-sommaire__item gov-sommaire__item--group">
            <div className="gov-sommaire__row">
              <a
                className="gov-sommaire__link gov-sommaire__link--group"
                href={item.href}
              >
                <span className="gov-sommaire__link-title">{item.label}</span>
                {item.subtitle && (
                  <span className="gov-sommaire__link-subtitle">
                    {item.subtitle}
                  </span>
                )}
                {item.meta && (
                  <span className="gov-sommaire__meta">{item.meta}</span>
                )}
              </a>
              <button
                type="button"
                className="gov-sommaire__toggle"
                aria-expanded={isOpen}
                aria-controls={contentId}
                aria-label={`${isOpen ? labels.collapseGroupLabel : labels.expandGroupLabel} ${item.label}`}
                onClick={() => onToggle(item.id)}
              >
                <span aria-hidden="true" className="fr-icon-arrow-down-s-line" />
              </button>
            </div>

            {isOpen && (
              <ul id={contentId} className="gov-sommaire__list gov-sommaire__list--nested">
                <SommaireList
                  items={item.children!}
                  expanded={expanded}
                  onToggle={onToggle}
                  labels={labels}
                />
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** One presentation (mobile disclosure or desktop column) of the sommaire. */
function SommaireVariant({
  items,
  labels,
  variant,
}: {
  items: ReadonlyArray<ConstitutionSommaireItem>;
  labels: SommaireLabels;
  variant: "mobile" | "desktop";
}) {
  const rootRef = React.useRef<HTMLDivElement | HTMLDetailsElement>(null);
  const groupIds = React.useMemo(() => collectGroupIds(items), [items]);
  const ancestorChains = React.useMemo(() => buildAncestorChains(items), [items]);

  // Open by default: the full structure stays visible/usable without JS.
  const [expanded, setExpanded] = React.useState<ReadonlySet<string>>(
    () => new Set(groupIds),
  );

  const allExpanded =
    groupIds.length > 0 && groupIds.every((id) => expanded.has(id));

  const toggle = (id: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    setExpanded(allExpanded ? new Set() : new Set(groupIds));
  };

  // Track the current anchor: mark the matching entry (aria-current) and
  // reveal its ancestor groups when the user lands on a deep link.
  React.useEffect(() => {
    const apply = () => {
      const current = window.location.hash.replace(/^#/, "");

      if (current !== "") {
        const ancestors = ancestorChains.get(current);
        if (ancestors && ancestors.length > 0) {
          setExpanded((previous) => {
            const next = new Set(previous);
            for (const id of ancestors) {
              next.add(id);
            }
            return next;
          });
        }
      }

      const root = rootRef.current;
      if (!root) {
        return;
      }

      root
        .querySelectorAll<HTMLAnchorElement>('a.gov-sommaire__link[href^="#"]')
        .forEach((link) => {
          const target = (link.getAttribute("href") ?? "").replace(/^#/, "");
          if (target === current && current !== "") {
            link.setAttribute("aria-current", "true");
            const bounding = link.getBoundingClientRect();
            if (
              bounding.top < 0 ||
              bounding.bottom > window.innerHeight
            ) {
              link.scrollIntoView({ block: "nearest" });
            }
          } else {
            link.removeAttribute("aria-current");
          }
        });
    };

    apply();
    window.addEventListener("hashchange", apply);
    return () => {
      window.removeEventListener("hashchange", apply);
    };
  }, [ancestorChains]);

  const body = (
    <>
      <div className="gov-sommaire__body">
        {groupIds.length > 0 && (
          <div className="gov-sommaire__toolbar">
            <button
              type="button"
              className="gov-sommaire__expand-all"
              onClick={toggleAll}
              aria-pressed={allExpanded}
            >
              {allExpanded ? labels.collapseAllLabel : labels.expandAllLabel}
              <span
                aria-hidden="true"
                className={
                  allExpanded
                    ? "fr-icon-arrow-up-s-line"
                    : "fr-icon-arrow-down-s-line"
                }
              />
            </button>
          </div>
        )}

        <nav className="gov-sommaire__nav" aria-label={labels.navLabel}>
          <SommaireList
            items={items}
            expanded={expanded}
            onToggle={toggle}
            labels={labels}
          />
        </nav>
      </div>
    </>
  );

  if (variant === "mobile") {
    return (
      <details
        ref={rootRef as React.Ref<HTMLDetailsElement>}
        className="gov-sommaire gov-sommaire--mobile"
      >
        <summary className="gov-sommaire__summary">
          <span className="gov-sommaire__summary-title">{labels.title}</span>
          <span aria-hidden="true" className="fr-icon-arrow-down-s-line" />
        </summary>
        {body}
      </details>
    );
  }

  return (
    <div
      ref={rootRef as React.Ref<HTMLDivElement>}
      className="gov-sommaire gov-sommaire--desktop"
    >
      <div className="gov-sommaire__head">
        <p className="gov-sommaire__heading">{labels.title}</p>
        <button
          type="button"
          className="gov-sommaire__expand-all"
          onClick={toggleAll}
          aria-pressed={allExpanded}
        >
          {allExpanded ? labels.collapseAllLabel : labels.expandAllLabel}
          <span
            aria-hidden="true"
            className={
              allExpanded
                ? "fr-icon-arrow-up-s-line"
                : "fr-icon-arrow-down-s-line"
            }
          />
        </button>
      </div>
      {body}
    </div>
  );
}

/**
 * Renders the two presentations of the sommaire (mobile disclosure and
 * desktop sticky column) from a single serializable tree.
 */
export function ConstitutionSommaire({
  items,
  labels,
}: {
  items: ReadonlyArray<ConstitutionSommaireItem>;
  labels: SommaireLabels;
}) {
  return (
    <>
      <SommaireVariant items={items} labels={labels} variant="mobile" />
      <SommaireVariant items={items} labels={labels} variant="desktop" />
    </>
  );
}
