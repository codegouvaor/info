/**
 * Astorian government emblem — the « A » monogram used in the institutional
 * lockup of the header and the footer.
 *
 * NOTE: @codegouvaor/react-ads still ships the legacy French Marianne artwork
 * behind its `.fr-logo` class. The portal therefore hides those pseudo
 * elements (see `apps/styles/gov-ads.css`) and draws its own institutional
 * mark instead. This is a brand-layer override that should move into ADS once
 * the official Astorian identity tokens are published.
 */
export function AstoriaEmblem({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="presentation"
      className={className}
      viewBox="0 0 40 41"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="m7.839 40.783 16.03-28.054L20 6 0 40.783h7.839Zm8.214 0H40L27.99 19.894l-4.02 7.032 3.976 6.914H20.02l-3.967 6.943Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
