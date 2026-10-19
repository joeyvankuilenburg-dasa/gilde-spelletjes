import type { Level } from '../../../types/content';

/**
 * Hardcoded conversation topics for the AI-gesprek (free-form Dutch chat).
 *
 * Topics are labeled by CEFR level A1–B2 and sorted by level, like the other
 * practice modules. Each topic drives the offline rules engine
 * (starterQuestions / newWords / roleplay).
 */

export type GesprekLevel = Extract<Level, 'A1' | 'A2' | 'B1' | 'B2'>;

export type TopicTone = 'brand' | 'sky' | 'amber' | 'violet' | 'rose' | 'teal' | 'indigo' | 'gray';

export interface ConversationTopic {
  id: string;
  level: GesprekLevel;
  /** Dutch display name. */
  label: string;
  /** Short one-line description for the picker card. */
  description: string;
  /** The assistant's opening line. */
  opener: string;
  /** Avatar chip color in the picker. */
  tone: TopicTone;
  /** Used by the rules engine for the first conversation turns. */
  starterQuestions: string[];
  /** Introduced one at a time on later turns. */
  newWords: string[];
  /** A short roleplay prompt for mid-conversation. */
  roleplay: string;
}

export const CONVERSATION_TOPICS: ConversationTopic[] = [
  // ---------------- A1 ----------------
  {
    id: 'kennismaking',
    level: 'A1',
    label: 'Kennismaken',
    description: 'Stel jezelf voor en leer iemand kennen.',
    opener: 'Hallo! Hoe heet je?',
    tone: 'brand',
    starterQuestions: [
      'Waar kom je vandaan?',
      'Hoe lang woon je al in Nederland?',
      'Wat doe je graag in je vrije tijd?',
    ],
    newWords: ['aangenaam', 'woonplaats', 'buurman', 'allebei', 'gezellig'],
    roleplay: 'Stel jezelf voor aan een nieuwe buurman. Vraag naar zijn naam en land.',
  },
  {
    id: 'familie',
    level: 'A1',
    label: 'Familie en thuis',
    description: 'Praat over je familie en je huis.',
    opener: 'Hoi! Woon je met familie in Nederland?',
    tone: 'rose',
    starterQuestions: [
      'Heb je broers of zussen?',
      'Hoe ziet jouw huis eruit?',
      'Wat doen jullie samen als familie?',
    ],
    newWords: ['ouders', 'zus', 'woonkamer', 'samen', 'buren'],
    roleplay: 'Je laat een vriend je huis zien. Beschrijf elke kamer.',
  },
  {
    id: 'eten',
    level: 'A1',
    label: 'Eten en drinken',
    description: 'Bestel iets en praat over eten.',
    opener: 'Welkom in het café! Wat wil je drinken?',
    tone: 'amber',
    starterQuestions: [
      'Heb je honger? Wat wil je eten?',
      'Wat eet je graag in jouw land?',
      'Kook je zelf thuis?',
    ],
    newWords: ['bestellen', 'rekening', 'lekker', 'ontbijt', 'smakelijk'],
    roleplay: 'Je bestelt eten en drinken in een café voor jou en een vriend.',
  },
  {
    id: 'dagelijks',
    level: 'A1',
    label: 'Dagelijkse routine',
    description: 'Vertel over een gewone dag.',
    opener: 'Hoi! Hoe laat sta je meestal op?',
    tone: 'sky',
    starterQuestions: [
      'Wat doe je als eerste in de ochtend?',
      'Hoe ga je naar je werk of school?',
      'Wat doe je het liefst in de avond?',
    ],
    newWords: ['wakker worden', 'ontbijten', 'fietsen', 'afwassen', 'slapen'],
    roleplay: 'Vertel over je dag van gisteren, van de ochtend tot de avond.',
  },
  {
    id: 'weer',
    level: 'A1',
    label: 'Het weer',
    description: 'Praat over het weer en kleding.',
    opener: 'Hallo! Hoe is het weer vandaag?',
    tone: 'teal',
    starterQuestions: [
      'Vind je dit weer fijn?',
      'Wat voor weer heb je het liefst?',
      'Wat trek je aan bij regen?',
    ],
    newWords: ['bewolkt', 'regenbui', 'zonnig', 'jas', 'paraplu'],
    roleplay: 'Je belt een vriend om plannen te maken. Bespreek het weer.',
  },

  // ---------------- A2 ----------------
  {
    id: 'hobbys',
    level: 'A2',
    label: "Hobby's en vrije tijd",
    description: 'Praat over je interesses.',
    opener: 'Hoi! Wat doe je graag in je vrije tijd?',
    tone: 'violet',
    starterQuestions: [
      'Hoe ben je daarmee begonnen?',
      'Doe je dat alleen of met anderen?',
      'Heb je een hobby uit jouw cultuur?',
    ],
    newWords: ['vereniging', 'vrijwilligerswerk', 'uitstapje', 'sporten', 'ontspannen'],
    roleplay: 'Je vertelt een collega over je hobby en nodigt hem uit om mee te doen.',
  },
  {
    id: 'werk',
    level: 'A2',
    label: "Werk en collega's",
    description: 'Praat over werk en je werkdag.',
    opener: 'Hallo! Wat voor werk doe je, of zou je willen doen?',
    tone: 'indigo',
    starterQuestions: [
      'Hoe is de sfeer op je werk?',
      'Beschrijf een typische werkdag.',
      'Wat vind je leuk aan je werk?',
    ],
    newWords: ['collega', 'vergadering', 'leidinggevende', 'samenwerken', 'pauze'],
    roleplay: 'Je belt je leidinggevende om te zeggen dat je later komt. Geef een reden.',
  },
  {
    id: 'reizen',
    level: 'A2',
    label: 'Reizen en vakantie',
    description: 'Vertel over reizen en plannen.',
    opener: 'Hoi! Waar ben je voor het laatst op reis geweest?',
    tone: 'sky',
    starterQuestions: [
      'Wat vond je daar het mooist?',
      'Reis je liever met de trein of het vliegtuig?',
      'Wat neem je altijd mee op reis?',
    ],
    newWords: ['bestemming', 'koffer', 'bezienswaardigheid', 'accommodatie', 'vertrekken'],
    roleplay: 'Je boekt telefonisch een hotelkamer. Vraag naar de prijs en het ontbijt.',
  },
  {
    id: 'gezondheid',
    level: 'A2',
    label: 'Bij de dokter',
    description: 'Beschrijf klachten en stel vragen.',
    opener: 'Goedemorgen. Hoe voelt u zich vandaag?',
    tone: 'rose',
    starterQuestions: [
      'Waar heeft u precies last van?',
      'Sinds wanneer voelt u zich zo?',
      'Slaapt u en eet u goed?',
    ],
    newWords: ['klacht', 'huisarts', 'recept', 'apotheek', 'afspraak'],
    roleplay: 'Je gaat naar de huisarts met hoofdpijn. Beschrijf je klachten.',
  },
  {
    id: 'winkelen',
    level: 'A2',
    label: 'Winkelen',
    description: 'Vraag naar prijs, maat en hulp.',
    opener: 'Hallo! Waarmee kan ik u helpen?',
    tone: 'amber',
    starterQuestions: ['Wat zoekt u precies?', 'Welke maat heeft u nodig?', 'Wilt u het passen?'],
    newWords: ['maat', 'korting', 'passen', 'wisselgeld', 'kassa'],
    roleplay: 'Je bent in een kledingwinkel. Vraag naar een andere maat en de prijs.',
  },

  // ---------------- B1 ----------------
  {
    id: 'mening',
    level: 'B1',
    label: 'Meningen en discussie',
    description: 'Geef je mening en onderbouw die.',
    opener: 'Wat vind jij: zou je op zondag moeten kunnen werken?',
    tone: 'indigo',
    starterQuestions: [
      'Waarom denk je dat?',
      'Wat zou een tegenstander hiervan zeggen?',
      'Is er een compromis mogelijk?',
    ],
    newWords: ['standpunt', 'bezwaar', 'nuanceren', 'het eens zijn', 'argument'],
    roleplay: 'Voer een kort debat: jij bent voor, ik ben tegen telefoons op school.',
  },
  {
    id: 'carriere',
    level: 'B1',
    label: 'Carrière en ambitie',
    description: 'Praat over je loopbaan en plannen.',
    opener: 'Vertel eens: wat wil je over vijf jaar bereikt hebben?',
    tone: 'violet',
    starterQuestions: [
      'Welke stappen heb je daarvoor nodig?',
      'Wat is je grootste uitdaging op de arbeidsmarkt?',
      'Wat motiveert jou in je werk?',
    ],
    newWords: ['sollicitatie', 'netwerken', 'doorgroeien', 'ervaring', 'ambitie'],
    roleplay: 'We oefenen een sollicitatiegesprek. Ik stel je drie vragen.',
  },
  {
    id: 'wonen',
    level: 'B1',
    label: 'Wonen en financiën',
    description: 'Bespreek wonen, huren en geld.',
    opener: 'Hoe heb jij je woning in Nederland gevonden?',
    tone: 'teal',
    starterQuestions: [
      'Wat zijn voor- en nadelen van huren of kopen?',
      'Hoe houd jij je uitgaven bij?',
      'Wat was de grootste uitdaging bij het verhuizen?',
    ],
    newWords: ['huurcontract', 'borg', 'servicekosten', 'verzekering', 'budget'],
    roleplay: 'Je belt een verhuurder over een advertentie. Vraag naar de huurprijs en borg.',
  },
  {
    id: 'samenleving',
    level: 'B1',
    label: 'Nederlandse samenleving',
    description: 'Bespreek gewoonten en instituties.',
    opener: 'Wat valt jou het meest op aan de Nederlandse samenleving?',
    tone: 'brand',
    starterQuestions: [
      'Wat is anders dan in jouw land?',
      'Wat vind je van de directheid van Nederlanders?',
      'Welke gewoonte heb je overgenomen?',
    ],
    newWords: ['gemeente', 'integratie', 'directheid', 'gelijkheid', 'overheid'],
    roleplay: 'Je gaat naar het gemeentehuis om je in te schrijven. Stel de nodige vragen.',
  },
  {
    id: 'verhaal',
    level: 'B1',
    label: 'Een verhaal vertellen',
    description: 'Vertel een verhaal in de verleden tijd.',
    opener: 'Vertel eens over een moment waarop je trots op jezelf was.',
    tone: 'amber',
    starterQuestions: [
      'Wat gebeurde er precies?',
      'Hoe voelde je je toen?',
      'Wat heb je ervan geleerd?',
    ],
    newWords: ['aanleiding', 'vervolgens', 'desondanks', 'achteraf', 'verbazing'],
    roleplay: 'Vertel een verhaal van twee minuten over een onvergetelijke ervaring.',
  },

  // ---------------- B2 ----------------
  {
    id: 'abstract',
    level: 'B2',
    label: 'Abstracte ideeën',
    description: 'Praat over abstracte begrippen.',
    opener: 'Wat betekent "vrijheid" volgens jou?',
    tone: 'violet',
    starterQuestions: [
      'Kun je een voorbeeld geven uit je eigen leven?',
      'Botst vrijheid soms met verantwoordelijkheid?',
      'Is vrijheid overal hetzelfde, denk je?',
    ],
    newWords: ['vrijheid', 'verantwoordelijkheid', 'grens', 'relatief', 'waarde'],
    roleplay: 'We filosoferen samen: jij verdedigt vrijheid, ik benadruk verantwoordelijkheid.',
  },
  {
    id: 'politiek',
    level: 'B2',
    label: 'Politiek en maatschappij',
    description: 'Bespreek maatschappelijke thema’s.',
    opener: 'Welk maatschappelijk thema vind jij op dit moment het belangrijkst?',
    tone: 'indigo',
    starterQuestions: [
      'Hoe zou de overheid dit kunnen aanpakken?',
      'Wat zijn de gevolgen als er niets gebeurt?',
      'Wie heeft hierin de meeste verantwoordelijkheid?',
    ],
    newWords: ['beleid', 'inflatie', 'klimaatverandering', 'democratie', 'maatregel'],
    roleplay: 'Jij bent journalist en interviewt mij over een actueel thema. Stel scherpe vragen.',
  },
  {
    id: 'ethiek',
    level: 'B2',
    label: 'Filosofie en ethiek',
    description: 'Verken morele vragen.',
    opener: 'Mag je altijd de waarheid spreken? Waarom wel of niet?',
    tone: 'teal',
    starterQuestions: [
      'Bestaat er een witte leugen?',
      'Hangt goed of fout af van de situatie?',
      'Wie bepaalt wat moreel juist is?',
    ],
    newWords: ['moraal', 'dilemma', 'principe', 'rechtvaardig', 'geweten'],
    roleplay: 'We bespreken een moreel dilemma: een leugen om iemand te beschermen.',
  },
  {
    id: 'kunst',
    level: 'B2',
    label: 'Literatuur en kunst',
    description: 'Praat over boeken, films en kunst.',
    opener: 'Welk boek of welke film heeft veel indruk op je gemaakt?',
    tone: 'rose',
    starterQuestions: [
      'Wat raakte je daar precies in?',
      'Wat wilde de maker volgens jou vertellen?',
      'Verandert kunst hoe we naar de wereld kijken?',
    ],
    newWords: ['thema', 'symboliek', 'interpretatie', 'stijl', 'ontroeren'],
    roleplay: 'Bespreek samen een boek of film alsof we in een leesclub zitten.',
  },
  {
    id: 'wetenschap',
    level: 'B2',
    label: 'Wetenschap en technologie',
    description: 'Bespreek technologie en de toekomst.',
    opener: 'Hoe verandert technologie ons dagelijks leven, denk je?',
    tone: 'sky',
    starterQuestions: [
      'Wat zijn de voordelen en de risico’s?',
      'Maakt technologie ons gelukkiger?',
      'Hoe ziet de wereld er over twintig jaar uit?',
    ],
    newWords: ['kunstmatige intelligentie', 'innovatie', 'privacy', 'duurzaam', 'gevolg'],
    roleplay: 'We debatteren over de vraag of AI banen vervangt of juist creëert.',
  },
];

/** All levels present, in CEFR order. */
export const GESPREK_LEVELS: GesprekLevel[] = (['A1', 'A2', 'B1', 'B2'] as GesprekLevel[]).filter(
  (level) => CONVERSATION_TOPICS.some((t) => t.level === level),
);

export function getConversationTopic(id: string): ConversationTopic | undefined {
  return CONVERSATION_TOPICS.find((t) => t.id === id);
}

export const CONVERSATION_TOPIC_IDS = CONVERSATION_TOPICS.map((t) => t.id);
