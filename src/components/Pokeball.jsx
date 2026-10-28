export function Pokeball({ size = 24, className = '' }) {
  return (
    <svg
      className={`pokeball ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      <path className="pb-top" d="M6 50a44 44 0 0 1 88 0z" />
      <path className="pb-bottom" d="M6 50a44 44 0 0 0 88 0z" />
      <rect className="pb-band" x="6" y="45" width="88" height="10" />
      <circle className="pb-outline" cx="50" cy="50" r="44" />
      <circle className="pb-ring" cx="50" cy="50" r="15" />
      <circle className="pb-button" cx="50" cy="50" r="8" />
    </svg>
  );
}
