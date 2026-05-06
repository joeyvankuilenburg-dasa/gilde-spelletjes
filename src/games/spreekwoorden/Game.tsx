import { useEffect, useMemo, useState } from 'react';
import { LevelPicker } from '../../components/LevelPicker';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LevelBadge, Chip, GameTagBadge } from '../../components/ui/Badge';
import { useLevelFilter } from '../../hooks/useLevelFilter';
import { useNoRepeatPicker } from '../../hooks/useNoRepeatPicker';
import { useCardFlip } from '../../hooks/useCardFlip';
import { cn } from '../../lib/cn';
import { spreekwoordenGame } from './meta';
import { SPREEKWOORDEN } from './data';

export default function SpreekwoordenGame() {
  const [level, setLevel] = useLevelFilter();
  const filtered = useMemo(() => SPREEKWOORDEN.filter((s) => s.levels.includes(level)), [level]);
  const { current, pick, remaining } = useNoRepeatPicker(filtered);
  const { phase, flip } = useCardFlip();
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
      {/* Header */}
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

      <LevelPicker value={level} onChange={setLevel} />

      {/* Spreekwoord-kaart */}
      <Card
        className={cn(
          'flex flex-col gap-5 p-6',
          phase === 'out' && 'animate-flip-out',
          phase === 'in' && 'animate-flip-in',
        )}
      >
        {current ? (
          <>
            {/* Spreekwoord */}
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
              <LevelBadge level={level} />
            </div>

            {/* Betekenis */}
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
          <p className="py-8 text-center text-muted">Geen spreekwoorden voor dit niveau.</p>
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
          Volgend spreekwoord
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
          {spreekwoordenGame.howToPlay.map((step, i) => (
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
