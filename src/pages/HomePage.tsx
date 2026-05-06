import { GameCard } from '../components/GameCard';
import { GAMES } from '../games';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
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
      </header>

      <section aria-label="Beschikbare spelletjes">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">Spelletjes</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {GAMES.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>
    </div>
  );
}
