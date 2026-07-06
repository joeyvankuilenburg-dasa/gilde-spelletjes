import type { Level } from '../../../types/content';

/**
 * Hardcoded Dutch expressions (uitdrukkingen & spreekwoorden) for the
 * "Uitdrukkingen" practice module. No database — everything lives here.
 *
 * Two exercise types:
 *  - FinishExpression  → fill in the missing word ("Maak de uitdrukking af")
 *  - MeaningExpression → pick the real meaning ("Letterlijk vs. echt")
 */

export type ExpressionLevel = Extract<Level, 'A1' | 'A2' | 'B1' | 'B2'>;

/** Marker used inside a template to show where the blank goes. */
export const BLANK = '___';

export interface FinishExpression {
  id: string;
  level: ExpressionLevel;
  /** The expression with the missing word replaced by {@link BLANK}. */
  template: string;
  /** The correct word that fills the blank. */
  answer: string;
  /** Answer options (includes {@link answer}); shuffled in the UI. */
  options: string[];
  /** The complete, correct expression. */
  full: string;
  /** Plain-Dutch explanation of what the expression means. */
  meaning: string;
}

export interface MeaningExpression {
  id: string;
  level: ExpressionLevel;
  /** The expression itself, e.g. "Met de deur in huis vallen". */
  expression: string;
  /** The funny, word-for-word literal reading in simple Dutch. */
  literal: string;
  /** The real meaning (the correct answer). */
  meaning: string;
  /** Meaning options (includes {@link meaning}); shuffled in the UI. */
  options: string[];
}

export const FINISH_EXPRESSIONS: FinishExpression[] = [
  {
    id: 'honger-paard',
    level: 'A1',
    template: `Ik heb honger als een ${BLANK}.`,
    answer: 'paard',
    options: ['paard', 'beer', 'wolf', 'vogel'],
    full: 'Ik heb honger als een paard.',
    meaning: 'Ik heb heel veel honger.',
  },
  {
    id: 'slapen-roos',
    level: 'A1',
    template: `Ik slaap als een ${BLANK}.`,
    answer: 'roos',
    options: ['roos', 'steen', 'beer', 'kat'],
    full: 'Ik slaap als een roos.',
    meaning: 'Ik slaap heel diep en rustig.',
  },
  {
    id: 'gezond-vis',
    level: 'A1',
    template: `Zo gezond als een ${BLANK}.`,
    answer: 'vis',
    options: ['vis', 'paard', 'boom', 'appel'],
    full: 'Zo gezond als een vis.',
    meaning: 'Heel erg gezond.',
  },
  {
    id: 'sterk-beer',
    level: 'A1',
    template: `Zo sterk als een ${BLANK}.`,
    answer: 'beer',
    options: ['beer', 'paard', 'leeuw', 'olifant'],
    full: 'Zo sterk als een beer.',
    meaning: 'Heel erg sterk.',
  },
  {
    id: 'aap-mouw',
    level: 'A2',
    template: `Nu komt de ${BLANK} uit de mouw.`,
    answer: 'aap',
    options: ['aap', 'kat', 'hond', 'vogel'],
    full: 'Nu komt de aap uit de mouw.',
    meaning: 'Nu wordt de verborgen bedoeling of de echte waarheid duidelijk.',
  },
  {
    id: 'kat-zak',
    level: 'A2',
    template: `Pas op dat je geen ${BLANK} in de zak koopt.`,
    answer: 'kat',
    options: ['kat', 'hond', 'muis', 'vis'],
    full: 'Pas op dat je geen kat in de zak koopt.',
    meaning: 'Pas op dat je niets koopt dat tegenvalt — een miskoop doen.',
  },
  {
    id: 'regent-pijpenstelen',
    level: 'A2',
    template: `Het regent ${BLANK}.`,
    answer: 'pijpenstelen',
    options: ['pijpenstelen', 'katten', 'druppels', 'emmers'],
    full: 'Het regent pijpenstelen.',
    meaning: 'Het regent heel hard.',
  },
  {
    id: 'twee-vliegen',
    level: 'A2',
    template: `Zo sla je twee ${BLANK} in één klap.`,
    answer: 'vliegen',
    options: ['vliegen', 'mussen', 'vogels', 'muggen'],
    full: 'Zo sla je twee vliegen in één klap.',
    meaning: 'Twee dingen tegelijk voor elkaar krijgen met één actie.',
  },
  {
    id: 'appeltje-dorst',
    level: 'A2',
    template: `Ik bewaar een appeltje voor de ${BLANK}.`,
    answer: 'dorst',
    options: ['dorst', 'honger', 'winter', 'reis'],
    full: 'Ik bewaar een appeltje voor de dorst.',
    meaning: 'Iets bewaren voor als je het later nodig hebt.',
  },
  {
    id: 'beter-vogel-hand',
    level: 'A2',
    template: `Beter één vogel in de hand dan tien in de ${BLANK}.`,
    answer: 'lucht',
    options: ['lucht', 'boom', 'struik', 'tuin'],
    full: 'Beter één vogel in de hand dan tien in de lucht.',
    meaning: 'Iets zekers is beter dan iets onzekers dat misschien meer lijkt.',
  },
  {
    id: 'mug-olifant',
    level: 'B1',
    template: `Hij maakt van een mug een ${BLANK}.`,
    answer: 'olifant',
    options: ['olifant', 'muis', 'berg', 'leeuw'],
    full: 'Hij maakt van een mug een olifant.',
    meaning: 'Iets veel groter en erger maken dan het in werkelijkheid is.',
  },
  {
    id: 'spijker-kop',
    level: 'B1',
    template: `Daarmee sla je de spijker op zijn ${BLANK}.`,
    answer: 'kop',
    options: ['kop', 'punt', 'hoofd', 'kant'],
    full: 'Daarmee sla je de spijker op zijn kop.',
    meaning: 'Precies gelijk hebben of iets precies goed zeggen.',
  },
  {
    id: 'knoop-doorhakken',
    level: 'B1',
    template: `We moeten nu de ${BLANK} doorhakken.`,
    answer: 'knoop',
    options: ['knoop', 'touw', 'draad', 'band'],
    full: 'We moeten nu de knoop doorhakken.',
    meaning: 'Eindelijk een moeilijke beslissing nemen.',
  },
  {
    id: 'boter-hoofd',
    level: 'B1',
    template: `Hij heeft zelf boter op zijn ${BLANK}.`,
    answer: 'hoofd',
    options: ['hoofd', 'brood', 'handen', 'bord'],
    full: 'Hij heeft zelf boter op zijn hoofd.',
    meaning: 'Zelf ook schuld hebben en daarom beter geen kritiek geven.',
  },
  {
    id: 'kat-boom',
    level: 'B1',
    template: `Ik kijk eerst de kat uit de ${BLANK}.`,
    answer: 'boom',
    options: ['boom', 'mouw', 'zak', 'hoek'],
    full: 'Ik kijk eerst de kat uit de boom.',
    meaning: 'Eerst rustig afwachten hoe iets loopt voordat je iets doet.',
  },
  {
    id: 'rib-lijf',
    level: 'B1',
    template: `Die auto kost een ${BLANK} uit je lijf.`,
    answer: 'rib',
    options: ['rib', 'been', 'arm', 'tand'],
    full: 'Die auto kost een rib uit je lijf.',
    meaning: 'Het is heel erg duur.',
  },
  {
    id: 'bomen-bos',
    level: 'B1',
    template: `Door de bomen ziet hij het ${BLANK} niet meer.`,
    answer: 'bos',
    options: ['bos', 'pad', 'licht', 'huis'],
    full: 'Door de bomen ziet hij het bos niet meer.',
    meaning: 'Door alle details het overzicht kwijtraken.',
  },
  {
    id: 'muizen-dansen',
    level: 'B1',
    template: `Als de kat van huis is, dansen de ${BLANK}.`,
    answer: 'muizen',
    options: ['muizen', 'honden', 'vogels', 'kinderen'],
    full: 'Als de kat van huis is, dansen de muizen.',
    meaning: 'Zonder toezicht doen mensen waar ze zin in hebben.',
  },
  {
    id: 'kogel-kerk',
    level: 'B2',
    template: `De kogel is door de ${BLANK}.`,
    answer: 'kerk',
    options: ['kerk', 'muur', 'deur', 'kamer'],
    full: 'De kogel is door de kerk.',
    meaning: 'Er is na lang twijfelen eindelijk een definitief besluit genomen.',
  },
  {
    id: 'storm-glas-water',
    level: 'B2',
    template: `Dat is een storm in een glas ${BLANK}.`,
    answer: 'water',
    options: ['water', 'wijn', 'melk', 'bier'],
    full: 'Dat is een storm in een glas water.',
    meaning: 'Veel drukte en opwinding om iets onbelangrijks.',
  },
  {
    id: 'handen-onschuld',
    level: 'B2',
    template: `Hij wast zijn handen in ${BLANK}.`,
    answer: 'onschuld',
    options: ['onschuld', 'water', 'zeep', 'schuld'],
    full: 'Hij wast zijn handen in onschuld.',
    meaning: 'Doen alsof je ergens geen enkele schuld aan hebt.',
  },
  {
    id: 'kind-badwater',
    level: 'B2',
    template: `Je moet niet het kind met het ${BLANK} weggooien.`,
    answer: 'badwater',
    options: ['badwater', 'water', 'bad', 'speelgoed'],
    full: 'Je moet niet het kind met het badwater weggooien.',
    meaning: 'Met het slechte per ongeluk ook het goede onbedoeld weggooien.',
  },
];

export const MEANING_EXPRESSIONS: MeaningExpression[] = [
  {
    id: 'honger-paard-m',
    level: 'A1',
    expression: 'Honger als een paard hebben',
    literal: 'Honger hebben zoals een groot paard.',
    meaning: 'Heel veel honger hebben.',
    options: [
      'Heel veel honger hebben.',
      'Heel snel kunnen rennen.',
      'Graag bij dieren zijn.',
      'Erg moe zijn.',
    ],
  },
  {
    id: 'moe-hond',
    level: 'A1',
    expression: 'Zo moe als een hond',
    literal: 'Net zo moe als een hond.',
    meaning: 'Heel erg moe zijn.',
    options: [
      'Heel erg moe zijn.',
      'Graag buiten zijn.',
      'Overdag willen slapen.',
      'Verdrietig zijn.',
    ],
  },
  {
    id: 'blij-kind',
    level: 'A1',
    expression: 'Zo blij als een kind',
    literal: 'Net zo blij als een klein kind.',
    meaning: 'Heel erg blij zijn.',
    options: [
      'Heel erg blij zijn.',
      'Jong van uiterlijk zijn.',
      'Veel speelgoed hebben.',
      'Snel huilen.',
    ],
  },
  {
    id: 'deur-huis',
    level: 'A2',
    expression: 'Met de deur in huis vallen',
    literal: 'Alsof je samen met de deur naar binnen valt.',
    meaning: 'Meteen ter zake komen, zonder inleiding.',
    options: [
      'Meteen ter zake komen, zonder inleiding.',
      'Onaangekondigd bij iemand op bezoek gaan.',
      'Hard met de deur slaan als je boos bent.',
      'Iets in huis per ongeluk kapotmaken.',
    ],
  },
  {
    id: 'bloemetjes-buiten',
    level: 'A2',
    expression: 'De bloemetjes buiten zetten',
    literal: 'De bloemen buiten in de tuin neerzetten.',
    meaning: 'Uitbundig feestvieren.',
    options: [
      'Uitbundig feestvieren.',
      'Hard in de tuin werken.',
      'Het huis mooi versieren.',
      'Met vakantie gaan.',
    ],
  },
  {
    id: 'draad-kwijt',
    level: 'A2',
    expression: 'De draad kwijt zijn',
    literal: 'Een stukje draad verloren hebben.',
    meaning: 'Niet meer weten waar je was; het overzicht kwijt zijn.',
    options: [
      'Niet meer weten waar je was; het overzicht kwijt zijn.',
      'Iets belangrijks verloren hebben.',
      'Geen geld meer overhebben.',
      'Heel erg moe zijn.',
    ],
  },
  {
    id: 'vinger-uitsteken',
    level: 'A2',
    expression: 'Geen vinger uitsteken',
    literal: 'Geen enkele vinger omhoog steken.',
    meaning: 'Helemaal niets doen om te helpen.',
    options: [
      'Helemaal niets doen om te helpen.',
      'Heel voorzichtig met iets omgaan.',
      'Niemand durven aanraken.',
      'Ergens net niet bij kunnen.',
    ],
  },
  {
    id: 'kaas-gegeten',
    level: 'B1',
    expression: 'Ergens geen kaas van gegeten hebben',
    literal: 'Geen kaas van iets opgegeten hebben.',
    meaning: 'Ergens niets van afweten of geen verstand van hebben.',
    options: [
      'Ergens niets van afweten of geen verstand van hebben.',
      'Ergens geen zin in hebben.',
      'Iets niet lekker vinden.',
      'Iets nog nooit geprobeerd hebben.',
    ],
  },
  {
    id: 'knie-hebben',
    level: 'B1',
    expression: 'Iets onder de knie hebben',
    literal: 'Iets onder je knie vasthouden.',
    meaning: 'Iets goed kunnen of beheersen.',
    options: [
      'Iets goed kunnen of beheersen.',
      'Ergens veel last van hebben.',
      'Iets verborgen houden voor anderen.',
      'Iets bijna vergeten zijn.',
    ],
  },
  {
    id: 'soep-loopt',
    level: 'B1',
    expression: 'Het loopt in de soep',
    literal: 'In een bord soep stappen.',
    meaning: 'Het mislukt.',
    options: [
      'Het mislukt.',
      'Het wordt opeens heel druk.',
      'Het wordt een rommel in de keuken.',
      'Het duurt veel te lang.',
    ],
  },
  {
    id: 'hete-kolen',
    level: 'B1',
    expression: 'Op hete kolen zitten',
    literal: 'Op gloeiend hete kolen zitten.',
    meaning: 'Heel ongeduldig of zenuwachtig zitten wachten.',
    options: [
      'Heel ongeduldig of zenuwachtig zitten wachten.',
      'Het veel te warm hebben.',
      'Ergens absoluut geen zin in hebben.',
      'Snel boos worden.',
    ],
  },
  {
    id: 'hart-riem',
    level: 'B1',
    expression: 'Iemand een hart onder de riem steken',
    literal: 'Een hart onder iemands riem schuiven.',
    meaning: 'Iemand moed inspreken of troosten.',
    options: [
      'Iemand moed inspreken of troosten.',
      'Iemand een cadeau geven.',
      'Iemand streng toespreken.',
      'Iemand met iets verrassen.',
    ],
  },
  {
    id: 'handdoek-ring',
    level: 'B1',
    expression: 'De handdoek in de ring gooien',
    literal: 'Een handdoek in een boksring gooien.',
    meaning: 'Opgeven of ergens mee stoppen.',
    options: [
      'Opgeven of ergens mee stoppen.',
      'Beginnen met sporten.',
      'Boos weglopen.',
      'De boel opruimen.',
    ],
  },
  {
    id: 'hangende-pootjes',
    level: 'B1',
    expression: 'Met hangende pootjes terugkomen',
    literal: 'Terugkomen met je pootjes naar beneden.',
    meaning: 'Beschaamd terugkomen na een mislukking.',
    options: [
      'Beschaamd terugkomen na een mislukking.',
      'Doodmoe terugkomen.',
      'Veel te laat terugkomen.',
      'Heel blij terugkomen.',
    ],
  },
  {
    id: 'boontje-loontje',
    level: 'B1',
    expression: 'Boontje komt om zijn loontje',
    literal: 'Een boontje haalt zijn loon op.',
    meaning: 'Wie iets slechts doet, krijgt vroeg of laat zijn verdiende straf.',
    options: [
      'Wie iets slechts doet, krijgt vroeg of laat zijn verdiende straf.',
      'Hard werken wordt altijd beloond.',
      'Iedereen krijgt uiteindelijk evenveel betaald.',
      'Geduld wordt op het laatst beloond.',
    ],
  },
  {
    id: 'kat-bel',
    level: 'B2',
    expression: 'De kat de bel aanbinden',
    literal: 'Een belletje om de nek van de kat binden.',
    meaning: 'Een moeilijke of gevaarlijke taak op je nemen die niemand anders durft.',
    options: [
      'Een moeilijke of gevaarlijke taak op je nemen die niemand anders durft.',
      'Heel voorzichtig te werk gaan.',
      'Een huisdier goed verzorgen.',
      'Voor onrust en lawaai zorgen.',
    ],
  },
  {
    id: 'tuin-leiden',
    level: 'B2',
    expression: 'Iemand om de tuin leiden',
    literal: 'Iemand rondleiden door de tuin.',
    meaning: 'Iemand misleiden of bedriegen.',
    options: [
      'Iemand misleiden of bedriegen.',
      'Iemand de weg wijzen.',
      'Rustig met iemand wandelen.',
      'Iemand helpen met verhuizen.',
    ],
  },
  {
    id: 'water-wijn',
    level: 'B2',
    expression: 'Water bij de wijn doen',
    literal: 'Wat water in je glas wijn gieten.',
    meaning: 'Toegeven en minder eisen; een compromis sluiten.',
    options: [
      'Toegeven en minder eisen; een compromis sluiten.',
      'Minder gaan drinken.',
      'Iets goedkoper maken.',
      'Voorzichtiger gaan doen.',
    ],
  },
  {
    id: 'knuppel-hoenderhok',
    level: 'B2',
    expression: 'De knuppel in het hoenderhok gooien',
    literal: 'Een dikke stok in het kippenhok gooien.',
    meaning: 'Met een opmerking bewust voor opschudding en discussie zorgen.',
    options: [
      'Met een opmerking bewust voor opschudding en discussie zorgen.',
      'Een ruzie juist oplossen.',
      'De dieren goed verzorgen.',
      'Iets met geweld kapotmaken.',
    ],
  },
];

/** All levels that actually appear in the data, in CEFR order. */
export const EXPRESSION_LEVELS: ExpressionLevel[] = (
  ['A1', 'A2', 'B1', 'B2'] as ExpressionLevel[]
).filter(
  (level) =>
    FINISH_EXPRESSIONS.some((e) => e.level === level) ||
    MEANING_EXPRESSIONS.some((e) => e.level === level),
);
