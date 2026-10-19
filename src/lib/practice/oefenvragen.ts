import type { Level } from '../../types/content';

export interface PracticeQuestion {
  topic: string;
  prompt: string;
  levelHint: string;
}

export interface PracticeFeedback {
  positive: string;
  correction: string | null;
  betterSentence: string | null;
  difficultWords: string[];
  usedGoodWords: string[];
  recommendedNextQuestion: string | null;
  difficultyChange: 'easier' | 'same' | 'harder';
  summary: string;
}

const PRACTICE_QUESTIONS: Record<Level, PracticeQuestion[]> = {
  A1: [
    {
      topic: 'Dagelijkse routine',
      prompt: 'Hoe laat sta je op? Wat eet je als ontbijt?',
      levelHint: 'Gebruik eenvoudige zinnen, bijvoorbeeld: "Ik sta op om zeven uur."',
    },
    {
      topic: 'Familie en thuis',
      prompt: 'Vertel over jouw familie. Hoeveel mensen wonen er bij jou?',
      levelHint: 'Gebruik woorden als: moeder, vader, broer, zus, appartement.',
    },
    {
      topic: 'Eten en drinken',
      prompt: 'Wat koop je vaak in de supermarkt?',
      levelHint: 'Noem een paar producten, bijvoorbeeld: "Ik koop brood, melk en fruit."',
    },
    {
      topic: 'Kennismaken',
      prompt: 'Stel jezelf voor. Hoe heet je? Waar kom je vandaan?',
      levelHint: 'Zeg je naam en land, bijvoorbeeld: "Ik heet... Ik kom uit..."',
    },
    {
      topic: 'Het weer',
      prompt: 'Hoe is het weer vandaag? Vind je dat fijn?',
      levelHint: 'Gebruik woorden als: zonnig, bewolkt, koud, warm, regen.',
    },
  ],
  A2: [
    {
      topic: 'Dagelijkse routine',
      prompt: 'Vertel wat je gisteren hebt gedaan.',
      levelHint: 'Gebruik de verleden tijd, bijvoorbeeld: "Gisteren heb ik... gedaan."',
    },
    {
      topic: "Hobby's en vrije tijd",
      prompt: "Wat zijn jouw hobby's? Wat doe je het liefst in je vrije tijd?",
      levelHint: 'Vertel minstens twee dingen die je leuk vindt en waarom.',
    },
    {
      topic: 'De buurt en de stad',
      prompt: 'Hoe kom je naar je werk of school? Beschrijf jouw route.',
      levelHint: 'Gebruik woorden als: fiets, bus, trein, lopen, overstappen.',
    },
    {
      topic: 'Eten en drinken',
      prompt: 'Wat eet je graag? Kook je zelf? Beschrijf een gerecht dat je lekker vindt.',
      levelHint: 'Vertel de ingrediënten en hoe je het bereidt.',
    },
    {
      topic: 'Reizen en vakantie',
      prompt: 'Vertel over een reis die je hebt gemaakt. Waar ben je geweest?',
      levelHint: 'Gebruik de verleden tijd en noem twee dingen die je hebt gedaan.',
    },
  ],
  B1: [
    {
      topic: 'Meningen en discussie',
      prompt: 'Wat vind je van openbaar vervoer in Nederland? Leg uit waarom.',
      levelHint: 'Geef minstens twee argumenten en gebruik "omdat" of "want".',
    },
    {
      topic: 'Nederlandse samenleving',
      prompt: 'Wat zijn verschillen tussen wonen in Nederland en jouw geboorteland?',
      levelHint: 'Vergelijk twee of drie dingen, zoals werk, cultuur of kosten.',
    },
    {
      topic: 'De buurt',
      prompt: 'Beschrijf een probleem in jouw buurt en hoe jij het zou oplossen.',
      levelHint: 'Beschrijf het probleem, de oorzaak en een concrete oplossing.',
    },
    {
      topic: 'Een verhaal vertellen',
      prompt: 'Vertel over een moment dat je trots was op jezelf. Wat gebeurde er?',
      levelHint: 'Gebruik de verleden tijd en vertel ook hoe je je voelde.',
    },
    {
      topic: 'Carrière en ambitie',
      prompt: 'Wat wil je bereiken in de komende vijf jaar?',
      levelHint: 'Gebruik de toekomende tijd: "Ik wil graag..." of "Ik hoop..."',
    },
  ],
  B2: [
    {
      topic: 'Politiek en maatschappij',
      prompt: 'Wat vind jij van de rol van de overheid in het dagelijks leven?',
      levelHint: 'Onderbouw je mening met voorbeelden en nuanceer je standpunt.',
    },
    {
      topic: 'Filosofie en ethiek',
      prompt: 'Is eerlijkheid altijd de beste keuze? Geef een voorbeeld.',
      levelHint: 'Gebruik taal als: "aan de ene kant..." en "aan de andere kant..."',
    },
    {
      topic: 'Abstracte begrippen',
      prompt: 'Wat betekent vrijheid voor jou? Hoe ervaar je dat in Nederland?',
      levelHint: 'Verbind abstracte begrippen aan persoonlijke ervaringen.',
    },
    {
      topic: 'Technologie',
      prompt: 'Hoe heeft technologie jouw dagelijks leven veranderd?',
      levelHint: 'Geef concrete voorbeelden en bespreek voor- en nadelen.',
    },
  ],
};

const REPEAT_WORDS = ['aangenaam', 'woonkamer', 'leidinggevende'];
const MAX_WORDS = 3;

function wordsFrom(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,!?;:"'()[\]{}]/g, ' ')
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);
}

function cleanText(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function preserveTail(rawTail: string): string {
  return cleanText(rawTail).replace(/[.!?]+$/, '');
}

function ensurePeriod(text: string): string {
  const trimmed = cleanText(text);
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function capitalizeFirst(text: string): string {
  const trimmed = cleanText(text);
  return trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : trimmed;
}

function unique(items: string[]): string[] {
  return items.filter((item, index, all) => item && all.indexOf(item) === index);
}

function deterministicA1Correction(answer: string, prompt = ''): PracticeFeedback | null {
  const trimmed = cleanText(answer);

  const patterns: Array<{
    regex: RegExp;
    make: (match: RegExpMatchArray) => {
      better: string;
      correction: string;
      difficult: string[];
      used: string[];
      next: string;
      summary: string;
    };
  }> = [
    {
      regex: /^ik\s+heten\s+(.+)$/i,
      make: (m) => {
        const name = preserveTail(m[1] ?? '');
        return {
          better: `Ik heet ${name}.`,
          correction: "Bij 'ik' zeg je 'heet', niet 'heten'.",
          difficult: ['heet', 'naam'],
          used: name ? [name.split(/\s+/)[0] ?? ''] : [],
          next: 'Waar woon je?',
          summary: "De leerling oefent met zichzelf voorstellen en moet 'Ik heet ...' herhalen.",
        };
      },
    },
    {
      regex: /^ik\s+zijn\s+(.+)$/i,
      make: (m) => {
        const tail = preserveTail(m[1] ?? '');
        return {
          better: `Ik ben ${tail}.`,
          correction: "Bij 'ik' zeg je 'ben', niet 'zijn'.",
          difficult: ['ben'],
          used: wordsFrom(tail).slice(0, 1),
          next: 'Hoe voel je je vandaag?',
          summary: "De leerling oefent het werkwoord 'zijn' met 'ik'.",
        };
      },
    },
    {
      regex: /^ik\s+wonen\s+in\s+(.+)$/i,
      make: (m) => {
        const place = preserveTail(m[1] ?? '');
        return {
          better: `Ik woon in ${place}.`,
          correction: "Bij 'ik' zeg je 'woon', niet 'wonen'.",
          difficult: ['woon', place].filter(Boolean),
          used: [place].filter(Boolean),
          next: 'Woon je graag daar?',
          summary: "De leerling oefent met woonplaats en moet 'Ik woon in ...' herhalen.",
        };
      },
    },
    {
      regex: /^ik\s+kopen\s+(.+)$/i,
      make: (m) => {
        const item = preserveTail(m[1] ?? '');
        return {
          better: `Ik koop ${item}.`,
          correction: "Bij 'ik' zeg je 'koop', niet 'kopen'.",
          difficult: ['koop', ...wordsFrom(item)],
          used: wordsFrom(item).slice(0, 1),
          next: 'Wat koop je nog meer?',
          summary: "De leerling kan een kort antwoord geven, maar oefent werkwoorden met 'ik'.",
        };
      },
    },
    {
      regex: /^ik\s+gaan\s+naar\s+(.+)$/i,
      make: (m) => {
        const place = preserveTail(m[1] ?? '');
        return {
          better: `Ik ga naar ${place}.`,
          correction: "Bij 'ik' zeg je 'ga', niet 'gaan'.",
          difficult: ['ga', 'naar', place].filter(Boolean),
          used: [place].filter(Boolean),
          next: 'Wanneer ga je daarheen?',
          summary: "De leerling oefent het werkwoord 'gaan' met 'ik'.",
        };
      },
    },
    {
      regex: /^gisteren\s+ik\s+ga\b(.*)$/i,
      make: (m) => {
        const rest = preserveTail(m[1] ?? '');
        return {
          better: ensurePeriod(`Gisteren ging ik${rest ? ` ${rest}` : ''}`),
          correction: "Na 'gisteren' gebruik je hier verleden tijd: 'ging'.",
          difficult: ['gisteren', 'ging'],
          used: ['gisteren'],
          next: 'Wat deed je daarna?',
          summary: "De leerling oefent met verleden tijd na 'gisteren'.",
        };
      },
    },
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern.regex);
    if (!match) continue;
    const result = pattern.make(match);
    return {
      positive: 'Goed geprobeerd, je gebruikt een korte Nederlandse zin.',
      correction: result.correction,
      betterSentence: result.better,
      difficultWords: unique(result.difficult.map((word) => word.toLowerCase())).slice(
        0,
        MAX_WORDS,
      ),
      usedGoodWords: unique(result.used.map(cleanText).filter(Boolean)).slice(0, MAX_WORDS),
      recommendedNextQuestion: result.next,
      difficultyChange: 'same',
      summary: result.summary,
    };
  }

  if (/hoe heet je|stel jezelf voor|naam/i.test(prompt) && /^ik\s+heet\s+.+/i.test(trimmed)) {
    return {
      positive: 'Goed gedaan, je stelt jezelf duidelijk voor.',
      correction: 'Deze zin is goed. Spreek rustig en duidelijk.',
      betterSentence: ensurePeriod(capitalizeFirst(trimmed)),
      difficultWords: ['heet', 'naam'],
      usedGoodWords: wordsFrom(trimmed)
        .filter((word) => !['ik', 'heet'].includes(word))
        .slice(0, 1),
      recommendedNextQuestion: 'Waar woon je?',
      difficultyChange: 'same',
      summary: "De leerling kan zichzelf voorstellen met 'Ik heet ...'.",
    };
  }

  return null;
}

export function getRepeatWords(): string[] {
  return REPEAT_WORDS;
}

export function generatePracticeQuestions(level: Level, count = 5): PracticeQuestion[] {
  const pool = PRACTICE_QUESTIONS[level] ?? PRACTICE_QUESTIONS.A1;
  return [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
}

export function generateRulesFeedback(
  answer: string,
  repeatWords: string[],
  prompt: string,
): PracticeFeedback {
  const deterministic = deterministicA1Correction(answer, prompt);
  if (deterministic) return deterministic;

  const trimmed = answer.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lowerAnswer = trimmed.toLowerCase();
  const usedGoodWords = repeatWords.filter((word) => lowerAnswer.includes(word.toLowerCase()));
  const unusedRepeatWords = repeatWords.filter((word) => !lowerAnswer.includes(word.toLowerCase()));

  let positive: string;
  let correction: string | null = null;
  let betterSentence: string | null = null;
  let difficultyChange: PracticeFeedback['difficultyChange'] = 'same';

  if (wordCount === 0) {
    positive = 'Probeer een antwoord te geven, ook al is het maar één zin.';
    correction = 'Typ of spreek je antwoord in. Elk woord telt.';
    difficultyChange = 'easier';
  } else if (wordCount < 4) {
    positive = 'Goed begin! Je hebt iets gezegd.';
    correction = 'Probeer een volledige zin te maken met meer woorden.';
    betterSentence = 'Probeer zoiets als: "Ik denk dat..." of "Mijn antwoord is..."';
    difficultyChange = 'easier';
  } else if (wordCount <= 10) {
    positive = 'Prima antwoord! Je hebt een goede zin gemaakt.';
    correction = 'Kun je ook uitleggen waarom? Gebruik het woord "omdat" of "want".';
  } else {
    positive = 'Uitstekend! Je hebt een uitgebreid antwoord gegeven.';
    correction = wordCount < 25 ? 'Kun je ook een concreet voorbeeld of detail toevoegen?' : null;
    difficultyChange = 'harder';
  }

  if (usedGoodWords.length > 0) {
    positive += ` Mooi dat je "${usedGoodWords[0]}" hebt gebruikt.`;
  }

  if (unusedRepeatWords.length > 0 && wordCount >= 4) {
    const hint = `Probeer in je volgende antwoord het woord "${unusedRepeatWords[0]}" te gebruiken.`;
    correction = correction ? `${correction} ${hint}` : hint;
  }

  return {
    positive,
    correction,
    betterSentence,
    difficultWords: [],
    usedGoodWords,
    recommendedNextQuestion: null,
    difficultyChange,
    summary:
      wordCount === 0
        ? `Geen antwoord gegeven op: "${prompt}"`
        : `${wordCount} woorden geoefend op vraag: "${prompt}".`,
  };
}
