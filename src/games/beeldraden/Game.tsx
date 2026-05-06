import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Chip, GameTagBadge } from '../../components/ui/Badge';
import { useNoRepeatPicker } from '../../hooks/useNoRepeatPicker';
import { useCardFlip } from '../../hooks/useCardFlip';
import { cn } from '../../lib/cn';
import { beeldradenGame } from './meta';
import { IMAGE_PROMPTS } from './images';

export default function BeeldradenGame() {
  const { current, pick, remaining } = useNoRepeatPicker(IMAGE_PROMPTS);
  const { phase, flip } = useCardFlip();
  const [hintShown, setHintShown] = useState(false);

  useEffect(() => {
    pick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setHintShown(false);
  }, [current?.id]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-rounded text-[24px]" aria-hidden="true">
              image
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Beeldraden</h1>
          </div>
          <GameTagBadge tag={beeldradenGame.tag} />
        </div>
        <p className="text-sm text-muted">{beeldradenGame.description}</p>
      </header>

      {/* Fotokaart */}
      <Card
        className={cn(
          'overflow-hidden p-0',
          phase === 'out' && 'animate-flip-out',
          phase === 'in' && 'animate-flip-in',
        )}
      >
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
                <div className="flex items-start gap-2 rounded-xl bg-accent/10 p-3">
                  <span
                    className="material-symbols-rounded shrink-0 text-[20px] text-accent"
                    aria-hidden="true"
                  >
                    lightbulb
                  </span>
                  <p className="text-base italic text-ink">{current.hintCaption}</p>
                </div>
              ) : (
                <Button variant="secondary" onClick={() => setHintShown(true)}>
                  <span className="material-symbols-rounded text-[18px]" aria-hidden="true">
                    lightbulb
                  </span>
                  Toon hint
                </Button>
              )}
              {current.credit ? (
                <span className="text-xs text-muted">Foto: {current.credit}</span>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="p-8 text-center text-muted">Geen afbeeldingen beschikbaar.</p>
        )}
      </Card>

      <div className="flex flex-col items-center gap-2">
        <Button variant="accent" size="lg" onClick={() => flip(pick)}>
          <span className="material-symbols-rounded text-[22px]" aria-hidden="true">
            shuffle
          </span>
          Volgende foto
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
          {beeldradenGame.howToPlay.map((step, i) => (
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
