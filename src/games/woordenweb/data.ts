import type { WordPrompt } from '../../types/content';

export const WORD_PROMPTS: WordPrompt[] = [
  // ── A1 ──────────────────────────────────────────────────────────────────
  { id: 'wp-a1-huis', word: 'huis', emoji: '🏠', levels: ['A1'], category: 'Wonen' },
  { id: 'wp-a1-eten', word: 'eten', emoji: '🍽️', levels: ['A1'], category: 'Eten' },
  { id: 'wp-a1-school', word: 'school', emoji: '🏫', levels: ['A1'], category: 'Werk' },
  { id: 'wp-a1-kleur', word: 'kleur', emoji: '🎨', levels: ['A1'], category: 'Vrije tijd' },
  { id: 'wp-a1-dier', word: 'dier', emoji: '🐾', levels: ['A1'], category: 'Wonen' },
  { id: 'wp-a1-kleding', word: 'kleding', emoji: '👕', levels: ['A1'], category: 'Vrije tijd' },
  { id: 'wp-a1-familie', word: 'familie', emoji: '👨‍👩‍👧', levels: ['A1', 'A2'], category: 'Familie' },
  { id: 'wp-a1-lichaam', word: 'lichaam', emoji: '🧍', levels: ['A1'], category: 'Gezondheid' },
  { id: 'wp-a1-fruit', word: 'fruit', emoji: '🍎', levels: ['A1'], category: 'Eten' },
  { id: 'wp-a1-water', word: 'water', emoji: '💧', levels: ['A1'], category: 'Eten' },
  { id: 'wp-a1-dag', word: 'dag', emoji: '☀️', levels: ['A1'], category: 'Vrije tijd' },
  { id: 'wp-a1-straat', word: 'straat', emoji: '🛣️', levels: ['A1'], category: 'Buurt' },

  // ── A2 ──────────────────────────────────────────────────────────────────
  { id: 'wp-a2-vakantie', word: 'vakantie', emoji: '✈️', levels: ['A2'], category: 'Reizen' },
  { id: 'wp-a2-weekend', word: 'weekend', emoji: '🎉', levels: ['A2'], category: 'Vrije tijd' },
  { id: 'wp-a2-boodschappen', word: 'boodschappen', emoji: '🛒', levels: ['A2'], category: 'Eten' },
  { id: 'wp-a2-sport', word: 'sport', emoji: '⚽', levels: ['A2'], category: 'Vrije tijd' },
  { id: 'wp-a2-muziek', word: 'muziek', emoji: '🎵', levels: ['A2'], category: 'Vrije tijd' },
  { id: 'wp-a2-verjaardag', word: 'verjaardag', emoji: '🎂', levels: ['A2'], category: 'Familie' },
  { id: 'wp-a2-zomer', word: 'zomer', emoji: '🌞', levels: ['A2'], category: 'Vrije tijd' },
  { id: 'wp-a2-winter', word: 'winter', emoji: '❄️', levels: ['A2'], category: 'Vrije tijd' },
  { id: 'wp-a2-koken', word: 'koken', emoji: '👨‍🍳', levels: ['A2', 'B1'], category: 'Eten' },
  { id: 'wp-a2-vrienden', word: 'vrienden', emoji: '🤝', levels: ['A2'], category: 'Familie' },
  { id: 'wp-a2-markt', word: 'markt', emoji: '🏪', levels: ['A2'], category: 'Eten' },
  { id: 'wp-a2-trein', word: 'trein', emoji: '🚆', levels: ['A2'], category: 'Reizen' },

  // ── B1 ──────────────────────────────────────────────────────────────────
  { id: 'wp-b1-reizen', word: 'reizen', emoji: '🗺️', levels: ['B1'], category: 'Reizen' },
  { id: 'wp-b1-gezondheid', word: 'gezondheid', emoji: '💊', levels: ['B1'], category: 'Gezondheid' },
  { id: 'wp-b1-natuur', word: 'natuur', emoji: '🌿', levels: ['B1'], category: 'Vrije tijd' },
  { id: 'wp-b1-geld', word: 'geld', emoji: '💶', levels: ['B1'], category: 'Werk' },
  { id: 'wp-b1-werk', word: 'werk', emoji: '💼', levels: ['B1'], category: 'Werk' },
  { id: 'wp-b1-stad', word: 'stad', emoji: '🏙️', levels: ['B1'], category: 'Wonen' },
  { id: 'wp-b1-vrijwillig', word: 'vrijwilligerswerk', emoji: '🤲', levels: ['B1'], category: 'Werk' },
  { id: 'wp-b1-feest', word: 'feest', emoji: '🥳', levels: ['B1'], category: 'Vrije tijd' },
  { id: 'wp-b1-internet', word: 'internet', emoji: '🌐', levels: ['B1', 'B2'], category: 'Vrije tijd' },
  { id: 'wp-b1-school-b1', word: 'opleiding', emoji: '📚', levels: ['B1'], category: 'Werk' },
  { id: 'wp-b1-buurt', word: 'buurt', emoji: '🏘️', levels: ['B1'], category: 'Buurt' },
  { id: 'wp-b1-winkelen', word: 'winkelen', emoji: '🛍️', levels: ['B1'], category: 'Vrije tijd' },

  // ── B2 ──────────────────────────────────────────────────────────────────
  { id: 'wp-b2-klimaat', word: 'klimaat', emoji: '🌍', levels: ['B2'], category: 'Buurt' },
  { id: 'wp-b2-cultuur', word: 'cultuur', emoji: '🎭', levels: ['B2'], category: 'Familie' },
  { id: 'wp-b2-technologie', word: 'technologie', emoji: '💻', levels: ['B2'], category: 'Werk' },
  { id: 'wp-b2-onderwijs', word: 'onderwijs', emoji: '🎓', levels: ['B2'], category: 'Werk' },
  { id: 'wp-b2-geluk', word: 'geluk', emoji: '😊', levels: ['B2'], category: 'Gezondheid' },
  { id: 'wp-b2-vrijheid', word: 'vrijheid', emoji: '🕊️', levels: ['B2'], category: 'Buurt' },
  { id: 'wp-b2-integratie', word: 'integratie', emoji: '🤝', levels: ['B2'], category: 'Buurt' },
  { id: 'wp-b2-toekomst', word: 'toekomst', emoji: '🔭', levels: ['B2'], category: 'Werk' },
  { id: 'wp-b2-media', word: 'media', emoji: '📱', levels: ['B1', 'B2'], category: 'Vrije tijd' },
  { id: 'wp-b2-democratie', word: 'democratie', emoji: '🗳️', levels: ['B2'], category: 'Buurt' },
  { id: 'wp-b2-gezin', word: 'gezin', emoji: '👨‍👩‍👦', levels: ['B1', 'B2'], category: 'Familie' },
  { id: 'wp-b2-duurzaamheid', word: 'duurzaamheid', emoji: '♻️', levels: ['B2'], category: 'Buurt' },
];
