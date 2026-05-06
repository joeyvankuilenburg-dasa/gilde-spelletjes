import { useEffect, useMemo } from 'react';
import { LevelPicker } from '../../components/LevelPicker';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useLevelFilter } from '../../hooks/useLevelFilter';
import { useNoRepeatPicker } from '../../hooks/useNoRepeatPicker';
import { TOPICS } from './data';

export default function OnderwerpenGame() {
  const [level, setLevel] = useLevelFilter();
  const filtered = useMemo(() => TOPICS.filter((t) => t.levels.includes(level)), [level]);
  const { current, pick, remaining } = useNoRepeatPicker(filtered);

  useEffect(() => {
    if (filtered.length > 0) pick();
    // pick once when level changes; intentionally omitted from deps to avoid re-pick loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-rounded text-[24px]" aria-hidden="true">
            forum
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Onderwerpen</h1>
        </div>
        <p className="text-sm text-muted">
          Druk op de knop voor een willekeurig gespreksonderwerp.
        </p>
      </header>

      <LevelPicker value={level} onChange={setLevel} />

      <Card className="flex min-h-[220px] flex-col items-center justify-center gap-4 p-8 text-center">
        {current ? (
          <p key={current.id} className="animate-pop text-2xl font-bold leading-snug text-ink">
            {current.text}
          </p>
        ) : (
          <p className="text-muted">Geen onderwerpen voor dit niveau.</p>
        )}
      </Card>

      <div className="flex flex-col items-center gap-2">
        <Button variant="accent" size="lg" onClick={pick} disabled={filtered.length === 0}>
          <span className="material-symbols-rounded text-[22px]" aria-hidden="true">
            shuffle
          </span>
          Volgend onderwerp
        </Button>
        <span className="text-sm text-muted" aria-live="polite">
          Nog {remaining} ongezien op niveau {level}.
        </span>
      </div>
    </div>
  );
}
