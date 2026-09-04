"use client";

import { useEffect, useRef } from "react";

/**
 * Event-delegated copy-link coordinator.
 *
 * The article buttons are plain server-rendered markup (`[data-copy-link]`);
 * a single client island listens for clicks anywhere in the document and
 * performs the clipboard copy. Feedback is purely visual (a `data-copied`
 * state swapped through CSS) plus a polite live region, so no per-article
 * client component or React state is needed and the constitutional text is
 * never serialized into a client payload.
 */

async function copyToClipboard(text: string): Promise<boolean> {
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

export function ConstitutionCopyLinks() {
  const statusRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const timers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();

    const clearFeedback = (button: HTMLElement) => {
      const timer = timers.get(button);
      if (timer) {
        clearTimeout(timer);
        timers.delete(button);
      }
      button.removeAttribute("data-copied");
    };

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

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest<HTMLElement>("[data-copy-link]");
      if (!button) {
        return;
      }

      const anchor = button.getAttribute("data-copy-link");
      if (!anchor) {
        return;
      }

      const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${encodeURIComponent(anchor)}`;

      void copyToClipboard(url).then((ok) => {
        if (!ok) {
          return;
        }
        clearFeedback(button);
        button.setAttribute("data-copied", "true");
        const copiedLabel = button.querySelector<HTMLElement>(
          ".gov-constitution-copy__label--copied",
        );
        announce(
          copiedLabel?.textContent?.trim() ||
            button.getAttribute("aria-label") ||
            "",
        );
        timers.set(
          button,
          setTimeout(() => {
            clearFeedback(button);
          }, 2200),
        );
      });
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return (
    <span
      ref={statusRef}
      role="status"
      aria-live="polite"
      className="gov-visually-hidden"
    />
  );
}
