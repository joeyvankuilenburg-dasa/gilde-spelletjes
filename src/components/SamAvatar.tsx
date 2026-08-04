import { useEffect, useState } from 'react';
import { MascotSprite } from './MascotSprite';
import { MASCOT_SPRITES, type MascotSpriteName } from './mascotSprites';

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

const SPRITE_FOR_VARIANT: Record<SamVariant, MascotSpriteName> = {
  default: 'notebook',
  notebook: 'notebook',
  celebrate: 'dance',
  dance: 'dance',
  thinking: 'thinking',
  listening: 'listening',
  encouragement: 'encouragement',
};

/**
 * Sam, de mascotte van Gilde SamenSpraak Leiden.
 * De homepage-notitieboekanimatie rust vijf seconden op het eindbeeld voordat
 * deze opnieuw begint. Andere varianten blijven vloeiend doorlopen.
 */
export function SamAvatar({ className, variant = 'default' }: SamAvatarProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const sprite = SPRITE_FOR_VARIANT[variant];
  const frameCount = MASCOT_SPRITES[sprite].frameCount;

  useEffect(() => {
    setFrameIndex(0);
  }, [variant]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    const isNotebook = sprite === 'notebook';
    const isFinalFrame = frameIndex === frameCount - 1;
    const delayMs = isNotebook && isFinalFrame ? 5000 : 160;
    const timeout = window.setTimeout(() => {
      setFrameIndex((value) => (value + 1) % frameCount);
    }, delayMs);

    return () => window.clearTimeout(timeout);
  }, [frameCount, frameIndex, sprite]);

  return <MascotSprite className={className} frameIndex={frameIndex} sprite={sprite} />;
}
