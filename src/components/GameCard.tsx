import { Link } from 'react-router-dom';
import type { Game } from '../games/types';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const Icon = game.icon;
  return (
    <Link
      to={game.path}
      className="group flex min-h-[120px] items-center gap-4 rounded-card border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md focus-visible:-translate-y-0.5 focus-visible:border-primary/50"
    >
      <span
        aria-hidden="true"
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-fg"
      >
        <Icon className="h-8 w-8" />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-xl font-bold text-ink">{game.title}</span>
        <span className="text-base text-muted">{game.tagline}</span>
      </span>
    </Link>
  );
}
