export interface SubMode {
  id: 'iksie' | 'beginklank' | 'eindklank' | 'thema';
  label: string;
  description: string;
  promptForLetter(letter: string, themeLabel?: string): string;
  wildPrompt(themeLabel?: string): string;
  needsTheme?: boolean;
}

export const SUB_MODES: SubMode[] = [
  {
    id: 'iksie',
    label: 'Ik zie, ik zie…',
    description:
      'Eén speler ziet iets in de kamer dat met deze letter begint. De ander raadt wat het is.',
    promptForLetter: (letter) =>
      `Ik zie, ik zie wat jij niet ziet en het begint met de letter ${letter}.`,
    wildPrompt: () => 'Wild! Kies zelf een letter en speel "Ik zie, ik zie…".',
  },
  {
    id: 'beginklank',
    label: 'Beginklank',
    description: 'Maak een woord dat met deze letter begint.',
    promptForLetter: (letter) => `Maak een woord dat begint met de letter ${letter}.`,
    wildPrompt: () => 'Wild! Kies zelf een letter en maak een woord dat ermee begint.',
  },
  {
    id: 'eindklank',
    label: 'Eindklank',
    description: 'Maak een woord dat eindigt op deze letter.',
    promptForLetter: (letter) => `Maak een woord dat eindigt op de letter ${letter}.`,
    wildPrompt: () => 'Wild! Kies zelf een letter en maak een woord dat erop eindigt.',
  },
  {
    id: 'thema',
    label: 'Thema + letter',
    description: 'Spreek een thema af en maak een woord uit dat thema met deze letter.',
    promptForLetter: (letter, themeLabel) =>
      `Maak een woord uit het thema "${themeLabel ?? '…'}" met de letter ${letter}.`,
    wildPrompt: (themeLabel) =>
      `Wild! Kies zelf een letter en maak een woord uit het thema "${themeLabel ?? '…'}".`,
    needsTheme: true,
  },
];
