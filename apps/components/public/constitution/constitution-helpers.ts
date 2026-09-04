/**
 * Label helpers for the constitutional reader interface.
 *
 * These compose the *chrome* around the official text (article numbers,
 * title/chapter/section frames, breadcrumb and context lines). They never
 * alter or translate the official content itself — the official strings
 * stay exactly as published in `lib/constitution.ts`.
 */

/** Structural frame labels of the reader, resolved from the message catalog. */
export type ConstitutionFrames = {
  article: string;
  title: string;
  chapter: string;
  section: string;
};

/**
 * Returns a display label for a numbered part: the translated frame word
 * followed by the stored number (e.g. `Article 1`, `Titre IV`). If the
 * stored number already carries its designator, it is used as-is.
 */
export function partDisplayLabel(frame: string, number?: string): string {
  const value = (number ?? "").trim();

  if (!value) {
    return frame;
  }

  return value.toLowerCase().includes(frame.toLowerCase())
    ? value
    : `${frame} ${value}`;
}

/** Short context line of an article: "Titre IV · Chapitre II · Section 1". */
export function articleContextLabel(
  frames: ConstitutionFrames,
  parts: {
    titleNumber?: string;
    chapterNumber?: string;
    sectionNumber?: string;
  },
): string {
  const labels: string[] = [];

  if (parts.sectionNumber) {
    labels.push(partDisplayLabel(frames.section, parts.sectionNumber));
  }
  if (parts.chapterNumber) {
    labels.push(partDisplayLabel(frames.chapter, parts.chapterNumber));
  }
  labels.push(partDisplayLabel(frames.title, parts.titleNumber));

  return labels.join(" · ");
}

/** Splits raw official text into paragraphs (blank-line / line separated). */
export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
