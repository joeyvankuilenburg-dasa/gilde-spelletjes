import { GameCard } from '../components/GameCard';
import { GAMES } from '../games';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Spelletjes</h1>
        <p className="text-muted">Kies een spel om samen te spelen met je taalmaatje.</p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {GAMES.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
