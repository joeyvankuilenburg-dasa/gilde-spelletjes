import { cn } from '../lib/cn';
import { MASCOT_SPRITES, MASCOT_SPRITE_CLASS, type MascotSpriteName } from './mascotSprites';

interface MascotSpriteProps {
  className?: string;
  frameIndex: number;
  sprite: MascotSpriteName;
}

export function MascotSprite({ className, frameIndex, sprite }: MascotSpriteProps) {
  const frameCount = MASCOT_SPRITES[sprite].frameCount;
  const safeFrameIndex = Math.min(Math.max(frameIndex, 0), frameCount - 1);

  return (
    <span
      className={cn('flex items-center justify-center overflow-hidden', className)}
      aria-hidden="true"
    >
      <span
        className={cn(
          'mascot-sprite block h-full',
          sprite === 'dance' ? 'aspect-[3/4]' : 'w-full',
          MASCOT_SPRITE_CLASS[sprite],
        )}
        data-frame={safeFrameIndex}
        style={{ backgroundImage: `url('${MASCOT_SPRITES[sprite].src}')` }}
      />
    </span>
  );
}
