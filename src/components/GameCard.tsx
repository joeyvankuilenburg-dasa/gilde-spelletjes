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
      className="group flex min-h-[128px] items-center gap-5 rounded-card border-none bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <span
        aria-hidden="true"
        className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-fg"
      >
        <Icon className="text-[32px]" />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-xl font-bold text-ink">{game.title}</span>
        <span className="text-sm text-muted">{game.tagline}</span>
      </span>
      <span
        aria-hidden="true"
        className="material-symbols-rounded ml-auto shrink-0 text-[20px] text-border transition-colors duration-200 group-hover:text-accent"
      >
        chevron_right
      </span>
    </Link>
  );
}
