import { useMemo, useState } from 'react';
import { SamExplains } from '../../components/SamExplains';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Chip, GameTagBadge, LevelBadge } from '../../components/ui/Badge';
import { useGameStats } from '../../hooks/useGameStats';
import { readStorage, writeStorage } from '../../lib/storage';
import {
  PROMPT_CARDS,
  PROMPT_CARD_STATUS_LABELS,
  type PromptCard,
  type PromptCardStatus,
} from '../../lib/practice/content';
import { promptkaartenGame } from './meta';

type LevelFilter = 'all' | 'A1' | 'A2' | 'B1';

const STORAGE_KEY = 'samenspraak.promptCards';
const LEVELS: LevelFilter[] = ['all', 'A1', 'A2', 'B1'];
const STATUS_OPTIONS: PromptCardStatus[] = ['saved', 'wants_to_practice', 'difficult', 'practiced'];

function isPromptCardStatus(value: unknown): value is PromptCardStatus {
  return (
    value === 'saved' ||
    value === 'wants_to_practice' ||
    value === 'difficult' ||
    value === 'practiced'
  );
}

function isStatusRecord(value: unknown): value is Record<string, PromptCardStatus> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return Object.values(value as Record<string, unknown>).every(isPromptCardStatus);
}

export default function PromptkaartenGame() {
  const [level, setLevel] = useState<LevelFilter>('all');
  const [theme, setTheme] = useState('all');
  const [savedOnly, setSavedOnly] = useState(false);
  const [selectedCard, setSelectedCard] = useState<PromptCard | null>(null);
  const [saved, setSaved] = useState<Record<string, PromptCardStatus>>(() =>
    readStorage(STORAGE_KEY, {}, isStatusRecord),
  );
  const { recordRound } = useGameStats();

  const themes = useMemo(
    () => ['all', ...Array.from(new Set(PROMPT_CARDS.map((card) => card.theme))).sort()],
    [],
  );

  const filteredCards = PROMPT_CARDS.filter((card) => {
    if (level !== 'all' && card.level !== level) return false;
    if (theme !== 'all' && card.theme !== theme) return false;
    if (savedOnly && !saved[card.id]) return false;
    return true;
  });

  function updateSaved(cardId: string, status?: PromptCardStatus) {
    const next = { ...saved };
    if (status) next[cardId] = status;
    else delete next[cardId];
    setSaved(next);
    writeStorage(STORAGE_KEY, next);
    recordRound('promptkaarten');
  }

  if (selectedCard) {
    const currentStatus = saved[selectedCard.id];
    return (
      <div className="flex flex-col gap-4">
        <Button variant="ghost" onClick={() => setSelectedCard(null)} className="w-fit px-0">
          <span className="material-symbols-rounded text-[18px]" aria-hidden="true">
            arrow_back
          </span>
          Terug naar kaartjes
        </Button>

        <Card className="flex flex-col gap-5 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <LevelBadge level={selectedCard.level} />
                <Chip>{selectedCard.theme}</Chip>
              </div>
              <h1 className="text-2xl font-bold text-ink">{selectedCard.title}</h1>
              <p className="mt-1 text-sm text-muted">{selectedCard.description}</p>
            </div>
            {currentStatus && <Chip>{PROMPT_CARD_STATUS_LABELS[currentStatus]}</Chip>}
          </div>

          <div className="rounded-xl border border-primary/15 bg-primary/10 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Spreekdoel</p>
            <p className="mt-1 text-sm font-bold text-ink">{selectedCard.speakingGoal}</p>
          </div>

          <section>
            <h2 className="text-sm font-bold text-ink">Vragen om te oefenen</h2>
            <ul className="mt-2 flex flex-col gap-1.5">
              {selectedCard.questions.map((question) => (
                <li key={question} className="flex items-start gap-2 text-sm text-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {question}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold text-ink">Handige zinnen</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedCard.usefulPhrases.map((phrase) => (
                <Chip key={phrase}>{phrase}</Chip>
              ))}
            </div>
          </section>

          {selectedCard.targetWords && selectedCard.targetWords.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-ink">Woorden om te oefenen</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedCard.targetWords.map((word) => (
                  <span
                    key={word}
                    className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </section>
          )}

          {selectedCard.tip && (
            <div className="rounded-xl border border-border bg-bg p-3">
              <p className="text-xs font-bold uppercase tracking-widest text-muted">Oefentip</p>
              <p className="mt-1 text-sm text-ink">{selectedCard.tip}</p>
            </div>
          )}

          <div className="border-t border-border pt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">
              Bewaar dit onderwerp
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => updateSaved(selectedCard.id, status)}
                  className={`rounded-xl border px-3 py-2 text-left text-sm font-bold transition-colors ${
                    currentStatus === status
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-surface text-ink hover:border-accent'
                  }`}
                >
                  {PROMPT_CARD_STATUS_LABELS[status]}
                </button>
              ))}
            </div>
            {currentStatus && (
              <button
                type="button"
                onClick={() => updateSaved(selectedCard.id)}
                className="mt-3 text-sm font-bold text-rose-600 hover:text-rose-700"
              >
                Verwijderen uit opgeslagen kaartjes
              </button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-rounded text-[24px]" aria-hidden="true">
              style
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Promptkaarten</h1>
          </div>
          <GameTagBadge tag={promptkaartenGame.tag} />
        </div>
        <p className="text-sm text-muted">{promptkaartenGame.description}</p>
      </header>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-widest text-muted">
            Niveau
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value as LevelFilter)}
              className="rounded-xl border border-border bg-bg px-3 py-2 text-sm normal-case tracking-normal text-ink"
            >
              {LEVELS.map((item) => (
                <option key={item} value={item}>
                  {item === 'all' ? 'Alle niveaus' : item}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-widest text-muted">
            Thema
            <select
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
              className="rounded-xl border border-border bg-bg px-3 py-2 text-sm normal-case tracking-normal text-ink"
            >
              {themes.map((item) => (
                <option key={item} value={item}>
                  {item === 'all' ? 'Alle thema’s' : item}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-end gap-2 rounded-xl border border-border px-3 py-2 text-sm font-bold text-ink hover:bg-bg">
            <input
              type="checkbox"
              checked={savedOnly}
              onChange={(event) => setSavedOnly(event.target.checked)}
            />
            Alleen opgeslagen
          </label>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {filteredCards.map((card) => {
          const status = saved[card.id];
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => setSelectedCard(card)}
              className="rounded-card bg-surface p-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <LevelBadge level={card.level} />
                    <span className="text-xs font-bold text-muted">{card.theme}</span>
                  </div>
                  <h2 className="text-base font-bold text-ink">{card.title}</h2>
                </div>
                {status && <Chip>Bewaard</Chip>}
              </div>
              <p className="mt-2 text-sm text-muted">{card.description}</p>
              <p className="mt-3 text-xs font-bold text-primary">Kaart bekijken</p>
            </button>
          );
        })}
      </div>

      {filteredCards.length === 0 && <p className="text-sm text-muted">Geen kaartjes gevonden.</p>}

      <SamExplains steps={promptkaartenGame.howToPlay} />
    </div>
  );
}
