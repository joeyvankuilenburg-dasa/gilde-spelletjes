import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Die } from './Die';
import type { DieFace } from './faces';
import { ModeSelector } from './ModeSelector';
import { SUB_MODES } from './modes';
import type { SubMode } from './modes';
import { THEMES } from './themes';
import type { DiceTheme } from '../../types/content';

export default function LetterDobbelsteenGame() {
  const [mode, setMode] = useState<SubMode>(SUB_MODES[0]!);
  const [theme, setTheme] = useState<DiceTheme>(THEMES[0]!);
  const [lastFace, setLastFace] = useState<DieFace | null>(null);

  const handleRoll = (face: DieFace) => {
    setLastFace(face);
  };

  const handleSelectMode = (next: SubMode) => {
    setMode(next);
    setLastFace(null);
  };

  const handleSelectTheme = (next: DiceTheme) => {
    setTheme(next);
    setLastFace(null);
  };

  const prompt = lastFace
    ? lastFace.kind === 'wild'
      ? mode.wildPrompt(mode.needsTheme ? theme.label : undefined)
      : mode.promptForLetter(lastFace.value, mode.needsTheme ? theme.label : undefined)
    : null;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Letter-dobbelsteen</h1>
        <p className="text-muted">
          Kies een spel, eventueel een thema, en tik op de dobbelsteen om te rollen.
        </p>
      </header>

      <ModeSelector
        selectedMode={mode}
        onSelectMode={handleSelectMode}
        selectedTheme={theme}
        onSelectTheme={handleSelectTheme}
      />

      <div className="flex flex-col items-center gap-4 py-2">
        <Die onRoll={handleRoll} />
        <span className="text-sm text-muted">Tik op de dobbelsteen om te rollen.</span>
      </div>

      <Card className="min-h-[120px] p-6 text-center">
        {prompt ? (
          <p
            key={`${mode.id}-${lastFace?.kind}-${lastFace?.kind === 'letter' ? lastFace.value : 'wild'}`}
            className="animate-pop text-xl font-bold leading-snug"
          >
            {prompt}
          </p>
        ) : (
          <p className="text-muted">Rol om een letter en opdracht te krijgen.</p>
        )}
      </Card>
    </div>
  );
}
