import { useEffect, useMemo } from 'react';
import { LevelPicker } from '../../components/LevelPicker';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useLevelFilter } from '../../hooks/useLevelFilter';
import { useNoRepeatPicker } from '../../hooks/useNoRepeatPicker';
import { STATEMENTS } from './data';

export default function StellingenGame() {
  const [level, setLevel] = useLevelFilter();
  const filtered = useMemo(() => STATEMENTS.filter((s) => s.levels.includes(level)), [level]);
  const { current, pick, remaining } = useNoRepeatPicker(filtered);

  useEffect(() => {
    if (filtered.length > 0) pick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Stellingen &amp; dilemma's</h1>
        <p className="text-muted">
          Wat vind jij? Lees de stelling en geef ieder je eigen antwoord.
        </p>
      </header>

      <LevelPicker value={level} onChange={setLevel} />

      <Card className="flex min-h-[220px] flex-col items-center justify-center gap-4 p-8 text-center">
        {current ? (
          <p key={current.id} className="animate-pop text-2xl font-bold leading-snug text-ink">
            {current.text}
          </p>
        ) : (
          <p className="text-muted">Geen stellingen voor dit niveau.</p>
        )}
      </Card>

      <div className="flex flex-col items-center gap-2">
        <Button size="lg" onClick={pick} disabled={filtered.length === 0}>
          Volgende stelling
        </Button>
        <span className="text-sm text-muted" aria-live="polite">
          Nog {remaining} ongezien op niveau {level}.
        </span>
      </div>
    </div>
  );
}
