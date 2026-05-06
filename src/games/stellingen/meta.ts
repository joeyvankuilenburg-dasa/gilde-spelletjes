import { lazy } from 'react';
import type { Game } from '../types';
import { BalanceIcon } from '../icons';

export const stellingenGame: Game = {
  id: 'stellingen',
  path: '/stellingen',
  title: "Stellingen & dilemma's",
  tagline: 'Wat vind jij? Geef je mening over een stelling.',
  tag: 'Mening geven',
  description:
    'Een stelling verschijnt op het scherm. Elk van jullie geeft zijn of haar mening — er is geen goed of fout antwoord. Juist het gesprek erover telt.',
  howToPlay: [
    'Kies een taalniveau (A1 t/m B2).',
    'Lees de stelling hardop voor.',
    'Geef allebei je mening: ben je het eens of oneens, en waarom?',
    'Druk op "Volgende stelling" voor een nieuw dilemma.',
  ],
  icon: BalanceIcon,
  supportsLevels: true,
  Component: lazy(() => import('./Game')),
};
