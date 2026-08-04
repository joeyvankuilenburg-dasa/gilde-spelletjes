import { describe, expect, it, vi } from 'vitest';
import {
  requestOpenAiCompatibleReply,
  type ProviderConfig,
  type ProviderConversation,
} from './provider';

const CONFIG: ProviderConfig = {
  apiKey: 'test-secret',
  authHeader: 'Authorization',
  authScheme: 'Bearer',
  baseUrl: 'https://provider.example/v1/',
  maxOutputTokens: 220,
  model: 'flash-model',
  temperature: 0.7,
  timeoutMs: 5_000,
};

const CONVERSATION: ProviderConversation = {
  level: 'A2',
  topicLabel: 'Reizen',
  topicDescription: 'Praat over reizen.',
  topicRoleplay: 'Boek een hotelkamer.',
  history: [{ role: 'user', content: 'Ik ga graag met de trein.' }],
};

describe('requestOpenAiCompatibleReply', () => {
  it('stuurt een provider-neutraal chat-completionsverzoek', async () => {
    const fetcher = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => {
      return new Response(
        JSON.stringify({ choices: [{ message: { content: 'Leuk! Waar reis je naartoe?' } }] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    });

    const reply = await requestOpenAiCompatibleReply(CONFIG, CONVERSATION, fetcher);

    expect(reply).toBe('Leuk! Waar reis je naartoe?');
    expect(fetcher).toHaveBeenCalledOnce();
    const [url, init] = fetcher.mock.calls[0]!;
    expect(url).toBe('https://provider.example/v1/chat/completions');
    expect(init?.headers).toMatchObject({ Authorization: 'Bearer test-secret' });
    expect(JSON.parse(String(init?.body))).toMatchObject({
      model: 'flash-model',
      max_tokens: 220,
      temperature: 0.7,
    });
  });

  it('weigert een leeg providerantwoord', async () => {
    const fetcher = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => {
      return new Response(JSON.stringify({ choices: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    await expect(requestOpenAiCompatibleReply(CONFIG, CONVERSATION, fetcher)).rejects.toThrow(
      'geen bruikbaar antwoord',
    );
  });
});
