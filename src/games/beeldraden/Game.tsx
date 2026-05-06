import { useEffect, useMemo, useState } from 'react';
import { LevelPicker } from '../../components/LevelPicker';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useLevelFilter } from '../../hooks/useLevelFilter';
import { useNoRepeatPicker } from '../../hooks/useNoRepeatPicker';
import { IMAGE_PROMPTS } from './images';

export default function BeeldradenGame() {
  const [level, setLevel] = useLevelFilter();
  const filtered = useMemo(
    () => IMAGE_PROMPTS.filter((img) => img.levels.includes(level)),
    [level],
  );
  const { current, pick, remaining } = useNoRepeatPicker(filtered);
  const [hintShown, setHintShown] = useState(false);

  useEffect(() => {
    if (filtered.length > 0) pick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  useEffect(() => {
    setHintShown(false);
  }, [current?.id]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-rounded text-[24px]" aria-hidden="true">
            image
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Beeldraden</h1>
        </div>
        <p className="text-sm text-muted">
          Beschrijf samen wat je op de foto ziet. Hulp nodig? Toon de hint.
        </p>
      </header>

      <LevelPicker value={level} onChange={setLevel} />

      <Card className="overflow-hidden p-0">
        {current ? (
          <div key={current.id} className="animate-pop">
            <img
              src={current.src}
              alt={current.alt}
              className="aspect-[4/3] w-full object-cover"
              loading="eager"
            />
            <div className="flex flex-col gap-3 p-5">
              {hintShown && current.hintCaption ? (
                <p className="text-lg italic text-ink">Hint: {current.hintCaption}</p>
              ) : (
                <Button variant="secondary" onClick={() => setHintShown(true)}>
                  Toon hint
                </Button>
              )}
              {current.credit ? (
                <span className="text-xs text-muted">Foto: {current.credit}</span>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="p-8 text-center text-muted">Geen afbeeldingen voor dit niveau.</p>
        )}
      </Card>

      <div className="flex flex-col items-center gap-2">
        <Button variant="accent" size="lg" onClick={pick} disabled={filtered.length === 0}>
          <span className="material-symbols-rounded text-[22px]" aria-hidden="true">
            shuffle
          </span>
          Volgende foto
        </Button>
        <span className="text-sm text-muted" aria-live="polite">
          Nog {remaining} ongezien op niveau {level}.
        </span>
      </div>
    </div>
  );
}
