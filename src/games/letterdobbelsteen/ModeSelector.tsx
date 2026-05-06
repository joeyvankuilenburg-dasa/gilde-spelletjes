import { cn } from '../../lib/cn';
import type { SubMode } from './modes';
import { SUB_MODES } from './modes';
import { THEMES } from './themes';
import type { DiceTheme } from '../../types/content';

interface ModeSelectorProps {
  selectedMode: SubMode;
  onSelectMode: (mode: SubMode) => void;
  selectedTheme: DiceTheme;
  onSelectTheme: (theme: DiceTheme) => void;
}

export function ModeSelector({
  selectedMode,
  onSelectMode,
  selectedTheme,
  onSelectTheme,
}: ModeSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold uppercase tracking-wide text-muted">Spel</span>
        <div role="radiogroup" aria-label="Kies een spelmodus" className="grid grid-cols-2 gap-2">
          {SUB_MODES.map((mode) => {
            const selected = mode.id === selectedMode.id;
            return (
              <button
                key={mode.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onSelectMode(mode)}
                className={cn(
                  'min-h-tap rounded-card border-2 p-3 text-left text-base font-bold transition-colors',
                  selected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-surface text-ink hover:border-primary/50',
                )}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
        <p className="text-sm text-muted">{selectedMode.description}</p>
      </div>

      {selectedMode.needsTheme ? (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold uppercase tracking-wide text-muted">Thema</span>
          <div role="radiogroup" aria-label="Kies een thema" className="flex flex-wrap gap-2">
            {THEMES.map((theme) => {
              const selected = theme.id === selectedTheme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onSelectTheme(theme)}
                  className={cn(
                    'min-h-tap rounded-full border-2 px-4 text-base font-bold transition-colors',
                    selected
                      ? 'border-primary bg-primary text-primary-fg'
                      : 'border-border bg-surface text-ink hover:border-primary/50',
                  )}
                >
                  {theme.emoji ? <span aria-hidden="true">{theme.emoji} </span> : null}
                  {theme.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
