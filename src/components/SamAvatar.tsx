import { useEffect, useMemo, useState } from 'react';
import { cn } from '../lib/cn';

export type SamVariant =
  | 'default'
  | 'celebrate'
  | 'thinking'
  | 'listening'
  | 'encouragement'
  | 'notebook'
  | 'dance';

interface SamAvatarProps {
  className?: string;
  variant?: SamVariant;
}

const FRAMES: Record<SamVariant, string[]> = {
  default: [
    '/mascot/notebook/notebook-01.webp',
    '/mascot/notebook/notebook-02.webp',
    '/mascot/notebook/notebook-03.webp',
    '/mascot/notebook/notebook-04.webp',
    '/mascot/notebook/notebook-05.webp',
    '/mascot/notebook/notebook-06.webp',
  ],
  notebook: [
    '/mascot/notebook/notebook-01.webp',
    '/mascot/notebook/notebook-02.webp',
    '/mascot/notebook/notebook-03.webp',
    '/mascot/notebook/notebook-04.webp',
    '/mascot/notebook/notebook-05.webp',
    '/mascot/notebook/notebook-06.webp',
  ],
  celebrate: [
    '/mascot/dance/dance-01.webp',
    '/mascot/dance/dance-02.webp',
    '/mascot/dance/dance-03.webp',
    '/mascot/dance/dance-04.webp',
    '/mascot/dance/dance-05.webp',
    '/mascot/dance/dance-06.webp',
    '/mascot/dance/dance-07.webp',
    '/mascot/dance/dance-08.webp',
  ],
  dance: [
    '/mascot/dance/dance-01.webp',
    '/mascot/dance/dance-02.webp',
    '/mascot/dance/dance-03.webp',
    '/mascot/dance/dance-04.webp',
    '/mascot/dance/dance-05.webp',
    '/mascot/dance/dance-06.webp',
    '/mascot/dance/dance-07.webp',
    '/mascot/dance/dance-08.webp',
  ],
  thinking: [
    '/mascot/thinking/thinking-01.webp',
    '/mascot/thinking/thinking-02.webp',
    '/mascot/thinking/thinking-03.webp',
    '/mascot/thinking/thinking-04.webp',
  ],
  listening: [
    '/mascot/listening/listening-01.webp',
    '/mascot/listening/listening-02.webp',
    '/mascot/listening/listening-03.webp',
    '/mascot/listening/listening-04.webp',
    '/mascot/listening/listening-05.webp',
    '/mascot/listening/listening-06.webp',
  ],
  encouragement: [
    '/mascot/encouragement/encouragement-01.webp',
    '/mascot/encouragement/encouragement-02.webp',
    '/mascot/encouragement/encouragement-03.webp',
    '/mascot/encouragement/encouragement-04.webp',
  ],
};

/**
 * Sam, de mascotte van Gilde SamenSpraak Leiden.
 * - default: Sam met de Leidse sleutels (voor uitleg en algemene weergave).
 * - celebrate: Sam met duim omhoog (voor mijlpalen en set-completion).
 * Valt terug op een eenvoudige SVG zolang de illustratie ontbreekt.
 */
export function SamAvatar({ className, variant = 'default' }: SamAvatarProps) {
  const [failed, setFailed] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const frames = useMemo(() => FRAMES[variant], [variant]);

  useEffect(() => {
    setFrameIndex(0);
    setFailed(false);
  }, [variant]);

  useEffect(() => {
    if (frames.length <= 1) return undefined;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;
    const interval = window.setInterval(() => {
      setFrameIndex((value) => (value + 1) % frames.length);
    }, 160);
    return () => window.clearInterval(interval);
  }, [frames]);

  if (failed) {
    return <FallbackSam className={className} />;
  }

  return (
    <img
      src={frames[frameIndex] ?? frames[0]}
      alt=""
      onError={() => setFailed(true)}
      className={cn('object-contain', className)}
      aria-hidden="true"
    />
  );
}

function FallbackSam({ className }: { className?: string }) {
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
