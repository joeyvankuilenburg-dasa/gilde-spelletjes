import type { Level } from '../../../types/content';

/**
 * Hardcoded content for the "Taal Slam" game — a creative spoken-word
 * exercise. Learners build and perform short 4-line Dutch pieces.
 *
 * Three game modes, each leveled A1–B2 and sorted by level:
 *  - FinishSlam     → the app gives the first line, the learner finishes it.
 *  - WordCardSlam   → the learner must use 3–5 given words.
 *  - ExpressionSlam → the learner must use one Dutch expression.
 *
 * Nothing is auto-graded as "correct" — the goal is playful, confident
 * speaking. The UI does give light, deterministic feedback (which required
 * words / expression appear in the text).
 */

export type SlamLevel = Extract<Level, 'A1' | 'A2' | 'B1' | 'B2'>;

/** Target number of lines for a slam. */
export const SLAM_LINES = 4;

export interface SlamExpressionHint {
  phrase: string;
  meaning: string;
}

export interface FinishSlam {
  id: string;
  level: SlamLevel;
  theme: string;
  /** The opening line the learner continues from. */
  firstLine: string;
  /** Helpful vocabulary to keep going. */
  suggestedWords: string[];
  /** Optional expression they may weave in. */
  expression?: SlamExpressionHint;
}

export interface WordCardSlam {
  id: string;
  level: SlamLevel;
  theme: string;
  /** 3–5 words that must appear in the slam. */
  requiredWords: string[];
}

export interface ExpressionSlam {
  id: string;
  level: SlamLevel;
  theme: string;
  expression: string;
  meaning: string;
  /** Extra words that fit the theme (not required). */
  suggestedWords: string[];
}

export const FINISH_SLAMS: FinishSlam[] = [
  {
    id: 'finish-eerste-dag',
    level: 'A1',
    theme: 'Mijn eerste dag in Nederland',
    firstLine: 'Ik ben nieuw hier, ik ken nog niet veel.',
    suggestedWords: ['hallo', 'huis', 'straat', 'nieuw', 'leren'],
  },
  {
    id: 'finish-regen-fiets',
    level: 'A1',
    theme: 'Regen, fiets en patat',
    firstLine: 'Het regent buiten, ik pak mijn fiets.',
    suggestedWords: ['regen', 'fiets', 'nat', 'koud', 'patat'],
  },
  {
    id: 'finish-wat-ik-voel',
    level: 'A2',
    theme: 'Vandaag zeg ik wat ik voel',
    firstLine: 'Vandaag ben ik blij, ik weet niet waarom.',
    suggestedWords: ['blij', 'lachen', 'zon', 'vriend', 'dag'],
  },
  {
    id: 'finish-gewoonte',
    level: 'A2',
    theme: 'Een vreemde Nederlandse gewoonte',
    firstLine: 'De mensen hier eten brood bij de lunch.',
    suggestedWords: ['brood', 'kaas', 'vreemd', 'samen', 'gewoon'],
  },
  {
    id: 'finish-ik-mis-thuis',
    level: 'B1',
    theme: 'Ik mis thuis, maar ik leer door',
    firstLine: 'Soms mis ik mijn land, de geur en de zon.',
    suggestedWords: ['missen', 'thuis', 'herinnering', 'doorgaan', 'hoop'],
    expression: {
      phrase: 'met vallen en opstaan',
      meaning: 'met kleine fouten toch steeds vooruitkomen',
    },
  },
  {
    id: 'finish-oefenen-trots',
    level: 'B1',
    theme: 'Oefenen, fouten en trots',
    firstLine: 'Ik oefen elke dag, ook als het moeilijk is.',
    suggestedWords: ['oefenen', 'fout', 'trots', 'moeilijk', 'geduld'],
    expression: { phrase: 'de moed niet opgeven', meaning: 'blijven proberen, niet stoppen' },
  },
  {
    id: 'finish-twee-talen',
    level: 'B2',
    theme: 'Tussen twee talen',
    firstLine: 'Ik leef tussen twee talen, twee werelden, één hart.',
    suggestedWords: ['taal', 'wereld', 'identiteit', 'brug', 'thuis'],
    expression: { phrase: 'je draai vinden', meaning: 'wennen en je op je gemak gaan voelen' },
  },
  {
    id: 'finish-wat-ik-leerde',
    level: 'B2',
    theme: 'Wat ik geleerd heb',
    firstLine: 'Een jaar geleden zweeg ik, nu durf ik te spreken.',
    suggestedWords: ['durven', 'groeien', 'stem', 'veranderen', 'toekomst'],
    expression: {
      phrase: 'over je eigen schaduw heen stappen',
      meaning: 'je angst of twijfel overwinnen',
    },
  },
];

export const WORD_CARD_SLAMS: WordCardSlam[] = [
  {
    id: 'words-op-de-fiets',
    level: 'A1',
    theme: 'Op de fiets',
    requiredWords: ['fiets', 'regen', 'nat', 'koud'],
  },
  {
    id: 'words-in-huis',
    level: 'A1',
    theme: 'In huis',
    requiredWords: ['huis', 'tafel', 'stoel', 'warm'],
  },
  {
    id: 'words-op-de-markt',
    level: 'A2',
    theme: 'Op de markt',
    requiredWords: ['markt', 'kopen', 'geld', 'vraag', 'lekker'],
  },
  {
    id: 'words-gewone-dag',
    level: 'A2',
    theme: 'Een gewone dag',
    requiredWords: ['opstaan', 'werken', 'eten', 'moe'],
  },
  {
    id: 'words-vallen-opstaan',
    level: 'B1',
    theme: 'Leren met vallen en opstaan',
    requiredWords: ['oefenen', 'fout', 'trots', 'moeilijk', 'lachen'],
  },
  {
    id: 'words-de-stad-in',
    level: 'B1',
    theme: 'De stad in',
    requiredWords: ['straat', 'mensen', 'haast', 'geluid', 'vrij'],
  },
  {
    id: 'words-gevoelens',
    level: 'B2',
    theme: 'Gevoelens in een nieuw land',
    requiredWords: ['onzeker', 'hoop', 'heimwee', 'moed', 'groeien'],
  },
  {
    id: 'words-mijn-stem',
    level: 'B2',
    theme: 'Mijn stem',
    requiredWords: ['zwijgen', 'durven', 'spreken', 'veranderen', 'kracht'],
  },
];

export const EXPRESSION_SLAMS: ExpressionSlam[] = [
  {
    id: 'expr-goed-bezig',
    level: 'A1',
    theme: 'Een kleine overwinning',
    expression: 'Goed bezig',
    meaning: 'Je doet het goed — een aanmoediging.',
    suggestedWords: ['leren', 'proberen', 'blij', 'trots'],
  },
  {
    id: 'expr-stap-voor-stap',
    level: 'A1',
    theme: 'Langzaam leren',
    expression: 'Stap voor stap',
    meaning: 'Rustig en beetje bij beetje vooruit.',
    suggestedWords: ['langzaam', 'beetje', 'elke dag', 'vooruit'],
  },
  {
    id: 'expr-beter-laat',
    level: 'A2',
    theme: 'Eindelijk durf ik',
    expression: 'Beter laat dan nooit',
    meaning: 'Iets te laat doen is nog altijd beter dan helemaal niet.',
    suggestedWords: ['durven', 'beginnen', 'eindelijk', 'laat'],
  },
  {
    id: 'expr-oefening-kunst',
    level: 'A2',
    theme: 'Elke dag oefenen',
    expression: 'Oefening baart kunst',
    meaning: 'Door veel te oefenen word je ergens goed in.',
    suggestedWords: ['oefenen', 'beter', 'geduld', 'herhalen'],
  },
  {
    id: 'expr-vallen-opstaan',
    level: 'B1',
    theme: 'Leren door fouten',
    expression: 'Met vallen en opstaan',
    meaning: 'Met kleine mislukkingen toch steeds vooruitkomen.',
    suggestedWords: ['fout', 'opstaan', 'doorgaan', 'trots'],
  },
  {
    id: 'expr-onder-de-knie',
    level: 'B1',
    theme: 'Eindelijk lukt het',
    expression: 'Ik heb het onder de knie',
    meaning: 'Ik kan het nu goed; ik beheers het.',
    suggestedWords: ['lukken', 'oefenen', 'trots', 'moeilijk'],
  },
  {
    id: 'expr-kat-uit-de-boom',
    level: 'B1',
    theme: 'Voorzichtig beginnen',
    expression: 'De kat uit de boom kijken',
    meaning: 'Eerst rustig afwachten voordat je iets doet.',
    suggestedWords: ['wachten', 'kijken', 'rustig', 'durven'],
  },
  {
    id: 'expr-hart-op-tong',
    level: 'B2',
    theme: 'Vandaag zeg ik wat ik voel',
    expression: 'Je hart op je tong hebben',
    meaning: 'Precies zeggen wat je voelt of denkt.',
    suggestedWords: ['gevoel', 'eerlijk', 'stem', 'durven'],
  },
  {
    id: 'expr-tegen-de-stroom',
    level: 'B2',
    theme: 'Mijn eigen weg',
    expression: 'Tegen de stroom in roeien',
    meaning: 'Iets doen wat moeilijk is en tegen de verwachting ingaat.',
    suggestedWords: ['moeilijk', 'volhouden', 'anders', 'sterk'],
  },
];

/** All levels that appear across the three modes, in CEFR order. */
export const SLAM_LEVELS: SlamLevel[] = (['A1', 'A2', 'B1', 'B2'] as SlamLevel[]).filter(
  (level) =>
    FINISH_SLAMS.some((s) => s.level === level) ||
    WORD_CARD_SLAMS.some((s) => s.level === level) ||
    EXPRESSION_SLAMS.some((s) => s.level === level),
);
