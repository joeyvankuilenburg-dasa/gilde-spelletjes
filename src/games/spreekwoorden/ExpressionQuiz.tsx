import { useMemo, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LevelBadge } from '../../components/ui/Badge';
import { useGameStats } from '../../hooks/useGameStats';
import {
  BLANK,
  EXPRESSION_LEVELS,
  FINISH_EXPRESSIONS,
  MEANING_EXPRESSIONS,
  type ExpressionLevel,
  type FinishExpression,
  type MeaningExpression,
} from '../../lib/practice/expressions/expressions';

type QuizMode = 'finish' | 'meaning';
type LevelFilter = ExpressionLevel | 'all';
const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

interface BaseQuestion {
  id: string;
  level: ExpressionLevel;
  options: string[];
  correct: string;
}

interface FinishQuestion extends BaseQuestion {
  source: FinishExpression;
}

interface MeaningQuestion extends BaseQuestion {
  source: MeaningExpression;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function buildFinishDeck(level: LevelFilter): FinishQuestion[] {
  return shuffle(FINISH_EXPRESSIONS.filter((item) => level === 'all' || item.level === level)).map(
    (source) => ({
      id: source.id,
      level: source.level,
      options: shuffle(source.options),
      correct: source.answer,
      source,
    }),
  );
}

function buildMeaningDeck(level: LevelFilter): MeaningQuestion[] {
  return shuffle(MEANING_EXPRESSIONS.filter((item) => level === 'all' || item.level === level)).map(
    (source) => ({
      id: source.id,
      level: source.level,
      options: shuffle(source.options),
      correct: source.meaning,
      source,
    }),
  );
}

function FinishPrompt({ question, answered }: { question: FinishQuestion; answered: boolean }) {
  const [before, after] = question.source.template.split(BLANK);
  return (
    <p className="text-xl font-bold leading-relaxed text-ink">
      {before}
      <span
        className={`mx-1 inline-block min-w-[3.5rem] rounded-md border-b-2 px-2 text-center ${
          answered ? 'border-primary text-primary' : 'border-dashed border-muted text-muted'
        }`}
      >
        {answered ? question.correct : '...'}
      </span>
      {after}
    </p>
  );
}

function MeaningPrompt({ question }: { question: MeaningQuestion }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xl font-bold text-ink">"{question.source.expression}"</p>
      <div className="rounded-xl border border-dashed border-border bg-bg px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">Letterlijk</p>
        <p className="mt-1 text-sm italic text-muted">{question.source.literal}</p>
      </div>
      <p className="text-sm font-bold text-ink">Wat betekent dit echt?</p>
    </div>
  );
}

export function ExpressionQuiz() {
  const [mode, setMode] = useState<QuizMode>('finish');
  const [level, setLevel] = useState<LevelFilter>('all');
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ answered: 0, correct: 0 });
  const { recordRound } = useGameStats();

  const deck = useMemo<(FinishQuestion | MeaningQuestion)[]>(() => {
    void round;
    return mode === 'finish' ? buildFinishDeck(level) : buildMeaningDeck(level);
  }, [mode, level, round]);
  const question = deck[index];
  const answered = picked !== null;
  const finished = index >= deck.length;
  const isCorrect = picked === question?.correct;

  function restart() {
    setRound((value) => value + 1);
    setIndex(0);
    setPicked(null);
    setScore({ answered: 0, correct: 0 });
  }

  function changeMode(nextMode: QuizMode) {
    setMode(nextMode);
    setIndex(0);
    setPicked(null);
    setScore({ answered: 0, correct: 0 });
  }

  function changeLevel(nextLevel: LevelFilter) {
    setLevel(nextLevel);
    setIndex(0);
    setPicked(null);
    setScore({ answered: 0, correct: 0 });
  }

  function pick(option: string) {
    if (!question || answered) return;
    const right = option === question.correct;
    setPicked(option);
    setScore((value) => ({
      answered: value.answered + 1,
      correct: value.correct + (right ? 1 : 0),
    }));
    recordRound('spreekwoorden');
  }

  function next() {
    setPicked(null);
    setIndex((value) => value + 1);
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-bg p-1">
          <button
            type="button"
            onClick={() => changeMode('finish')}
            className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
              mode === 'finish' ? 'bg-surface text-ink shadow-card' : 'text-muted'
            }`}
          >
            Maak af
          </button>
          <button
            type="button"
            onClick={() => changeMode('meaning')}
            className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
              mode === 'meaning' ? 'bg-surface text-ink shadow-card' : 'text-muted'
            }`}
          >
            Betekenis
          </button>
        </div>
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted">
            Niveau
            <select
              value={level}
              onChange={(event) => changeLevel(event.target.value as LevelFilter)}
              className="rounded-xl border border-border bg-bg px-3 py-2 text-sm normal-case tracking-normal text-ink"
            >
              <option value="all">Alle</option>
              {EXPRESSION_LEVELS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Score</p>
            <p className="text-sm font-bold text-ink">
              {score.correct} / {score.answered}
            </p>
          </div>
        </div>
      </Card>

      {deck.length === 0 ? (
        <Card className="p-6 text-center text-sm text-muted">
          Voor dit niveau zijn er nog geen uitdrukkingen.
        </Card>
      ) : finished ? (
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold text-ink">Goed gedaan</h2>
          <p className="mt-2 text-sm text-muted">
            Je had {score.correct} van de {deck.length} goed.
          </p>
          <Button onClick={restart} className="mt-4">
            Opnieuw oefenen
          </Button>
        </Card>
      ) : question ? (
        <Card className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <LevelBadge level={question.level} />
            <span className="text-xs font-bold text-muted">
              Vraag {index + 1} van {deck.length}
            </span>
          </div>

          {mode === 'finish' ? (
            <FinishPrompt question={question as FinishQuestion} answered={answered} />
          ) : (
            <MeaningPrompt question={question as MeaningQuestion} />
          )}

          <div className="flex flex-col gap-2">
            {question.options.map((option, optionIndex) => {
              const correctOption = answered && option === question.correct;
              const wrongPick = answered && option === picked && !correctOption;
              return (
                <button
                  key={option}
                  type="button"
                  disabled={answered}
                  onClick={() => pick(option)}
                  className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    correctOption
                      ? 'border-primary bg-primary/10 text-ink'
                      : wrongPick
                        ? 'border-rose-300 bg-rose-50 text-rose-900'
                        : answered
                          ? 'border-border bg-surface text-muted'
                          : 'border-border bg-surface text-ink hover:border-accent'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      correctOption
                        ? 'bg-primary text-primary-fg'
                        : wrongPick
                          ? 'bg-rose-500 text-white'
                          : 'bg-bg text-muted'
                    }`}
                  >
                    {correctOption ? '✓' : wrongPick ? '×' : OPTION_LETTERS[optionIndex]}
                  </span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="rounded-xl border border-primary/15 bg-primary/10 p-4">
              <p className="text-sm font-bold text-ink">
                {isCorrect ? 'Goed zo!' : 'Net niet. Het juiste antwoord:'}
              </p>
              {mode === 'finish' ? (
                <>
                  <p className="mt-1 font-bold text-ink">
                    "{(question as FinishQuestion).source.full}"
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {(question as FinishQuestion).source.meaning}
                  </p>
                </>
              ) : (
                <p className="mt-1 text-sm text-muted">{question.correct}</p>
              )}
              <Button onClick={next} className="mt-3">
                {index + 1 >= deck.length ? 'Bekijk resultaat' : 'Volgende vraag'}
              </Button>
            </div>
          )}
        </Card>
      ) : null}
    </div>
  );
}
