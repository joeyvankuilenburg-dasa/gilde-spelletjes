import { cn } from '../../lib/cn';

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface TimerProps {
  remaining: number;
  total: number;
  state: 'idle' | 'running' | 'done';
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function Timer({ remaining, total, state, onStart, onPause, onReset }: TimerProps) {
  const progress = remaining / total;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const ringColor =
    progress > 0.5 ? 'text-accent' : progress > 0.2 ? 'text-yellow-400' : 'text-red-500';

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeLabel = `${minutes}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Ring */}
      <div className="relative flex items-center justify-center">
        <svg width="100" height="100" className="-rotate-90">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            strokeWidth="6"
            className="text-border"
            stroke="currentColor"
          />
          {/* Progress arc */}
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            stroke="currentColor"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            className={cn('transition-all duration-1000 ease-linear', ringColor)}
          />
        </svg>
        {/* Number */}
        <span
          className={cn(
            'absolute text-2xl font-bold tabular-nums',
            state === 'done' ? 'text-red-500' : 'text-ink',
          )}
        >
          {state === 'done' ? '0:00' : timeLabel}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        {state === 'running' ? (
          <button
            type="button"
            onClick={onPause}
            className="flex items-center gap-1.5 rounded-xl bg-surface px-4 py-2 text-sm font-bold text-ink shadow-card hover:shadow-card-hover"
          >
            <span className="material-symbols-rounded text-[18px]" aria-hidden="true">
              pause
            </span>
            Pauze
          </button>
        ) : state === 'done' ? (
          <span className="rounded-xl bg-red-100 px-4 py-2 text-sm font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400">
            Tijd is om!
          </span>
        ) : (
          <button
            type="button"
            onClick={onStart}
            className="flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2 text-sm font-bold text-white shadow-card hover:opacity-90"
          >
            <span className="material-symbols-rounded text-[18px]" aria-hidden="true">
              play_arrow
            </span>
            Start
          </button>
        )}
        {state !== 'idle' && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-xl bg-surface px-4 py-2 text-sm font-bold text-muted shadow-card hover:text-ink"
          >
            <span className="material-symbols-rounded text-[18px]" aria-hidden="true">
              replay
            </span>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
