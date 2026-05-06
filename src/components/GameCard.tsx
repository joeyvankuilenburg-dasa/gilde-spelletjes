import { Link } from 'react-router-dom';
import type { Game } from '../games/types';
import { GameTagBadge, LevelBadge } from './ui/Badge';
import { LEVELS } from '../types/content';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const Icon = game.icon;
  return (
    <Link
      to={game.path}
      className="group flex flex-col gap-4 rounded-card bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      {/* Header: tag + niveau-label */}
      <div className="flex items-center justify-between gap-2">
        <GameTagBadge tag={game.tag} />
        <span className="text-xs font-bold text-muted">
          {game.supportsLevels ? 'A1 – B2' : 'Alle niveaus'}
        </span>
      </div>

      {/* Icoon + titel */}
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-fg"
        >
          <Icon className="text-[28px]" />
        </span>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-ink">{game.title}</span>
          <span className="text-sm text-muted">{game.tagline}</span>
        </div>
      </div>

      {/* Beschrijving */}
      <p className="text-sm leading-relaxed text-muted">{game.description}</p>

      {/* Hoe werkt het – bullets (Aidrian-stijl driver dots) */}
      <ul className="flex flex-col gap-1.5">
        {game.howToPlay.slice(0, 3).map((step, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-ink">
            <span
              aria-hidden="true"
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
            />
            {step}
          </li>
        ))}
      </ul>

      {/* Footer: niveau-badges + pijl */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {game.supportsLevels ? LEVELS.map((l) => <LevelBadge key={l} level={l} />) : null}
        </div>
        <span
          aria-hidden="true"
          className="material-symbols-rounded text-[20px] text-border transition-colors duration-200 group-hover:text-accent"
        >
          arrow_forward
        </span>
      </div>
    </Link>
  );
}
