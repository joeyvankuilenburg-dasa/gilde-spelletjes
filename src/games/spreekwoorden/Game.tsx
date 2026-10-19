import { useEffect, useMemo, useState } from 'react';
import { LevelPicker } from '../../components/LevelPicker';
import { CategoryFilter, CATEGORY_EMOJI } from '../../components/CategoryFilter';
import { SamExplains } from '../../components/SamExplains';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LevelBadge, Chip, GameTagBadge } from '../../components/ui/Badge';
import { useLevelFilter } from '../../hooks/useLevelFilter';
import { useNoRepeatPicker } from '../../hooks/useNoRepeatPicker';
import { useCardFlip } from '../../hooks/useCardFlip';
import { useGameStats } from '../../hooks/useGameStats';
import { useSetCompletion } from '../../hooks/useSetCompletion';
import { cn } from '../../lib/cn';
import { type TopicCategory } from '../../types/content';
import { spreekwoordenGame } from './meta';
import { SPREEKWOORDEN } from './data';
import { ExpressionQuiz } from './ExpressionQuiz';

type PracticeMode = 'cards' | 'expressions';

export default function SpreekwoordenGame() {
  const [mode, setMode] = useState<PracticeMode>('cards');
  const [level, setLevel] = useLevelFilter();
  const [activeCategory, setActiveCategory] = useState<TopicCategory | null>(null);
  const filtered = useMemo(
    () =>
      SPREEKWOORDEN.filter(
        (s) =>
          s.levels.includes(level) && (activeCategory === null || s.category === activeCategory),
      ),
    [level, activeCategory],
  );
  const { current, pick, remaining } = useNoRepeatPicker(filtered);
  const { phase, flip } = useCardFlip();
  const { recordRound } = useGameStats();
  useSetCompletion(`spreekwoorden:${level}:${activeCategory ?? 'all'}`, remaining, filtered.length);
  const [meaningShown, setMeaningShown] = useState(false);

  useEffect(() => {
    if (filtered.length > 0) pick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  useEffect(() => {
    setMeaningShown(false);
  }, [current?.id]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-rounded text-[24px]" aria-hidden="true">
              format_quote
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Spreekwoorden</h1>
          </div>
          <GameTagBadge tag={spreekwoordenGame.tag} />
        </div>
        <p className="text-sm text-muted">{spreekwoordenGame.description}</p>
      </header>

      <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-bg p-1">
        <button
          type="button"
          onClick={() => setMode('cards')}
          className={cn(
            'rounded-lg px-3 py-2 text-sm font-bold transition-colors',
            mode === 'cards' ? 'bg-surface text-ink shadow-card' : 'text-muted hover:text-ink',
          )}
        >
          Kaarten
        </button>
        <button
          type="button"
          onClick={() => setMode('expressions')}
          className={cn(
            'rounded-lg px-3 py-2 text-sm font-bold transition-colors',
            mode === 'expressions'
              ? 'bg-surface text-ink shadow-card'
              : 'text-muted hover:text-ink',
          )}
        >
          Uitdrukkingen
        </button>
      </div>

      {mode === 'expressions' ? (
        <>
          <ExpressionQuiz />
          <SamExplains
            notebookContext="uitdrukkingen"
            steps={[
              'Kies of je een uitdrukking wilt afmaken of de betekenis wilt raden.',
              'Lees de zin of letterlijke uitleg rustig hardop.',
              'Kies het antwoord en bespreek de echte betekenis.',
              'Gebruik de uitdrukking daarna in een eigen zin.',
            ]}
          />
        </>
      ) : (
        <>
          <LevelPicker value={level} onChange={setLevel} />
          <CategoryFilter value={activeCategory} onChange={setActiveCategory} />

          <Card
            className={cn(
              'flex flex-col gap-5 p-6',
              phase === 'out' && 'animate-flip-out',
              phase === 'in' && 'animate-flip-in',
            )}
          >
            {current ? (
              <>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className="material-symbols-rounded mt-0.5 shrink-0 text-[22px] text-primary"
                      aria-hidden="true"
                    >
                      format_quote
                    </span>
                    <p className="text-xl font-bold italic leading-snug text-ink">{current.text}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <LevelBadge level={level} />
                    <Chip>
                      {CATEGORY_EMOJI[current.category]} {current.category}
                    </Chip>
                  </div>
                </div>

                {meaningShown ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2 rounded-xl bg-accent/10 p-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="material-symbols-rounded text-[18px] text-accent"
                          aria-hidden="true"
                        >
                          lightbulb
                        </span>
                        <p className="text-xs font-bold uppercase tracking-wide text-muted">
                          Betekenis
                        </p>
                      </div>
                      <p className="text-base text-ink">{current.meaning}</p>
                    </div>
                    {current.example && (
                      <div className="bg-primary/6 flex flex-col gap-1 rounded-xl p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-muted">
                          Voorbeeld
                        </p>
                        <p className="text-sm italic text-ink">{current.example}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button variant="secondary" onClick={() => setMeaningShown(true)}>
                    <span className="material-symbols-rounded text-[18px]" aria-hidden="true">
                      lightbulb
                    </span>
                    Toon betekenis
                  </Button>
                )}
              </>
            ) : (
              <p className="py-8 text-center text-muted">Geen spreekwoorden met deze filters.</p>
            )}
          </Card>

          <div className="flex flex-col items-center gap-2">
            <Button
              variant="accent"
              size="lg"
              onClick={() =>
                flip(() => {
                  pick();
                  recordRound('spreekwoorden');
                })
              }
              disabled={filtered.length === 0}
            >
              <span className="material-symbols-rounded text-[22px]" aria-hidden="true">
                shuffle
              </span>
              Volgend spreekwoord
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

          <SamExplains notebookContext="spreekwoorden" steps={spreekwoordenGame.howToPlay} />
        </>
      )}
    </div>
  );
}
