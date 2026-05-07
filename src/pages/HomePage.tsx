import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameCard } from '../components/GameCard';
import { Chip } from '../components/ui/Badge';
import { GAMES } from '../games';
import type { GameTag } from '../games/types';

const TAGS: GameTag[] = [
  'Spreken',
  'Mening geven',
  'Beschrijven',
  'Raden',
  'Rollenspel',
  'Woordenschat',
];

export default function HomePage() {
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState<GameTag | null>(null);
  const visibleGames = activeTag ? GAMES.filter((g) => g.tag === activeTag) : GAMES;

  const goToRandomGame = () => {
    const game = GAMES[Math.floor(Math.random() * GAMES.length)];
    navigate(game.path);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Verras me */}
      <button
        type="button"
        onClick={goToRandomGame}
        className="flex w-full items-center justify-center gap-2 rounded-card bg-accent px-5 py-4 font-bold text-accent-fg shadow-sm transition-all hover:bg-accent/90 active:scale-[0.98]"
      >
        <span className="material-symbols-rounded text-[22px]" aria-hidden="true">
          casino
        </span>
        Verras me — kies een willekeurig spel
      </button>

      {/* Filter */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">Filter op type</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter op type">
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
                    ? 'rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-fg'
                    : 'rounded-full bg-surface px-3 py-1.5 text-xs font-bold text-muted shadow-card hover:text-ink'
                }
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

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
