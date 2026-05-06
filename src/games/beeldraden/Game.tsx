import { useEffect, useMemo, useState } from 'react';
import { LevelPicker } from '../../components/LevelPicker';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LevelBadge, Chip, GameTagBadge } from '../../components/ui/Badge';
import { useLevelFilter } from '../../hooks/useLevelFilter';
import { useNoRepeatPicker } from '../../hooks/useNoRepeatPicker';
import { useCardFlip } from '../../hooks/useCardFlip';
import { cn } from '../../lib/cn';
import { LEVELS } from '../../types/content';
import type { Level } from '../../types/content';
import { beeldradenGame } from './meta';
import { IMAGE_PROMPTS } from './images';

const comingSoonLevels: Level[] = LEVELS.filter(
  (l) => IMAGE_PROMPTS.filter((img) => img.levels.includes(l)).length === 0,
);

export default function BeeldradenGame() {
  const [level, setLevel] = useLevelFilter();
  const filtered = useMemo(
    () => IMAGE_PROMPTS.filter((img) => img.levels.includes(level)),
    [level],
  );
  const { current, pick, remaining } = useNoRepeatPicker(filtered);
  const { phase, flip } = useCardFlip();
  const [hintShown, setHintShown] = useState(false);

  useEffect(() => {
    if (filtered.length > 0) pick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  useEffect(() => {
    setHintShown(false);
  }, [current?.id]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-rounded text-[24px]" aria-hidden="true">
              image
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Beeldraden</h1>
          </div>
          <GameTagBadge tag={beeldradenGame.tag} />
        </div>
        <p className="text-sm text-muted">{beeldradenGame.description}</p>
      </header>

      <LevelPicker value={level} onChange={setLevel} comingSoonLevels={comingSoonLevels} />

      {/* Fotokaart */}
      <Card
        className={cn(
          'overflow-hidden p-0',
          phase === 'out' && 'animate-flip-out',
          phase === 'in' && 'animate-flip-in',
        )}
      >
        {current ? (
          <div key={current.id} className="animate-pop">
            <div className="relative">
              <img
                src={current.src}
                alt={current.alt}
                className="aspect-[4/3] w-full object-cover"
                loading="eager"
              />
              <div className="absolute left-3 top-3">
                <LevelBadge level={level} />
              </div>
            </div>
            <div className="flex flex-col gap-3 p-5">
              {hintShown && current.hintCaption ? (
                <div className="flex items-start gap-2 rounded-xl bg-accent/10 p-3">
                  <span
                    className="material-symbols-rounded shrink-0 text-[20px] text-accent"
                    aria-hidden="true"
                  >
                    lightbulb
                  </span>
                  <p className="text-base italic text-ink">{current.hintCaption}</p>
                </div>
              ) : (
                <Button variant="secondary" onClick={() => setHintShown(true)}>
                  <span className="material-symbols-rounded text-[18px]" aria-hidden="true">
                    lightbulb
                  </span>
                  Toon hint
                </Button>
              )}
              {current.credit ? (
                <span className="text-xs text-muted">Foto: {current.credit}</span>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <span className="material-symbols-rounded text-[48px] text-muted/40" aria-hidden="true">
              hourglass_empty
            </span>
            <p className="text-base font-bold text-ink">Binnenkort beschikbaar</p>
            <p className="text-sm text-muted">
              We voegen nog foto's toe voor niveau {level}. Kies een ander niveau om verder te
              spelen.
            </p>
          </div>
        )}
      </Card>

      <div className="flex flex-col items-center gap-2">
        <Button
          variant="accent"
          size="lg"
          onClick={() => flip(pick)}
          disabled={filtered.length === 0}
        >
          <span className="material-symbols-rounded text-[22px]" aria-hidden="true">
            shuffle
          </span>
          Volgende foto
        </Button>
        <span className="text-sm text-muted" aria-live="polite">
          Nog{' '}
          <Chip>
            <span className="material-symbols-rounded text-[12px]" aria-hidden="true">
              visibility_off
            </span>
            {remaining} ongezien
          </Chip>{' '}
          op niveau {level}.
        </span>
      </div>

      {/* Hoe werkt het */}
      <Card className="p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">
          Hoe werkt het?
        </p>
        <ul className="flex flex-col gap-1.5">
          {beeldradenGame.howToPlay.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink">
              <span
                aria-hidden="true"
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
              />
              {step}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
