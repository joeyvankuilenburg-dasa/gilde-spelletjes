import { useState } from 'react';
import { Button } from './ui/Button';
import { useOnboarding } from '../hooks/useOnboarding';

const SLIDES = [
  {
    icon: 'waving_hand',
    title: 'Welkom bij GSSL Spelletjes!',
    body: 'Deze app helpt taalmaatjes en deelnemers om gesprekken op gang te brengen. Samen kiezen jullie een spelletje en gaan jullie aan de slag.',
  },
  {
    icon: 'swap_horiz',
    title: 'Hoe werkt het?',
    body: 'Kies een spelletje op de startpagina. Tik op de knop om een nieuw onderwerp, stelling of foto te krijgen. Geen twee keer hetzelfde — totdat alles een keer voorbij is gekomen.',
  },
  {
    icon: 'sports_esports',
    title: 'De spelletjes',
    body: 'Onderwerpen & stellingen om over te praten, Beeldraden om bij te beschrijven, en een Letter-dobbelsteen voor een woordspelletje. Elk spelletje heeft een niveau-filter (A1–B2).',
  },
  {
    icon: 'celebration',
    title: 'Klaar om te beginnen!',
    body: 'Leg de telefoon of laptop neer zodat jullie allebei kunnen meekijken — en veel plezier!',
  },
] as const;

export function Onboarding() {
  const { complete } = useOnboarding();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  const next = () => {
    if (isLast) {
      complete();
    } else {
      setIndex((i) => i + 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={slide.title}
    >
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl bg-surface p-8 shadow-[0_24px_64px_rgba(0,0,0,.25)]">
        {/* Icon */}
        <div className="flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <span className="material-symbols-rounded text-[36px] text-primary" aria-hidden="true">
              {slide.icon}
            </span>
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-xl font-bold leading-snug text-ink">{slide.title}</h2>
          <p className="text-base leading-relaxed text-muted">{slide.body}</p>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2" aria-hidden="true">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-all duration-200 ${i === index ? 'w-5 bg-primary' : 'bg-border'}`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button variant="accent" size="lg" onClick={next}>
            {isLast ? 'Begin!' : 'Volgende'}
          </Button>
          {!isLast && (
            <button
              type="button"
              onClick={complete}
              className="py-1 text-sm text-muted hover:text-ink"
            >
              Overslaan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
