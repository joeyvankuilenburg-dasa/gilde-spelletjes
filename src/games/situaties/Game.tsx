import { useEffect, useMemo, useState } from 'react';
import { LevelPicker } from '../../components/LevelPicker';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LevelBadge, Chip, GameTagBadge } from '../../components/ui/Badge';
import { useLevelFilter } from '../../hooks/useLevelFilter';
import { useNoRepeatPicker } from '../../hooks/useNoRepeatPicker';
import { useCardFlip } from '../../hooks/useCardFlip';
import { cn } from '../../lib/cn';
import { situatiesGame } from './meta';
import { SITUATIONS } from './data';

export default function SituatiesGame() {
  const [level, setLevel] = useLevelFilter();
  const filtered = useMemo(() => SITUATIONS.filter((s) => s.levels.includes(level)), [level]);
  const { current, pick, remaining } = useNoRepeatPicker(filtered);
  const { phase, flip } = useCardFlip();
  const [tipsShown, setTipsShown] = useState(false);

  useEffect(() => {
    if (filtered.length > 0) pick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  useEffect(() => {
    setTipsShown(false);
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
              </div>
            </div>

            {/* Rollen */}
            <div className="flex gap-3">
              <div className="bg-primary/8 flex flex-1 items-center gap-2 rounded-xl p-3">
                <span
                  className="material-symbols-rounded text-[20px] text-primary"
                  aria-hidden="true"
                >
                  person
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">Rol A</p>
                  <p className="font-bold text-ink">{current.roleA}</p>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-2 rounded-xl bg-accent/10 p-3">
                <span
                  className="material-symbols-rounded text-[20px] text-accent"
                  aria-hidden="true"
                >
                  person
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">Rol B</p>
                  <p className="font-bold text-ink">{current.roleB}</p>
                </div>
              </div>
            </div>

            {/* Tips */}
            {current.tips && current.tips.length > 0 && (
              <div>
                {tipsShown ? (
                  <div className="flex flex-col gap-2 rounded-xl bg-accent/10 p-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="material-symbols-rounded text-[18px] text-accent"
                        aria-hidden="true"
                      >
                        lightbulb
                      </span>
                      <p className="text-xs font-bold uppercase tracking-wide text-muted">Tips</p>
                    </div>
                    <ul className="flex flex-col gap-1">
                      {current.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-ink">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Button variant="secondary" onClick={() => setTipsShown(true)}>
                    <span className="material-symbols-rounded text-[18px]" aria-hidden="true">
                      lightbulb
                    </span>
                    Toon tips
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="py-8 text-center text-muted">Geen situaties voor dit niveau.</p>
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
