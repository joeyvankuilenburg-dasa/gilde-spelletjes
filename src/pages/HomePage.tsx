import { GameCard } from '../components/GameCard';
import { Chip } from '../components/ui/Badge';
import { GAMES } from '../games';

export default function HomePage() {
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
        <div className="flex flex-wrap gap-2 pt-1">
          {['Spreken', 'Mening geven', 'Beschrijven', 'Raden'].map((t) => (
            <span
              key={t}
              className="rounded-full bg-primary-fg/10 px-2.5 py-1 text-xs font-bold text-primary-fg/80"
            >
              {t}
            </span>
          ))}
        </div>
      </header>

      {/* Spelletjes */}
      <section aria-label="Beschikbare spelletjes">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted">Spelletjes</h2>
          <Chip>
            <span className="material-symbols-rounded text-[12px]" aria-hidden="true">
              grid_view
            </span>
            {GAMES.length} spellen
          </Chip>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {GAMES.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>
    </div>
  );
}
