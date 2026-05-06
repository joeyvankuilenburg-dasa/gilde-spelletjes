import { useState } from 'react';
import { GameCard } from '../components/GameCard';
import { Chip } from '../components/ui/Badge';
import { GAMES } from '../games';
import type { GameTag } from '../games/types';

const TAGS: GameTag[] = ['Spreken', 'Mening geven', 'Beschrijven', 'Raden'];

export default function HomePage() {
  const [activeTag, setActiveTag] = useState<GameTag | null>(null);
  const visibleGames = activeTag ? GAMES.filter((g) => g.tag === activeTag) : GAMES;

  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <header className="flex flex-col gap-3 rounded-card bg-primary p-6 text-primary-fg shadow-die">
        <div className="flex items-center gap-3">
          <span className="material-symbols-rounded text-[32px] text-accent" aria-hidden="true">
            translate
          </span>
          <h1 className="text-2xl font-bold tracking-tight">GSSL Spelletjes</h1>
        </div>
        <p className="text-base leading-relaxed text-primary-fg/80">
          Kies een spel om samen mee te starten. Geen voorbereiding nodig.
        </p>
        <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Filter op type">
          {TAGS.map((t) => {
            const isActive = activeTag === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTag(isActive ? null : t)}
                aria-pressed={isActive}
                className={
                  isActive
                    ? 'rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-primary'
                    : 'rounded-full bg-primary-fg/10 px-2.5 py-1 text-xs font-bold text-primary-fg/80 hover:bg-primary-fg/20'
                }
              >
                {t}
              </button>
            );
          })}
        </div>
      </header>

      {/* Spelletjes */}
      <section aria-label="Beschikbare spelletjes">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted">
            {activeTag ? `Spelletjes met "${activeTag}"` : 'Spelletjes'}
          </h2>
          <Chip>
            <span className="material-symbols-rounded text-[12px]" aria-hidden="true">
              grid_view
            </span>
            {visibleGames.length} {visibleGames.length === 1 ? 'spel' : 'spellen'}
          </Chip>
        </div>
        {visibleGames.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {visibleGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">Geen spelletjes met dit type.</p>
        )}
      </section>
    </div>
  );
}
