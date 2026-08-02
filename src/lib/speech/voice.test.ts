import { describe, expect, it, beforeEach, vi } from 'vitest';

function voice(name: string, lang: string, localService = true): SpeechSynthesisVoice {
  return { name, lang, localService, default: false, voiceURI: name } as SpeechSynthesisVoice;
}

/**
 * voice.ts cachet de gekozen stem op moduleniveau, dus elke test laadt de
 * module opnieuw nadat de stemmenlijst is gezet.
 */
async function pickFrom(voices: SpeechSynthesisVoice[]) {
  vi.resetModules();
  vi.stubGlobal('speechSynthesis', {
    getVoices: () => voices,
    addEventListener: () => {},
  });
  const { getDutchVoice } = await import('./voice');
  return getDutchVoice();
}

describe('getDutchVoice', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('never returns a non-Dutch voice, even when it is the only one', async () => {
    expect(await pickFrom([voice('Microsoft David', 'en-US')])).toBeNull();
  });

  it('prefers the Edge neural voice over a plain local Dutch voice', async () => {
    const picked = await pickFrom([
      voice('Microsoft Frank', 'nl-NL'),
      voice('Microsoft Fenna Online (Natural)', 'nl-NL', false),
    ]);
    expect(picked?.name).toBe('Microsoft Fenna Online (Natural)');
  });

  it('prefers nl-NL over nl-BE', async () => {
    const picked = await pickFrom([
      voice('Belgische stem', 'nl-BE'),
      voice('Nederlandse stem', 'nl-NL'),
    ]);
    expect(picked?.name).toBe('Nederlandse stem');
  });

  it('falls back to nl-BE when no nl-NL voice exists', async () => {
    const picked = await pickFrom([
      voice('Microsoft David', 'en-US'),
      voice('Belgische stem', 'nl-BE'),
    ]);
    expect(picked?.name).toBe('Belgische stem');
  });

  it('returns null while the voice list is still empty', async () => {
    expect(await pickFrom([])).toBeNull();
  });
});
