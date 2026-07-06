import { useCallback, useEffect, useRef, useState } from 'react';
import { SamExplains } from '../../components/SamExplains';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { GameTagBadge, LevelBadge } from '../../components/ui/Badge';
import { useGameStats } from '../../hooks/useGameStats';
import { cn } from '../../lib/cn';
import {
  CONVERSATION_TOPICS,
  GESPREK_LEVELS,
  getConversationTopic,
  type ConversationTopic,
  type GesprekLevel,
  type TopicTone,
} from '../../lib/practice/conversation/topics';
import { generateConversationReply } from '../../lib/practice/conversation/rules';
import type {
  ISpeechRecognition,
  SpeechRecognitionErrorEvent,
  SpeechRecognitionEvent,
} from '../../types/speech';
import { aiGesprekGame } from './meta';

type ChatRole = 'user' | 'assistant';
type LevelFilter = GesprekLevel | 'all';

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

interface StoredState {
  topicId: string;
  messages: ChatMessage[];
}

const STORAGE_KEY = 'samenspraak.aiGesprek';
const MAX_STORED = 20;

const TONE_CHIP: Record<TopicTone, string> = {
  brand: 'bg-primary/10 text-primary',
  sky: 'bg-sky-100 text-sky-700',
  amber: 'bg-amber-100 text-amber-700',
  violet: 'bg-violet-100 text-violet-700',
  rose: 'bg-rose-100 text-rose-700',
  teal: 'bg-teal-100 text-teal-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  gray: 'bg-gray-100 text-gray-600',
};

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<ChatMessage>;
  return (
    (item.role === 'user' || item.role === 'assistant') &&
    typeof item.id === 'string' &&
    typeof item.content === 'string'
  );
}

function readStored(): StoredState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    if (typeof parsed.topicId !== 'string' || !Array.isArray(parsed.messages)) return null;
    const messages = parsed.messages.filter(isChatMessage);
    return messages.length > 0 ? { topicId: parsed.topicId, messages } : null;
  } catch {
    return null;
  }
}

function writeStored(topic: ConversationTopic, messages: ChatMessage[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ topicId: topic.id, messages: messages.slice(-MAX_STORED) }),
    );
  } catch {
    // Local storage may be unavailable in private mode.
  }
}

export default function AIGesprekGame() {
  const [topic, setTopic] = useState<ConversationTopic | null>(null);
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [interim, setInterim] = useState('');
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const [recording, setRecording] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const { recordRound } = useGameStats();

  useEffect(() => {
    setSpeechAvailable(!!(window.SpeechRecognition ?? window.webkitSpeechRecognition));
    const stored = readStored();
    if (stored) {
      const storedTopic = getConversationTopic(stored.topicId);
      if (storedTopic) {
        setTopic(storedTopic);
        setMessages(stored.messages);
      }
    }
    return () => {
      window.speechSynthesis?.cancel();
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
    };
  }, []);

  useEffect(() => {
    if (topic && messages.length > 0) writeStored(topic, messages);
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [topic, messages]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
  }, []);

  const speak = useCallback(
    (id: string, text: string) => {
      if (!('speechSynthesis' in window) || !text.trim()) return;
      stopSpeaking();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'nl-NL';
      utterance.rate = 0.9;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    },
    [stopSpeaking],
  );

  const startTopic = useCallback(
    (nextTopic: ConversationTopic) => {
      stopSpeaking();
      const opener: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: nextTopic.opener,
      };
      setTopic(nextTopic);
      setMessages([opener]);
      setInput('');
      setInterim('');
      setError(null);
      setTimeout(() => speak(opener.id, opener.content), 120);
    },
    [speak, stopSpeaking],
  );

  const resetTopic = useCallback(() => {
    stopSpeaking();
    try {
      recognitionRef.current?.stop();
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setTopic(null);
    setMessages([]);
    setInput('');
    setInterim('');
    setError(null);
    setRecording(false);
  }, [stopSpeaking]);

  const sendMessage = useCallback(
    (textArg?: string) => {
      if (!topic) return;
      const text = (textArg ?? input).trim();
      if (!text) {
        setError('Typ of spreek eerst een bericht.');
        return;
      }

      stopSpeaking();
      setError(null);
      setRecording(false);
      setInterim('');
      const userMessage: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: text };
      const history = [...messages, userMessage];
      const reply = generateConversationReply({
        topicId: topic.id,
        level: topic.level,
        history: history.map((message) => ({ role: message.role, content: message.content })),
      });
      const assistantMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: reply,
      };
      setMessages([...history, assistantMessage]);
      setInput('');
      recordRound('ai-gesprek');
      setTimeout(() => speak(assistantMessage.id, assistantMessage.content), 120);
    },
    [input, messages, recordRound, speak, stopSpeaking, topic],
  );

  const startRecording = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    setError(null);
    const recognition = new SpeechRecognition();
    recognition.lang = 'nl-NL';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i]?.[0]?.transcript ?? '';
        if (event.results[i]?.isFinal) finalText += transcript;
        else interimText += transcript;
      }
      if (finalText) setInput((prev) => `${prev} ${finalText}`.trim());
      setInterim(interimText);
    };
    recognition.onend = () => {
      setRecording(false);
      setInterim('');
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setRecording(false);
      setInterim('');
      if (event.error === 'not-allowed') {
        setError('Microfoon geblokkeerd. Sta microfoontoegang toe of typ je bericht.');
      } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setError('Spraakherkenning lukt niet in deze browser. Typen werkt altijd.');
      }
    };
    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    setRecording(false);
    setInterim('');
  }, []);

  const visibleTopics = CONVERSATION_TOPICS.filter(
    (item) => levelFilter === 'all' || item.level === levelFilter,
  );
  const composedInput = input + (interim ? `${input ? ' ' : ''}${interim}` : '');

  if (!topic) {
    return (
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-rounded text-[24px]" aria-hidden="true">
                forum
              </span>
              <h1 className="text-2xl font-bold tracking-tight">AI-gesprek</h1>
            </div>
            <GameTagBadge tag={aiGesprekGame.tag} />
          </div>
          <p className="text-sm text-muted">{aiGesprekGame.description}</p>
        </header>

        <Card className="p-4">
          <p className="text-sm font-bold text-ink">Kies een onderwerp</p>
          <p className="mt-1 text-sm text-muted">
            Sam antwoordt met vaste gespreksregels in deze browser. Er gaat niets naar een server.
          </p>
        </Card>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-bold text-muted">Niveau</span>
          {(['all', ...GESPREK_LEVELS] as LevelFilter[]).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setLevelFilter(level)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-bold transition-colors',
                levelFilter === level
                  ? 'bg-primary text-primary-fg'
                  : 'bg-surface text-muted shadow-card hover:text-ink',
              )}
            >
              {level === 'all' ? 'Alle' : level}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {visibleTopics.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => startTopic(item)}
              className="rounded-card bg-surface p-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black',
                    TONE_CHIP[item.tone],
                  )}
                  aria-hidden="true"
                >
                  {item.label.charAt(0).toUpperCase()}
                </span>
                <LevelBadge level={item.level} />
              </div>
              <p className="font-bold text-ink">{item.label}</p>
              <p className="mt-1 text-sm text-muted">{item.description}</p>
              <p className="mt-3 text-xs italic text-muted">"{item.opener}"</p>
            </button>
          ))}
        </div>

        <SamExplains steps={aiGesprekGame.howToPlay} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex items-center justify-between gap-3 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black',
              TONE_CHIP[topic.tone],
            )}
            aria-hidden="true"
          >
            {topic.label.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{topic.label}</p>
            <p className="text-xs text-muted">Niveau {topic.level} · lokaal gesprek</p>
          </div>
        </div>
        <Button variant="secondary" onClick={resetTopic} className="shrink-0 px-3 text-sm">
          Nieuw
        </Button>
      </Card>

      <Card className="flex h-[30rem] flex-col overflow-hidden">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[82%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
                  message.role === 'user'
                    ? 'rounded-br-sm bg-primary text-primary-fg'
                    : 'rounded-bl-sm bg-bg text-ink',
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.role === 'assistant' && 'speechSynthesis' in window && (
                  <button
                    type="button"
                    onClick={() =>
                      speakingId === message.id
                        ? stopSpeaking()
                        : speak(message.id, message.content)
                    }
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-muted hover:text-primary"
                  >
                    <span className="material-symbols-rounded text-[15px]" aria-hidden="true">
                      {speakingId === message.id ? 'stop' : 'volume_up'}
                    </span>
                    {speakingId === message.id ? 'Stop' : 'Lees voor'}
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-3">
          {error && (
            <p className="mb-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {error}
            </p>
          )}
          {recording && <p className="mb-2 text-xs font-bold text-sky-700">Aan het luisteren...</p>}
          <div className="flex items-end gap-2">
            <textarea
              value={composedInput}
              onChange={(event) => setInput(event.target.value)}
              rows={1}
              disabled={recording}
              placeholder={recording ? 'Aan het luisteren...' : 'Typ je bericht in het Nederlands'}
              className="min-h-tap flex-1 resize-none rounded-xl border border-border bg-bg px-3 py-2 text-sm text-ink focus:border-primary"
            />
            {speechAvailable && (
              <button
                type="button"
                onClick={recording ? stopRecording : startRecording}
                aria-label={recording ? 'Stop opname' : 'Spreek je bericht in'}
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white transition-colors',
                  recording ? 'bg-rose-500' : 'bg-sky-500 hover:bg-sky-600',
                )}
              >
                <span className="material-symbols-rounded text-[22px]" aria-hidden="true">
                  {recording ? 'stop' : 'mic'}
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={recording || !composedInput.trim()}
              aria-label="Verstuur bericht"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-fg transition-colors hover:bg-primary/95 disabled:opacity-50"
            >
              <span className="material-symbols-rounded text-[22px]" aria-hidden="true">
                send
              </span>
            </button>
          </div>
          {!speechAvailable && (
            <p className="mt-2 text-xs text-muted">
              Spraakherkenning werkt niet in deze browser. Typen werkt altijd.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
