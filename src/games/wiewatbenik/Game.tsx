import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { GameTagBadge, Chip } from '../../components/ui/Badge';
import { useNoRepeatPicker } from '../../hooks/useNoRepeatPicker';
import { useCardFlip } from '../../hooks/useCardFlip';
import { useGameStats } from '../../hooks/useGameStats';
import { useSetCompletion } from '../../hooks/useSetCompletion';
import { cn } from '../../lib/cn';
import { wieWatBenIkGame } from './meta';
import { WIEWAT_CARDS } from './data';
import type { WieWatCategory } from '../../types/content';

const CATEGORIES: WieWatCategory[] = ['Beroep', 'Dier', 'Voorwerp', 'Persoon', 'Eten', 'Plek'];

const CATEGORY_EMOJI: Record<WieWatCategory, string> = {
  Beroep: '💼',
  Dier: '🐾',
  Voorwerp: '📦',
  Persoon: '🧑',
  Eten: '🍽️',
  Plek: '📍',
};

export default function WieWatBenIkGame() {
  const [activeCategory, setActiveCategory] = useState<WieWatCategory | null>(null);
  const [revealed, setRevealed] = useState(false);
  const { phase, flip } = useCardFlip();

  const filtered = useMemo(
    () =>
      activeCategory ? WIEWAT_CARDS.filter((c) => c.category === activeCategory) : WIEWAT_CARDS,
    [activeCategory],
  );
  const { current, pick, remaining } = useNoRepeatPicker(filtered);
  const { recordRound } = useGameStats();
  useSetCompletion(`wiewatbenik:${activeCategory ?? 'all'}`, remaining, filtered.length);

  useEffect(() => {
    if (filtered.length > 0) pick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  const handleNext = (wasGuessed: boolean) => {
    void wasGuessed;
    setRevealed(false);
    flip(() => {
      pick();
      recordRound('wiewatbenik');
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-rounded text-[24px]" aria-hidden="true">
              psychology
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Wie of Wat ben ik?</h1>
          </div>
          <GameTagBadge tag={wieWatBenIkGame.tag} />
        </div>
        <p className="text-sm text-muted">{wieWatBenIkGame.description}</p>
      </header>

      {/* Categorie filter */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">Categorie</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-bold transition-colors',
              activeCategory === null
                ? 'bg-primary text-primary-fg'
                : 'bg-surface text-muted shadow-card hover:text-ink',
            )}
          >
            Alles
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-bold transition-colors',
                activeCategory === cat
                  ? 'bg-primary text-primary-fg'
                  : 'bg-surface text-muted shadow-card hover:text-ink',
              )}
            >
              {CATEGORY_EMOJI[cat]} {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Kaart */}
      <Card
        className={cn(
          'min-h-[220px]',
          phase === 'out' && 'animate-flip-out',
          phase === 'in' && 'animate-flip-in',
        )}
      >
        {current ? (
          revealed ? (
            <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
              <span className="text-6xl" aria-hidden="true">
                {current.emoji}
              </span>
              <p className="text-3xl font-bold text-ink">{current.word}</p>
              <span className="rounded-full bg-border/60 px-3 py-1 text-xs font-bold text-muted">
                {current.category}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="hover:bg-primary/4 flex min-h-[220px] w-full flex-col items-center justify-center gap-3 rounded-card p-8 text-center"
            >
              <span
                className="material-symbols-rounded text-[48px] text-primary/30"
                aria-hidden="true"
              >
                help
              </span>
              <p className="font-bold text-muted">Tik om te onthullen</p>
              <p className="text-xs text-muted/60">Zorg dat speler A wegkijkt</p>
            </button>
          )
        ) : (
          <p className="flex min-h-[220px] items-center justify-center text-muted">
            Geen kaarten beschikbaar.
          </p>
        )}
      </Card>

      {/* Actieknoppen na onthulling */}
      {revealed && current && (
        <div className="flex gap-3">
          <Button
            variant="accent"
            size="lg"
            className="flex-1 px-3"
            onClick={() => handleNext(true)}
          >
            <span className="material-symbols-rounded text-[20px]" aria-hidden="true">
              check_circle
            </span>
            Geraden!
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 px-3"
            onClick={() => handleNext(false)}
          >
            <span className="material-symbols-rounded text-[20px]" aria-hidden="true">
              skip_next
            </span>
            Overgeslagen
          </Button>
        </div>
      )}

      {!revealed && (
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="accent"
            size="lg"
            onClick={() => {
              setRevealed(false);
              flip(pick);
            }}
            disabled={filtered.length === 0}
          >
            <span className="material-symbols-rounded text-[22px]" aria-hidden="true">
              shuffle
            </span>
            Volgende kaart
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
      )}

      {/* Hoe werkt het */}
      <Card className="p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">
          Hoe werkt het?
        </p>
        <ul className="flex flex-col gap-1.5">
          {wieWatBenIkGame.howToPlay.map((step, i) => (
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
