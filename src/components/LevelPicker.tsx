import { LEVELS, type Level } from '../types/content';
import { cn } from '../lib/cn';

interface LevelPickerProps {
  value: Level;
  onChange: (level: Level) => void;
  className?: string;
}

export function LevelPicker({ value, onChange, className }: LevelPickerProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <span className="text-sm font-bold uppercase tracking-wide text-muted">Taalniveau</span>
      <div
        role="radiogroup"
        aria-label="Kies taalniveau"
        className="inline-flex rounded-full border border-border bg-surface p-1"
      >
        {LEVELS.map((level) => {
          const selected = level === value;
          return (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(level)}
              className={cn(
                'min-h-tap min-w-tap flex-1 rounded-full px-4 text-base font-bold transition-colors',
                selected ? 'bg-primary text-primary-fg shadow-sm' : 'text-ink hover:bg-ink/5',
              )}
            >
              {level}
            </button>
          );
        })}
      </div>
    </div>
  );
}
