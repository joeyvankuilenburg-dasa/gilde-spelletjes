import { lazy } from 'react';
import type { Game } from '../types';
import { RecordVoiceIcon } from '../icons';

export const nazeggenGame: Game = {
  id: 'nazeggen',
  path: '/nazeggen',
  title: 'Nazeggen',
  tagline: 'Luister, spreek na en vergelijk je eigen zin.',
  tag: 'Uitspraak',
  description:
    'Oefen korte Nederlandse zinnen met voorbeeldaudio. Opnames blijven lokaal in je browser en worden niet opgeslagen op een server.',
  howToPlay: [
    'Kies een niveau en een zin.',
    'Luister naar de voorbeeldzin.',
    'Spreek de zin na en luister eventueel naar jezelf.',
    'Markeer de zin als geoefend, moeilijk of bewaard.',
  ],
  icon: RecordVoiceIcon,
  supportsLevels: true,
  Component: lazy(() => import('./Game')),
};
