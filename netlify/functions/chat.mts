import type { Config, Context } from '@netlify/functions';
import {
  getConversationTopic,
  type GesprekLevel,
} from '../../src/lib/practice/conversation/topics';
import {
  requestOpenAiCompatibleReply,
  type ProviderConfig,
} from '../../src/lib/practice/conversation/provider';

type ChatRole = 'user' | 'assistant';

interface ChatTurn {
  role: ChatRole;
  content: string;
}

interface ChatRequestBody {
  topicId: string;
  level: GesprekLevel;
  history: ChatTurn[];
}

type ProviderName = 'rules' | 'gemini' | 'openai-compatible';

const MAX_BODY_LENGTH = 30_000;
const MAX_HISTORY_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 2_000;
const LEVELS = new Set<GesprekLevel>(['A1', 'A2', 'B1', 'B2']);

function json(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function parseChatTurn(value: unknown): ChatTurn | null {
  if (!isRecord(value)) return null;
  if (value.role !== 'user' && value.role !== 'assistant') return null;
  if (typeof value.content !== 'string') return null;
  const content = value.content.trim();
  if (!content || content.length > MAX_MESSAGE_LENGTH) return null;
  return { role: value.role, content };
}

function parseRequestBody(value: unknown): ChatRequestBody | null {
  if (!isRecord(value)) return null;
  if (typeof value.topicId !== 'string' || !LEVELS.has(value.level as GesprekLevel)) return null;
  if (!Array.isArray(value.history) || value.history.length === 0) return null;

  const history = value.history.slice(-MAX_HISTORY_LENGTH).map(parseChatTurn);
  if (history.some((turn) => turn === null)) return null;

  return {
    topicId: value.topicId,
    level: value.level as GesprekLevel,
    history: history as ChatTurn[],
  };
}

function numberFromEnv(name: string, fallback: number, minimum: number, maximum: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, minimum), maximum);
}

function providerName(): ProviderName {
  const value = process.env.AI_PROVIDER?.trim().toLowerCase();
  if (value === 'gemini' || value === 'openai-compatible') return value;
  return 'rules';
}

function providerConfig(provider: Exclude<ProviderName, 'rules'>): ProviderConfig | null {
  const apiKey = process.env.AI_API_KEY?.trim();
  if (!apiKey) return null;

  const gemini = provider === 'gemini';
  const baseUrl =
    process.env.AI_BASE_URL?.trim() ||
    (gemini ? 'https://generativelanguage.googleapis.com/v1beta/openai' : '');
  const model = process.env.AI_MODEL?.trim() || (gemini ? 'gemini-3.6-flash' : '');
  if (!baseUrl || !model) return null;

  return {
    apiKey,
    authHeader: process.env.AI_AUTH_HEADER?.trim() || 'Authorization',
    authScheme: process.env.AI_AUTH_SCHEME?.trim() ?? 'Bearer',
    baseUrl,
    model,
    timeoutMs: numberFromEnv('AI_TIMEOUT_MS', 15_000, 1_000, 30_000),
    maxOutputTokens: Math.round(numberFromEnv('AI_MAX_OUTPUT_TOKENS', 220, 50, 1_000)),
    temperature: numberFromEnv('AI_TEMPERATURE', 0.7, 0, 2),
  };
}

export default async function handler(request: Request, _context: Context): Promise<Response> {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BODY_LENGTH) return json({ error: 'request_too_large' }, 413);

  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_LENGTH) return json({ error: 'request_too_large' }, 413);

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const body = parseRequestBody(parsed);
  const topic = body ? getConversationTopic(body.topicId) : undefined;
  if (!body || !topic || topic.level !== body.level) {
    return json({ error: 'invalid_request' }, 400);
  }

  const provider = providerName();
  if (provider === 'rules') return json({ error: 'api_not_configured' }, 503);

  const config = providerConfig(provider);
  if (!config) return json({ error: 'api_not_configured' }, 503);

  try {
    const reply = await requestOpenAiCompatibleReply(config, {
      level: body.level,
      topicLabel: topic.label,
      topicDescription: topic.description,
      topicRoleplay: topic.roleplay,
      history: body.history,
    });
    return json({ reply, model: config.model });
  } catch (error: unknown) {
    console.error('AI provider request failed', error);
    return json({ error: 'provider_unavailable' }, 502);
  }
}

export const config: Config = {
  path: '/api/chat',
};
