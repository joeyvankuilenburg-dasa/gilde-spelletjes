import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { onSam, type SamEventDetail } from '../lib/sam/events';
import { SamAvatar } from './SamAvatar';

function fireConfetti(big: boolean) {
  const baseOptions: confetti.Options = {
    spread: 70,
    startVelocity: 35,
    ticks: 200,
    origin: { y: 0.6 },
  };
  if (big) {
    confetti({ ...baseOptions, particleCount: 160, spread: 100, startVelocity: 45 });
    setTimeout(() => confetti({ ...baseOptions, particleCount: 80, origin: { x: 0.2, y: 0.7 } }), 200);
    setTimeout(() => confetti({ ...baseOptions, particleCount: 80, origin: { x: 0.8, y: 0.7 } }), 350);
  } else {
    confetti({ ...baseOptions, particleCount: 90 });
  }
}

export function Sam() {
  const [active, setActive] = useState<SamEventDetail | null>(null);

  useEffect(() => {
    return onSam((detail) => {
      setActive(detail);
      fireConfetti(detail.kind === 'big-milestone');
    });
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  if (!active) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sam"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center"
      onClick={() => setActive(null)}
    >
      <div
        className="relative w-full max-w-sm animate-pop rounded-2xl bg-surface p-6 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setActive(null)}
          aria-label="Sluiten"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl text-muted hover:bg-primary/10 hover:text-primary"
        >
          <span className="material-symbols-rounded text-[22px]" aria-hidden="true">
            close
          </span>
        </button>
        <div className="flex flex-col items-center gap-4 text-center">
          <SamAvatar variant="celebrate" className="h-32 w-32" />
          <div className="rounded-2xl bg-primary/10 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Sam</p>
            <p className="mt-1 text-lg font-bold text-ink">{active.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setActive(null)}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-fg hover:opacity-90"
          >
            Verder spelen
          </button>
        </div>
      </div>
    </div>
  );
}
