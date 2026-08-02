/**
 * Nederlandse stemkeuze voor de Web Speech API.
 *
 * `utterance.lang = 'nl-NL'` zetten is NIET genoeg: browsers kiezen dan vaak
 * alsnog de standaardstem van het systeem (meestal Engels), die Nederlandse
 * tekst met Engelse klanken uitspreekt. De stem moet expliciet gekozen worden.
 *
 * Stemmen laden asynchroon — `getVoices()` is bij de eerste aanroep vaak leeg.
 * Daarom cachen we hier en luisteren we naar `voiceschanged`.
 */

/** Hoe hoger de score, hoe natuurlijker de stem klinkt. */
function scoreVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  const isDutchNL = voice.lang === 'nl-NL';
  const isDutch = voice.lang.toLowerCase().startsWith('nl');
  if (!isDutch) return -1;

  let score = isDutchNL ? 100 : 50;

  // Edge levert 'Microsoft Fenna Online (Natural)' — dezelfde neurale stem als
  // de vooraf gegenereerde MP3's van Nazeggen.
  if (/natural|neural|online/.test(name)) score += 40;
  else if (/google/.test(name)) score += 25;

  // Niet-lokale stemmen draaien in de cloud en klinken doorgaans natuurlijker.
  if (!voice.localService) score += 10;

  return score;
}

let cachedVoice: SpeechSynthesisVoice | null = null;
let listening = false;

function resolveVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const best = voices
    .map((voice) => ({ voice, score: scoreVoice(voice) }))
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score)[0];

  return best?.voice ?? null;
}

/** De best beschikbare Nederlandse stem, of null als er geen is. */
export function getDutchVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  if (!listening) {
    listening = true;
    // Stemmen komen later binnen; dan opnieuw bepalen.
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      cachedVoice = resolveVoice();
    });
  }

  if (!cachedVoice) cachedVoice = resolveVoice();
  return cachedVoice;
}

export interface SpeakOptions {
  rate?: number;
  onEnd?: () => void;
  onError?: () => void;
}

/**
 * Spreekt Nederlandse tekst uit met een expliciet gekozen Nederlandse stem.
 * Doet niets (en roept `onError` aan) als de browser geen spraak ondersteunt.
 */
export function speakDutch(text: string, options: SpeakOptions = {}): void {
  const { rate = 0.9, onEnd, onError } = options;

  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text.trim()) {
    onError?.();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'nl-NL';
  utterance.rate = rate;

  const voice = getDutchVoice();
  if (voice) utterance.voice = voice;

  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;

  window.speechSynthesis.speak(utterance);
}
