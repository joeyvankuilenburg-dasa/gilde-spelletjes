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
import { situatiesGame } from './meta';
import { SITUATIONS } from './data';

export default function SituatiesGame() {
  const [level, setLevel] = useLevelFilter();
  const [activeCategory, setActiveCategory] = useState<TopicCategory | null>(null);
  const filtered = useMemo(
    () =>
      SITUATIONS.filter(
        (s) =>
          s.levels.includes(level) && (activeCategory === null || s.category === activeCategory),
      ),
    [level, activeCategory],
  );
  const { current, pick, remaining } = useNoRepeatPicker(filtered);
  const { phase, flip } = useCardFlip();
  const [tipsShownA, setTipsShownA] = useState(false);
  const [tipsShownB, setTipsShownB] = useState(false);
  const [pickedRole, setPickedRole] = useState<'A' | 'B' | null>(null);

  useEffect(() => {
    if (filtered.length > 0) pick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  useEffect(() => {
    setTipsShownA(false);
    setTipsShownB(false);
    setPickedRole(null);
  }, [current?.id]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-rounded text-[24px]" aria-hidden="true">
              theater_comedy
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Situatiekaarten</h1>
          </div>
          <GameTagBadge tag={situatiesGame.tag} />
        </div>
        <p className="text-sm text-muted">{situatiesGame.description}</p>
      </header>

      <LevelPicker value={level} onChange={setLevel} />
      <CategoryFilter value={activeCategory} onChange={setActiveCategory} />

      {/* Situatiekaart */}
      <Card
        className={cn(
          'flex flex-col gap-5 p-6',
          phase === 'out' && 'animate-flip-out',
          phase === 'in' && 'animate-flip-in',
        )}
      >
        {current ? (
          <>
            {/* Scenario */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span
                  className="material-symbols-rounded mt-0.5 shrink-0 text-[22px] text-primary"
                  aria-hidden="true"
                >
                  description
                </span>
                <p className="text-xl font-bold leading-snug text-ink">{current.scenario}</p>
              </div>
              <div className="flex items-center gap-2">
                <LevelBadge level={level} />
                <Chip>
                  {CATEGORY_EMOJI[current.category]} {current.category}
                </Chip>
              </div>
            </div>

            {/* Rollen */}
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted">
                Kies je rol
              </p>
              <div className="flex flex-col gap-2">
                {/* Rol A */}
                {(['A', 'B'] as const).map((rol) => {
                  const isA = rol === 'A';
                  const picked = pickedRole === rol;
                  const tipsShown = isA ? tipsShownA : tipsShownB;
                  const setTipsShown = isA ? setTipsShownA : setTipsShownB;
                  const roleLabel = isA ? current.roleA : current.roleB;
                  return (
                    <div
                      key={rol}
                      className={cn(
                        'flex flex-col rounded-xl transition-all',
                        picked
                          ? isA
                            ? 'bg-primary shadow-sm'
                            : 'bg-accent shadow-sm'
                          : isA
                            ? 'bg-primary/8'
                            : 'bg-accent/10',
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setPickedRole(pickedRole === rol ? null : rol)}
                        aria-pressed={picked}
                        className="flex items-center gap-2 p-3 text-left"
                      >
                        <span
                          className={cn(
                            'material-symbols-rounded text-[20px]',
                            picked
                              ? isA
                                ? 'text-primary-fg'
                                : 'text-accent-fg'
                              : isA
                                ? 'text-primary'
                                : 'text-accent',
                          )}
                          aria-hidden="true"
                        >
                          {picked ? 'person_check' : 'person'}
                        </span>
                        <div className="flex-1">
                          <p
                            className={cn(
                              'text-xs font-bold uppercase tracking-wide',
                              picked
                                ? isA
                                  ? 'text-primary-fg/70'
                                  : 'text-accent-fg/70'
                                : 'text-muted',
                            )}
                          >
                            Rol {rol}
                          </p>
                          <p
                            className={cn(
                              'font-bold',
                              picked
                                ? isA
                                  ? 'text-primary-fg'
                                  : 'text-accent-fg'
                                : 'text-ink',
                            )}
                          >
                            {roleLabel}
                          </p>
                        </div>
                        {!picked && (
                          <span className="text-xs font-bold text-muted">Kies</span>
                        )}
                      </button>
                      {current.tips && current.tips.length > 0 && (
                        <div className="px-3 pb-3">
                          {tipsShown ? (
                            <div
                              className={cn(
                                'flex flex-col gap-1.5 rounded-lg p-3',
                                picked
                                  ? isA
                                    ? 'bg-primary-fg/10'
                                    : 'bg-accent-fg/10'
                                  : 'bg-black/5',
                              )}
                            >
                              <p
                                className={cn(
                                  'text-xs font-bold uppercase tracking-wide',
                                  picked
                                    ? isA
                                      ? 'text-primary-fg/70'
                                      : 'text-accent-fg/70'
                                    : 'text-muted',
                                )}
                              >
                                Tips
                              </p>
                              <ul className="flex flex-col gap-1">
                                {current.tips.map((tip, i) => (
                                  <li
                                    key={i}
                                    className={cn(
                                      'flex items-start gap-2 text-sm',
                                      picked
                                        ? isA
                                          ? 'text-primary-fg'
                                          : 'text-accent-fg'
                                        : 'text-ink',
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full',
                                        picked
                                          ? isA
                                            ? 'bg-primary-fg/60'
                                            : 'bg-accent-fg/60'
                                          : 'bg-accent',
                                      )}
                                    />
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setTipsShown(true)}
                              className={cn(
                                'flex items-center gap-1.5 text-xs font-bold',
                                picked
                                  ? isA
                                    ? 'text-primary-fg/70 hover:text-primary-fg'
                                    : 'text-accent-fg/70 hover:text-accent-fg'
                                  : 'text-muted hover:text-ink',
                              )}
                            >
                              <span
                                className="material-symbols-rounded text-[16px]"
                                aria-hidden="true"
                              >
                                lightbulb
                              </span>
                              Toon tips
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <p className="py-8 text-center text-muted">Geen situaties met deze filters.</p>
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
          Volgende situatie
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
          {situatiesGame.howToPlay.map((step, i) => (
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
