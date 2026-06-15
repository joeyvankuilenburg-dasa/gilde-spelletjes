import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { GameTagBadge } from '../../components/ui/Badge';
import { SamExplains } from '../../components/SamExplains';
import { Die } from './Die';
import type { DieFace } from './faces';
import { ModeSelector } from './ModeSelector';
import { SUB_MODES } from './modes';
import type { SubMode } from './modes';
import { THEMES } from './themes';
import type { DiceTheme } from '../../types/content';
import { letterDobbelsteenGame } from './meta';

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
      {/* Header */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-rounded text-[24px]" aria-hidden="true">
              casino
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Letter-dobbelsteen</h1>
          </div>
          <GameTagBadge tag={letterDobbelsteenGame.tag} />
        </div>
        <p className="text-sm text-muted">{letterDobbelsteenGame.description}</p>
      </header>

      <ModeSelector
        selectedMode={mode}
        onSelectMode={handleSelectMode}
        selectedTheme={theme}
        onSelectTheme={handleSelectTheme}
      />

      {/* Dobbelsteen */}
      <div className="flex flex-col items-center gap-3 py-2">
        <Die onRoll={handleRoll} />
        <p className="text-sm text-muted">Tik op de dobbelsteen om te rollen.</p>
      </div>

      {/* Resultaat */}
      <Card className="min-h-[100px] p-6 text-center">
        {prompt ? (
          <p
            key={`${mode.id}-${lastFace?.kind}-${lastFace?.kind === 'letter' ? lastFace.value : 'wild'}`}
            className="animate-pop text-xl font-bold leading-snug"
          >
            {prompt}
          </p>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <p className="text-muted">Rol om een letter en opdracht te krijgen.</p>
            <p className="text-xs text-muted">
              Huidige modus: <span className="font-bold text-ink">{mode.label}</span>
            </p>
          </div>
        )}
      </Card>

      {/* Hoe werkt het */}
      <SamExplains steps={letterDobbelsteenGame.howToPlay} />
    </div>
  );
}
