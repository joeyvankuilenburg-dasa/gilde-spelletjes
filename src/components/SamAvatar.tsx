interface SamAvatarProps {
  className?: string;
}

// Placeholder until a real Sam illustration is delivered.
// Friendly round figure with a waving hand.
export function SamAvatar({ className }: SamAvatarProps) {
  return (
    <svg
      viewBox="0 0 160 160"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="sam-body" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="hsl(var(--gssl-accent))" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(var(--gssl-primary))" stopOpacity="1" />
        </radialGradient>
      </defs>
      <circle cx="80" cy="80" r="62" fill="url(#sam-body)" />
      <circle cx="60" cy="74" r="7" fill="#1a1a2e" />
      <circle cx="100" cy="74" r="7" fill="#1a1a2e" />
      <circle cx="62" cy="72" r="2.4" fill="#fff" />
      <circle cx="102" cy="72" r="2.4" fill="#fff" />
      <path
        d="M58 98 Q80 116 102 98"
        stroke="#1a1a2e"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="50" cy="100" r="5" fill="#ff8585" opacity="0.55" />
      <circle cx="110" cy="100" r="5" fill="#ff8585" opacity="0.55" />
      <path
        d="M132 60 Q146 50 142 36 Q138 24 124 28"
        stroke="hsl(var(--gssl-primary))"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
