import { lazy } from 'react';
import type { Game } from '../types';
import { QuoteIcon } from '../icons';

export const spreekwoordenGame: Game = {
  id: 'spreekwoorden',
  path: '/spreekwoorden',
  title: 'Spreekwoorden',
  tagline: 'Raad de betekenis van Nederlandse spreekwoorden en uitdrukkingen.',
  tag: 'Spreken',
  description:
    'Een Nederlands spreekwoord of uitdrukking verschijnt op het scherm. Bespreek wat je denkt dat het betekent — en onthul daarna de uitleg.',
  howToPlay: [
    'Lees het spreekwoord hardop voor.',
    'Bespreek samen wat jullie denken dat het betekent.',
    'Tik op "Toon betekenis" om de uitleg te zien.',
    'Ken jij een vergelijkbaar spreekwoord uit jouw taal?',
  ],
  icon: QuoteIcon,
  supportsLevels: true,
  Component: lazy(() => import('./Game')),
};
