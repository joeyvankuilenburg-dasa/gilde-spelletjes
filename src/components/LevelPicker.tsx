import { LEVELS, type Level } from '../types/content';
import { cn } from '../lib/cn';

interface LevelPickerProps {
  value: Level;
  onChange: (level: Level) => void;
  className?: string;
  comingSoonLevels?: Level[];
}

export function LevelPicker({ value, onChange, className, comingSoonLevels = [] }: LevelPickerProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <span className="text-xs font-bold uppercase tracking-widest text-muted">Taalniveau</span>
      <div
        role="radiogroup"
        aria-label="Kies taalniveau"
        className="inline-flex rounded-xl border border-border bg-bg p-1"
      >
        {LEVELS.map((level) => {
          const selected = level === value;
          const comingSoon = comingSoonLevels.includes(level);
          return (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(level)}
              className={cn(
                'min-h-tap min-w-tap relative flex flex-1 flex-col items-center justify-center rounded-lg px-4 py-1 text-base font-bold transition-all duration-150',
                selected
                  ? 'bg-primary text-primary-fg shadow-sm'
                  : 'text-muted hover:bg-surface hover:text-ink',
              )}
            >
              {level}
              {comingSoon && (
                <span
                  className={cn(
                    'text-[9px] font-bold uppercase leading-none tracking-wide',
                    selected ? 'text-primary-fg/70' : 'text-muted/60',
                  )}
                >
                  binnenkort
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
