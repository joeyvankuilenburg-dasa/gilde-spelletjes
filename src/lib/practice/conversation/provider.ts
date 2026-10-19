import type { GesprekLevel } from './topics';

export interface ProviderConfig {
  apiKey: string;
  authHeader: string;
  authScheme: string;
  baseUrl: string;
  maxOutputTokens: number;
  model: string;
  temperature?: number;
  timeoutMs: number;
}

export interface ProviderConversation {
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  level: GesprekLevel;
  topicDescription: string;
  topicLabel: string;
  topicRoleplay: string;
}

interface OpenAiCompatibleResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

const MAX_PROVIDER_REPLY_LENGTH = 2_000;

function completionUrl(baseUrl: string): string {
  const normalized = baseUrl.trim().replace(/\/+$/, '');
  return normalized.endsWith('/chat/completions') ? normalized : `${normalized}/chat/completions`;
}

function systemPrompt(conversation: ProviderConversation): string {
  return [
    'Je bent Sam, een vriendelijke Nederlandse gesprekspartner voor volwassen taalleerders.',
    `Praat op ERK-niveau ${conversation.level}.`,
    `Het onderwerp is "${conversation.topicLabel}": ${conversation.topicDescription}`,
    `Mogelijk rollenspel: ${conversation.topicRoleplay}`,
    'Antwoord uitsluitend in natuurlijk Nederlands.',
    'Gebruik één tot drie korte zinnen en stel hoogstens één vervolgvraag.',
    'Verbeter fouten alleen kort en bemoedigend wanneer dat echt helpt.',
    'Vraag niet om gevoelige persoonsgegevens en beweer niet dat je een mens bent.',
  ].join('\n');
}

function parseProviderResponse(value: unknown): string {
  if (!value || typeof value !== 'object') throw new Error('Ongeldig antwoord van AI-provider');
  const response = value as OpenAiCompatibleResponse;
  const content = response.choices?.[0]?.message?.content?.trim();
  if (!content || content.length > MAX_PROVIDER_REPLY_LENGTH) {
    throw new Error('AI-provider gaf geen bruikbaar antwoord');
  }
  return content;
}

export async function requestOpenAiCompatibleReply(
  config: ProviderConfig,
  conversation: ProviderConversation,
  fetcher: typeof fetch = fetch,
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
  const authorization = config.authScheme ? `${config.authScheme} ${config.apiKey}` : config.apiKey;

  try {
    const response = await fetcher(completionUrl(config.baseUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        [config.authHeader]: authorization,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemPrompt(conversation) },
          ...conversation.history.slice(-12),
        ],
        max_tokens: config.maxOutputTokens,
        ...(config.temperature === undefined ? {} : { temperature: config.temperature }),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`AI-provider antwoordde met status ${response.status}`);
    }

    const data: unknown = await response.json();
    return parseProviderResponse(data);
  } finally {
    clearTimeout(timeout);
  }
}

export const __internal = {
  completionUrl,
  parseProviderResponse,
  systemPrompt,
};
