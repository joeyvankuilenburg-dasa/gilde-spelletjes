import { lazy } from 'react';
import type { Game } from '../types';
import { PsychologyIcon } from '../icons';

export const oefenvragenGame: Game = {
  id: 'oefenvragen',
  path: '/oefenvragen',
  title: 'Oefenvragen',
  tagline: 'Beantwoord spreekvragen en krijg meteen basistips.',
  tag: 'Zelf oefenen',
  description:
    'Oefen korte antwoorden op Nederlandse vragen. De feedback is regelgestuurd en werkt zonder internet of account.',
  howToPlay: [
    'Kies je taalniveau.',
    'Lees de vraag en antwoord hardop of typ je antwoord.',
    'Bekijk de tip en eventueel een betere voorbeeldzin.',
    'Ga door naar de volgende vraag.',
  ],
  icon: PsychologyIcon,
  supportsLevels: true,
  Component: lazy(() => import('./Game')),
};
