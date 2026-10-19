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
import { useCountdown } from '../../hooks/useCountdown';
import { useGameStats } from '../../hooks/useGameStats';
import { useSetCompletion } from '../../hooks/useSetCompletion';
import { cn } from '../../lib/cn';
import { type TopicCategory } from '../../types/content';
import { woordenwebGame } from './meta';
import { WORD_PROMPTS } from './data';
import { Timer } from './Timer';

const TIMER_SECONDS = 60;

export default function WoordenwebGame() {
  const [level, setLevel] = useLevelFilter();
  const [activeCategory, setActiveCategory] = useState<TopicCategory | null>(null);
  const filtered = useMemo(
    () =>
      WORD_PROMPTS.filter(
        (w) =>
          w.levels.includes(level) && (activeCategory === null || w.category === activeCategory),
      ),
    [level, activeCategory],
  );
  const { current, pick, remaining } = useNoRepeatPicker(filtered);
  const { phase, flip } = useCardFlip();
  const countdown = useCountdown(TIMER_SECONDS);
  const { recordRound } = useGameStats();
  useSetCompletion(`woordenweb:${level}:${activeCategory ?? 'all'}`, remaining, filtered.length);

  useEffect(() => {
    if (filtered.length > 0) pick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  // Reset timer when word changes
  useEffect(() => {
    countdown.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  const handleNext = () => {
    flip(() => {
      pick();
      recordRound('woordenweb');
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-rounded text-[24px]" aria-hidden="true">
              hub
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Woordenweb</h1>
          </div>
          <GameTagBadge tag={woordenwebGame.tag} />
        </div>
        <p className="text-sm text-muted">{woordenwebGame.description}</p>
      </header>

      <LevelPicker value={level} onChange={setLevel} />
      <CategoryFilter value={activeCategory} onChange={setActiveCategory} />

      {/* Woordkaart */}
      <Card
        className={cn(
          'flex flex-col items-center gap-6 p-8 text-center',
          phase === 'out' && 'animate-flip-out',
          phase === 'in' && 'animate-flip-in',
        )}
      >
        {current ? (
          <>
            {current.emoji && (
              <span className="text-5xl" aria-hidden="true">
                {current.emoji}
              </span>
            )}
            <div className="flex flex-col items-center gap-2">
              <p className="text-4xl font-bold leading-tight text-ink">{current.word}</p>
              <div className="flex items-center gap-2">
                <LevelBadge level={level} />
                <Chip>
                  {CATEGORY_EMOJI[current.category]} {current.category}
                </Chip>
              </div>
            </div>
            <Timer
              remaining={countdown.remaining}
              total={TIMER_SECONDS}
              state={countdown.state}
              onStart={countdown.start}
              onPause={countdown.pause}
              onReset={countdown.reset}
            />
          </>
        ) : (
          <p className="text-muted">Geen woorden met deze filters.</p>
        )}
      </Card>

      <div className="flex flex-col items-center gap-2">
        <Button
          variant="accent"
          size="lg"
          onClick={handleNext}
          disabled={filtered.length === 0 || countdown.state === 'running'}
        >
          <span className="material-symbols-rounded text-[22px]" aria-hidden="true">
            shuffle
          </span>
          Volgend woord
        </Button>
        {countdown.state === 'running' && (
          <p className="text-xs text-muted">Stop de timer eerst voor een nieuw woord.</p>
        )}
        {countdown.state !== 'running' && (
          <span className="text-sm text-muted" aria-live="polite">
            Nog{' '}
            <Chip>
              <span className="material-symbols-rounded text-[12px]" aria-hidden="true">
                visibility_off
              </span>
              {remaining} ongezien
            </Chip>
          </span>
        )}
      </div>

      {/* Hoe werkt het */}
      <SamExplains notebookContext="woordenweb" steps={woordenwebGame.howToPlay} />
    </div>
  );
}
