import { lazy } from 'react';
import type { Game } from '../types';
import { TheaterIcon } from '../icons';

export const taalSlamGame: Game = {
  id: 'taal-slam',
  path: '/taal-slam',
  title: 'Taal Slam',
  tagline: 'Schrijf korte spoken-word stukjes en draag ze voor.',
  tag: 'Creatief',
  description:
    'Speel met Nederlandse woorden, ritme en uitdrukkingen. De tips zijn regelgestuurd en werken volledig offline.',
  howToPlay: [
    'Kies een uitdaging: maak af, woordkaart of uitdrukking.',
    'Schrijf ongeveer vier regels in het Nederlands.',
    'Draag je tekst hardop voor of neem jezelf lokaal op.',
    'Vraag om basistips en probeer een nieuwe uitdaging.',
  ],
  icon: TheaterIcon,
  supportsLevels: true,
  Component: lazy(() => import('./Game')),
};
