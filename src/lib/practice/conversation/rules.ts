import {
  getConversationTopic,
  CONVERSATION_TOPICS,
  type ConversationTopic,
  type GesprekLevel,
} from './topics';

/**
 * Deterministic conversation engine for AI-gesprek. Scenario-aware
 * (per leveled topic), turn-aware, and intent-aware. Never repeats the previous
 * reply back-to-back.
 */

export interface ConversationContext {
  topicId: string;
  level: GesprekLevel;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
}

type Intent =
  | 'greeting'
  | 'farewell'
  | 'affirmative'
  | 'negative'
  | 'question'
  | 'unclear'
  | 'statement';

const FALLBACK_TOPIC: ConversationTopic = {
  id: 'vrij',
  level: 'A2',
  label: 'Vrij gesprek',
  description: 'Praat vrij over een onderwerp naar keuze.',
  opener: 'Hoi! Waar wil je over praten?',
  tone: 'gray',
  starterQuestions: [
    'Wat heb je deze week meegemaakt?',
    'Wat wil je graag beter leren in het Nederlands?',
    'Vertel iets wat jou onlangs verraste.',
  ],
  newWords: ['woordenschat', 'zinsbouw', 'uitspraak', 'vloeiendheid', 'gesprek'],
  roleplay: 'Voer een vrij gesprek over een onderwerp naar keuze.',
};

function detectIntent(text: string): Intent {
  const t = text.toLowerCase().trim();
  if (!t) return 'unclear';
  const words = t.split(/\s+/);

  if (/\b(hallo|hoi|hey|h[ée]|goedemorgen|goedemiddag|goedenavond|goeiedag)\b/.test(t))
    return 'greeting';
  if (/\b(doei|tot ziens|tot later|tot straks|dag dag|saluut)\b/.test(t)) return 'farewell';
  if (t.includes('?') || /^(wat|waar|wie|hoe|wanneer|waarom|welke|welk|hoeveel)\b/.test(t))
    return 'question';
  if (/\b(ja|jawel|zeker|natuurlijk|klopt|oké|oke|ok|prima|graag)\b/.test(t)) return 'affirmative';
  if (/\b(nee|niet|geen|nooit|helaas)\b/.test(t)) return 'negative';
  if (words.length < 3) return 'unclear';
  return 'statement';
}

/** Detects "wat betekent X" / "wat is X" and returns X (single word), else null. */
function extractMeaningQuestion(text: string): string | null {
  const m = text.match(/wat\s+(?:betekent|is)\s+["“']?([a-zà-ÿ]+)/i);
  return m ? m[1] : null;
}

function splitSentences(text: string): string[] {
  return text.split(/(?<=[.?!])\s+/).filter(Boolean);
}

/** Shortens a question to fit the level's complexity budget. */
function scaleQuestion(question: string, level: GesprekLevel): string {
  const sentences = splitSentences(question);
  if (level === 'A1') return sentences.slice(0, 1).join(' ');
  if (level === 'A2') return sentences.slice(0, 2).join(' ');
  return question;
}

function pick(items: string[], index: number): string {
  if (items.length === 0) return '';
  const i = ((index % items.length) + items.length) % items.length;
  return items[i];
}

export function generateConversationReply(ctx: ConversationContext): string {
  const topic = getConversationTopic(ctx.topicId) ?? FALLBACK_TOPIC;
  const level = ctx.level;
  const history = ctx.history;

  const lastUser = [...history].reverse().find((m) => m.role === 'user')?.content ?? '';
  const lastAssistant = [...history].reverse().find((m) => m.role === 'assistant')?.content ?? '';
  const assistantTurns = history.filter((m) => m.role === 'assistant').length;

  const questions = topic.starterQuestions;
  const intent = detectIntent(lastUser);
  const meaningWord = extractMeaningQuestion(lastUser);

  let reply: string;

  if (meaningWord) {
    reply = `Goede vraag! "${meaningWord}" is een handig woord. Kun jij een korte zin maken met "${meaningWord}"?`;
  } else if (intent === 'greeting') {
    reply = `Hallo! Leuk om met je te praten. ${scaleQuestion(pick(questions, 0), level)}`;
  } else if (intent === 'farewell') {
    reply = 'Tot ziens! Je hebt goed geoefend. Tot de volgende keer!';
  } else if (intent === 'unclear') {
    reply = `Goed geprobeerd! Zeg gerust iets meer. ${scaleQuestion(pick(questions, assistantTurns), level)}`;
  } else {
    let core: string;
    if (assistantTurns <= 2) {
      core = scaleQuestion(pick(questions, assistantTurns), level);
    } else if (assistantTurns <= 4) {
      const newWord = pick(topic.newWords, assistantTurns);
      core = `Een nieuw woord: "${newWord}". ${scaleQuestion(pick(questions, assistantTurns), level)}`;
    } else if (assistantTurns <= 6) {
      core = `Laten we oefenen: ${topic.roleplay}`;
    } else {
      core = scaleQuestion(pick(questions, assistantTurns), level);
    }

    const lead =
      intent === 'affirmative'
        ? 'Mooi! '
        : intent === 'negative'
          ? 'Oké, geen probleem. '
          : intent === 'question'
            ? 'Goede vraag! Wat denk jij zelf? '
            : '';
    reply = `${lead}${core}`;
  }

  reply = reply.trim();

  if (reply === lastAssistant.trim()) {
    reply =
      `Laten we verder praten. ${scaleQuestion(pick(questions, assistantTurns + 1), level)}`.trim();
  }

  return reply;
}

// Exposed for tests.
export const __internal = {
  detectIntent,
  extractMeaningQuestion,
  scaleQuestion,
  CONVERSATION_TOPICS,
};
