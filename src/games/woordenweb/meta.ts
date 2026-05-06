import { lazy } from 'react';
import type { Game } from '../types';

export const woordenwebGame: Game = {
  id: 'woordenweb',
  path: '/woordenweb',
  title: 'Woordenweb',
  tagline: 'Noem zoveel mogelijk woorden rond één thema.',
  tag: 'Woordenschat',
  description:
    'Een centraal woord verschijnt op het scherm. Start de timer en noem zoveel mogelijk woorden die je eraan denkt — wie heeft er de meeste?',
  howToPlay: [
    'Kijk samen naar het woord op het scherm.',
    'Druk op Start en noem zoveel mogelijk verwante woorden.',
    'Na 60 seconden tellen jullie de woorden.',
    'Wie heeft er de meeste? Vergelijk en bespreek de woorden.',
  ],
  icon: () => null,
  supportsLevels: true,
  Component: lazy(() => import('./Game')),
};
