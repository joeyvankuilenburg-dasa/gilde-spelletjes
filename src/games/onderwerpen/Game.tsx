import { useEffect, useMemo } from 'react';
import { LevelPicker } from '../../components/LevelPicker';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LevelBadge, Chip, GameTagBadge } from '../../components/ui/Badge';
import { useLevelFilter } from '../../hooks/useLevelFilter';
import { useNoRepeatPicker } from '../../hooks/useNoRepeatPicker';
import { useCardFlip } from '../../hooks/useCardFlip';
import { cn } from '../../lib/cn';
import { onderwerpenGame } from './meta';
import { TOPICS } from './data';

export default function OnderwerpenGame() {
  const [level, setLevel] = useLevelFilter();
  const filtered = useMemo(() => TOPICS.filter((t) => t.levels.includes(level)), [level]);
  const { current, pick, remaining } = useNoRepeatPicker(filtered);
  const { phase, flip } = useCardFlip();

  useEffect(() => {
    if (filtered.length > 0) pick();
    // pick once when level changes; intentionally omitted from deps to avoid re-pick loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-rounded text-[24px]" aria-hidden="true">
              forum
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Onderwerpen</h1>
          </div>
          <GameTagBadge tag={onderwerpenGame.tag} />
        </div>
        <p className="text-sm text-muted">{onderwerpenGame.description}</p>
      </header>

      <LevelPicker value={level} onChange={setLevel} />

      {/* Contentkaart */}
      <Card
        className={cn(
          'flex min-h-[200px] flex-col items-center justify-center gap-4 p-8 text-center',
          phase === 'out' && 'animate-flip-out',
          phase === 'in' && 'animate-flip-in',
        )}
      >
        {current ? (
          <>
            <p key={current.id} className="animate-pop text-2xl font-bold leading-snug text-ink">
              {current.text}
            </p>
            <div className="flex items-center gap-2">
              <LevelBadge level={level} />
              {current.tags?.map((tag) => (
                <Chip key={tag}>{tag}</Chip>
              ))}
            </div>
          </>
        ) : (
          <p className="text-muted">Geen onderwerpen voor dit niveau.</p>
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
          Volgend onderwerp
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
          {onderwerpenGame.howToPlay.map((step, i) => (
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
