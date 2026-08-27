/**
 * Placeholder wordmark glyph — a restrained geometric symbol, not a literal
 * lotus render (that belongs in public/assets/ once real brand art exists).
 * Swap this for the licensed mark before Phase 2 ships publicly.
 */
export function SpiritGuideMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1" />
      <path d="M12 4.5V19.5M6 9L18 15M18 9L6 15" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  );
}
