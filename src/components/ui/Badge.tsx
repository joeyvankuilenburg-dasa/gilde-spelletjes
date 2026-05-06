import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import type { Level } from '../../types/content';
import type { GameTag } from '../../games/types';

/* ── Generic badge ── */
export function Badge({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary',
        className,
      )}
      {...rest}
    />
  );
}

/* ── Level badge ── */
const levelColors: Record<Level, string> = {
  A1: 'bg-emerald-100 text-emerald-800',
  A2: 'bg-teal-100 text-teal-800',
  B1: 'bg-blue-100 text-blue-800',
  B2: 'bg-violet-100 text-violet-800',
};

export function LevelBadge({ level, className }: { level: Level; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold',
        levelColors[level],
        className,
      )}
    >
      {level}
    </span>
  );
}

/* ── Game tag badge (Aidrian-stijl status chip met gekleurde dot) ── */
const tagColors: Record<GameTag, string> = {
  Spreken: 'bg-blue-50 text-blue-700',
  'Mening geven': 'bg-violet-50 text-violet-700',
  Beschrijven: 'bg-teal-50 text-teal-700',
  Raden: 'bg-amber-50 text-amber-700',
};

const tagDots: Record<GameTag, string> = {
  Spreken: 'bg-blue-500',
  'Mening geven': 'bg-violet-500',
  Beschrijven: 'bg-teal-500',
  Raden: 'bg-amber-500',
};

export function GameTagBadge({ tag, className }: { tag: GameTag; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold',
        tagColors[tag],
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', tagDots[tag])} aria-hidden="true" />
      {tag}
    </span>
  );
}

/* ── Chip (voor tellers, labels — Aidrian-stijl) ── */
export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-border bg-bg px-2.5 py-0.5 text-xs font-bold text-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}
