import type { ConversationContext } from './rules';

interface ApiReply {
  reply: string;
  model?: string;
}

export interface ConversationApiResult {
  reply: string;
  model?: string;
}

const API_TIMEOUT_MS = 20_000;
const MAX_REPLY_LENGTH = 2_000;

function isApiReply(value: unknown): value is ApiReply {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ApiReply>;
  return (
    typeof candidate.reply === 'string' &&
    candidate.reply.trim().length > 0 &&
    candidate.reply.length <= MAX_REPLY_LENGTH &&
    (candidate.model === undefined || typeof candidate.model === 'string')
  );
}

/**
 * Vraagt de server-side AI-gateway om een antwoord. Geeft `null` terug bij
 * ontbrekende configuratie, netwerkfouten en ongeldige providerantwoorden,
 * zodat de browser altijd kan terugvallen op de lokale gespreksregels.
 */
export async function requestConversationReply(
  context: ConversationContext,
): Promise<ConversationApiResult | null> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(context),
      signal: controller.signal,
    });
    if (!response.ok) return null;

    const data: unknown = await response.json();
    if (!isApiReply(data)) return null;

    return {
      reply: data.reply.trim(),
      ...(data.model ? { model: data.model } : {}),
    };
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
}
