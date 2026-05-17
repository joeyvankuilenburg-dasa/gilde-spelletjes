import { useEffect, useMemo, useState } from 'react';
import { LevelPicker } from '../../components/LevelPicker';
import { CategoryFilter, CATEGORY_EMOJI } from '../../components/CategoryFilter';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LevelBadge, Chip, GameTagBadge } from '../../components/ui/Badge';
import { useLevelFilter } from '../../hooks/useLevelFilter';
import { useNoRepeatPicker } from '../../hooks/useNoRepeatPicker';
import { useCardFlip } from '../../hooks/useCardFlip';
import { cn } from '../../lib/cn';
import { type TopicCategory } from '../../types/content';
import { stellingenGame } from './meta';
import { STATEMENTS } from './data';

export default function StellingenGame() {
  const [level, setLevel] = useLevelFilter();
  const [activeCategory, setActiveCategory] = useState<TopicCategory | null>(null);
  const filtered = useMemo(
    () =>
      STATEMENTS.filter(
        (s) =>
          s.levels.includes(level) && (activeCategory === null || s.category === activeCategory),
      ),
    [level, activeCategory],
  );
  const { current, pick, remaining } = useNoRepeatPicker(filtered);
  const { phase, flip } = useCardFlip();

  useEffect(() => {
    if (filtered.length > 0) pick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-rounded text-[24px]" aria-hidden="true">
              balance
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Stellingen &amp; dilemma's</h1>
          </div>
          <GameTagBadge tag={stellingenGame.tag} />
        </div>
        <p className="text-sm text-muted">{stellingenGame.description}</p>
      </header>

      <LevelPicker value={level} onChange={setLevel} />
      <CategoryFilter value={activeCategory} onChange={setActiveCategory} />

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
              <Chip>
                {CATEGORY_EMOJI[current.category]} {current.category}
              </Chip>
            </div>
          </>
        ) : (
          <p className="text-muted">Geen stellingen met deze filters.</p>
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
          Volgende stelling
        </Button>
        <span className="text-sm text-muted" aria-live="polite">
          Nog{' '}
          <Chip>
            <span className="material-symbols-rounded text-[12px]" aria-hidden="true">
              visibility_off
            </span>
            {remaining} ongezien
          </Chip>
        </span>
      </div>

      {/* Hoe werkt het */}
      <Card className="p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">
          Hoe werkt het?
        </p>
        <ul className="flex flex-col gap-1.5">
          {stellingenGame.howToPlay.map((step, i) => (
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
