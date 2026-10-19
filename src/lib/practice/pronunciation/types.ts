export type PronunciationTheme =
  | 'kennismaken'
  | 'familie'
  | 'wonen'
  | 'eten'
  | 'boodschappen'
  | 'dagelijks'
  | 'vrije_tijd'
  | 'weer'
  | 'werk'
  | 'reizen'
  | 'gezondheid'
  | 'school'
  | 'geld'
  | 'kleding'
  | 'lichaam'
  | 'dieren'
  | 'mening'
  | 'maatschappij'
  | 'formeel'
  | 'overig';

export const THEME_LABELS: Record<PronunciationTheme, string> = {
  kennismaken: 'Kennismaken',
  familie: 'Familie',
  wonen: 'Wonen',
  eten: 'Eten & drinken',
  boodschappen: 'Boodschappen',
  dagelijks: 'Dagelijks leven',
  vrije_tijd: 'Vrije tijd',
  weer: 'Weer & natuur',
  werk: 'Werk',
  reizen: 'Reizen & vervoer',
  gezondheid: 'Gezondheid',
  school: 'School & leren',
  geld: 'Geld & zakelijk',
  kleding: 'Kleding',
  lichaam: 'Lichaam',
  dieren: 'Dieren',
  mening: 'Mening & gevoelens',
  maatschappij: 'Maatschappij',
  formeel: 'Formeel & officieel',
  overig: 'Overig',
};

export interface PronunciationWord {
  id: string;
  word: string;
  /** Optional spoken form for abbreviations and written contractions. */
  ttsText?: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  theme: PronunciationTheme;
  grammar?: string;
  exampleSentence: string;
}

export type WordStatus = 'new' | 'practicing' | 'mastered' | 'difficult';

export interface WordProgress {
  attempts: number;
  status: WordStatus;
  lastAttemptAt: string;
  consecutiveCorrect: number;
}

/**
 * Dutch vowel digraphs that learners find hard to pronounce. ei/ij sound
 * identical to each other, as do au/ou — which is exactly why they confuse
 * learners. Used by the "Moeilijke klanken" practice mode.
 */
export type DifficultSound = 'oe' | 'eu' | 'ui' | 'ei' | 'ij' | 'au' | 'ou';

/** How the pronunciation module filters its word pool. */
export type PracticeMode = 'level' | 'sounds';

export interface PronunciationProgress {
  version: 1;
  currentLevel: 'A1' | 'A2' | 'B1' | 'B2';
  currentTheme: PronunciationTheme | 'all';
  currentMode: PracticeMode;
  currentSound: DifficultSound | 'all';
  words: Record<string, WordProgress>;
}
