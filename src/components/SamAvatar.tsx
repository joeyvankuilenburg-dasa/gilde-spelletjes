import { useState } from 'react';
import { cn } from '../lib/cn';

interface SamAvatarProps {
  className?: string;
}

const SAM_SRC = '/images/sam/sam.webp';

/**
 * Sam, de mascotte van Gilde SamenSpraak Leiden.
 * Houdt de Leidse sleutels vast (verwijzing naar het stadswapen).
 * Valt terug op een eenvoudige SVG zolang de illustratie niet beschikbaar is.
 */
export function SamAvatar({ className }: SamAvatarProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <FallbackSam className={className} />;
  }

  return (
    <img
      src={SAM_SRC}
      alt=""
      onError={() => setFailed(true)}
      className={cn('object-contain', className)}
      aria-hidden="true"
    />
  );
}

function FallbackSam({ className }: SamAvatarProps) {
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
    </svg>
  );
}
