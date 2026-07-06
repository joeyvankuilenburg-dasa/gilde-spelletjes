import type { Game } from './types';
import { onderwerpenGame } from './onderwerpen/meta';
import { stellingenGame } from './stellingen/meta';
import { beeldradenGame } from './beeldraden/meta';
import { letterDobbelsteenGame } from './letterdobbelsteen/meta';
import { situatiesGame } from './situaties/meta';
import { woordenwebGame } from './woordenweb/meta';
import { wieWatBenIkGame } from './wiewatbenik/meta';
import { spreekwoordenGame } from './spreekwoorden/meta';
import { aiGesprekGame } from './ai-gesprek/meta';
import { oefenvragenGame } from './oefenvragen/meta';
import { promptkaartenGame } from './promptkaarten/meta';
import { nazeggenGame } from './nazeggen/meta';
import { uitspraakoefeningGame } from './uitspraakoefening/meta';
import { taalSlamGame } from './taal-slam/meta';

export const GAMES: Game[] = [
  onderwerpenGame,
  stellingenGame,
  beeldradenGame,
  letterDobbelsteenGame,
  situatiesGame,
  woordenwebGame,
  wieWatBenIkGame,
  spreekwoordenGame,
  aiGesprekGame,
  oefenvragenGame,
  promptkaartenGame,
  nazeggenGame,
  uitspraakoefeningGame,
  taalSlamGame,
];
