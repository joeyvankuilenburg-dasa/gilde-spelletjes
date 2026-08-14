import { useEffect, useMemo, useRef, useState } from 'react';
import { SamExplains } from '../../components/SamExplains';
import { useMascot } from '../../components/practice/mascot';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Chip, GameTagBadge, LevelBadge } from '../../components/ui/Badge';
import { useGameStats } from '../../hooks/useGameStats';
import { cn } from '../../lib/cn';
import {
  EXPRESSION_SLAMS,
  FINISH_SLAMS,
  SLAM_LEVELS,
  SLAM_LINES,
  WORD_CARD_SLAMS,
  type ExpressionSlam,
  type FinishSlam,
  type SlamLevel,
  type WordCardSlam,
} from '../../lib/practice/taalslam/taalslam';
import { buildSlamFeedback, type SlamFeedbackResult } from '../../lib/practice/slamFeedback';
import { taalSlamGame } from './meta';

type Mode = 'menu' | 'finish' | 'words' | 'expression';
type ChallengeMode = Exclude<Mode, 'menu'>;
type LevelFilter = SlamLevel | 'all';

type Challenge =
  | { mode: 'finish'; data: FinishSlam }
  | { mode: 'words'; data: WordCardSlam }
  | { mode: 'expression'; data: ExpressionSlam };

const MODE_HEADINGS: Record<ChallengeMode, string> = {
  finish: 'Maak de slam af',
  words: 'Woordkaart-uitdaging',
  expression: 'Uitdrukking-uitdaging',
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-zà-ÿ]+/i)
      .filter(Boolean),
  );
}

function usesWord(tokens: Set<string>, word: string): boolean {
  return word
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((part) => tokens.has(part));
}

function countLines(text: string): number {
  return text.split('\n').filter((line) => line.trim().length > 0).length;
}

function buildDeck(mode: ChallengeMode, level: LevelFilter): Challenge[] {
  const within = (itemLevel: SlamLevel) => level === 'all' || itemLevel === level;
  if (mode === 'finish') {
    return shuffle(FINISH_SLAMS.filter((item) => within(item.level))).map((data) => ({
      mode,
      data,
    }));
  }
  if (mode === 'words') {
    return shuffle(WORD_CARD_SLAMS.filter((item) => within(item.level))).map((data) => ({
      mode,
      data,
    }));
  }
  return shuffle(EXPRESSION_SLAMS.filter((item) => within(item.level))).map((data) => ({
    mode,
    data,
  }));
}

function MenuCard({
  title,
  description,
  example,
  icon,
  count,
  onClick,
}: {
  title: string;
  description: string;
  example: string;
  icon: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-card bg-surface p-5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <span className="material-symbols-rounded text-[28px]" aria-hidden="true">
            {icon}
          </span>
        </span>
        <Chip>{count} thema’s</Chip>
      </div>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <p className="mt-3 text-xs italic text-muted">"{example}"</p>
    </button>
  );
}

function WordChip({ label, used }: { label: string; used: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-bold',
        used ? 'bg-primary/10 text-primary ring-1 ring-primary/30' : 'bg-bg text-muted',
      )}
    >
      {used && (
        <span className="material-symbols-rounded text-[14px]" aria-hidden="true">
          check
        </span>
      )}
      {label}
    </span>
  );
}

export default function TaalSlamGame() {
  const [mode, setMode] = useState<Mode>('menu');
  const [level, setLevel] = useState<LevelFilter>('all');
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [tips, setTips] = useState<SlamFeedbackResult | null>(null);
  const [recordingAvailable, setRecordingAvailable] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const { recordRound } = useGameStats();
  const mascot = useMascot();

  const challengeMode = mode === 'menu' ? 'finish' : mode;
  const deck = useMemo(() => {
    void round;
    return mode === 'menu' ? [] : buildDeck(challengeMode, level);
  }, [challengeMode, level, mode, round]);
  const challenge = deck[index];
  const tokens = useMemo(() => tokenize(text), [text]);
  const lines = countLines(text);

  useEffect(() => {
    setRecordingAvailable('MediaRecorder' in window && !!navigator.mediaDevices?.getUserMedia);
  }, []);

  useEffect(() => {
    if (!challenge) return;
    setText(challenge.mode === 'finish' ? `${challenge.data.firstLine}\n` : '');
    setTips(null);
    clearAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge?.data.id]);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  function clearAudio() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecording(false);
    chunksRef.current = [];
  }

  function changeMode(nextMode: ChallengeMode) {
    setMode(nextMode);
    setIndex(0);
    setRound((value) => value + 1);
  }

  function changeLevel(nextLevel: LevelFilter) {
    setLevel(nextLevel);
    setIndex(0);
    setRound((value) => value + 1);
  }

  function nextChallenge() {
    clearAudio();
    setTips(null);
    recordRound('taal-slam');
    if (index + 1 >= deck.length) {
      setIndex(0);
      setRound((value) => value + 1);
    } else {
      setIndex((value) => value + 1);
    }
  }

  async function startRecording() {
    if (!recordingAvailable) return;
    clearAudio();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
        mascot.stop('listening');
      };
      recorder.start();
      setRecording(true);
      mascot.play({ variant: 'listening', announcement: 'Ik luister naar je slam.', loop: true });
    } catch {
      setRecordingAvailable(false);
      mascot.play({ variant: 'encouragement', announcement: 'Blijf oefenen!', holdFinalMs: 1400 });
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setRecording(false);
    mascot.stop('listening');
  }

  function requestTips() {
    if (!challenge) return;
    const result = buildSlamFeedback({
      level: challenge.data.level,
      theme: challenge.data.theme,
      text,
      mode: challenge.mode,
      requiredWords: challenge.mode === 'words' ? challenge.data.requiredWords : undefined,
      expression: challenge.mode === 'expression' ? challenge.data.expression : undefined,
    });
    setTips(result);
    recordRound('taal-slam');
    mascot.play({
      variant: 'thinking',
      announcement: 'Ik denk na over je slam.',
      holdFinalMs: 900,
    });
  }

  if (mode === 'menu') {
    return (
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-rounded text-[24px]" aria-hidden="true">
                theater_comedy
              </span>
              <h1 className="text-2xl font-bold tracking-tight">Taal Slam</h1>
            </div>
            <GameTagBadge tag={taalSlamGame.tag} />
          </div>
          <p className="text-sm text-muted">{taalSlamGame.description}</p>
        </header>

        <div className="grid grid-cols-1 gap-3">
          <MenuCard
            title="Maak de slam af"
            description="Je krijgt de eerste regel en maakt de rest zelf."
            example="Ik leer Nederlands, soms gaat het traag..."
            icon="edit"
            count={FINISH_SLAMS.length}
            onClick={() => changeMode('finish')}
          />
          <MenuCard
            title="Woordkaart-uitdaging"
            description="Gebruik drie tot vijf woorden in je slam."
            example="fiets · markt · oefenen · moeilijk · trots"
            icon="cards"
            count={WORD_CARD_SLAMS.length}
            onClick={() => changeMode('words')}
          />
          <MenuCard
            title="Uitdrukking-uitdaging"
            description="Verwerk één Nederlandse uitdrukking in je tekst."
            example="Met vallen en opstaan..."
            icon="format_quote"
            count={EXPRESSION_SLAMS.length}
            onClick={() => changeMode('expression')}
          />
        </div>

        <SamExplains notebookContext="taal-slam" steps={taalSlamGame.howToPlay} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => setMode('menu')} className="px-0">
          <span className="material-symbols-rounded text-[18px]" aria-hidden="true">
            arrow_back
          </span>
          Terug
        </Button>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted">
          Niveau
          <select
            value={level}
            onChange={(event) => changeLevel(event.target.value as LevelFilter)}
            className="rounded-xl border border-border bg-bg px-3 py-2 text-sm normal-case tracking-normal text-ink"
          >
            <option value="all">Alle</option>
            {SLAM_LEVELS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Card className="flex items-center justify-between gap-3 p-4">
        <div>
          <h1 className="text-base font-bold text-ink">{MODE_HEADINGS[mode]}</h1>
          <p className="text-xs text-muted">
            Schrijf ongeveer {SLAM_LINES} regels en draag ze hardop voor.
          </p>
        </div>
        {challenge && <LevelBadge level={challenge.data.level} />}
      </Card>

      {!challenge ? (
        <Card className="p-6 text-center text-sm text-muted">
          Voor dit niveau zijn er nog geen thema’s.
        </Card>
      ) : (
        <>
          <Card className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between gap-2">
              <Chip>Thema</Chip>
              <button
                type="button"
                onClick={nextChallenge}
                className="text-xs font-bold text-primary hover:text-primary/80"
              >
                Ander thema
              </button>
            </div>
            <h2 className="text-xl font-bold text-ink">{challenge.data.theme}</h2>

            {challenge.mode === 'finish' && (
              <div className="flex flex-col gap-3">
                <div className="rounded-xl border border-primary/15 bg-primary/10 p-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">
                    Eerste regel
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink">{challenge.data.firstLine}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {challenge.data.suggestedWords.map((word) => (
                    <Chip key={word}>{word}</Chip>
                  ))}
                </div>
                {challenge.data.expression && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                      Probeer deze uitdrukking
                    </p>
                    <p className="mt-1 text-sm font-bold text-amber-900">
                      "{challenge.data.expression.phrase}"
                    </p>
                    <p className="text-xs text-amber-800">{challenge.data.expression.meaning}</p>
                  </div>
                )}
              </div>
            )}

            {challenge.mode === 'words' && (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold text-ink">Gebruik deze woorden</p>
                <div className="flex flex-wrap gap-2">
                  {challenge.data.requiredWords.map((word) => (
                    <WordChip key={word} label={word} used={usesWord(tokens, word)} />
                  ))}
                </div>
              </div>
            )}

            {challenge.mode === 'expression' && (
              <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3">
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-700">
                  Gebruik deze uitdrukking
                </p>
                <p className="mt-1 text-sm font-bold text-indigo-950">
                  "{challenge.data.expression}"
                </p>
                <p className="text-xs text-indigo-800">{challenge.data.meaning}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {challenge.data.suggestedWords.map((word) => (
                    <Chip key={word}>{word}</Chip>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="slam-text" className="text-sm font-bold text-ink">
                Jouw slam
              </label>
              <span
                className={cn(
                  'text-xs font-bold',
                  lines >= SLAM_LINES ? 'text-primary' : 'text-muted',
                )}
              >
                {lines} {lines === 1 ? 'regel' : 'regels'}
              </span>
            </div>
            <textarea
              id="slam-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={7}
              placeholder={`Schrijf hier jouw slam van ${SLAM_LINES} regels...`}
              className="w-full resize-y rounded-xl border border-border bg-bg px-3 py-2.5 text-sm leading-relaxed text-ink focus:border-primary"
            />

            {recordingAvailable ? (
              <div className="flex flex-wrap items-center gap-3 border-t border-border pt-3">
                {recording ? (
                  <Button variant="secondary" onClick={stopRecording}>
                    <span className="material-symbols-rounded text-[20px]" aria-hidden="true">
                      stop
                    </span>
                    Stoppen
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={startRecording}>
                    <span className="material-symbols-rounded text-[20px]" aria-hidden="true">
                      mic
                    </span>
                    Voordragen opnemen
                  </Button>
                )}
                {audioUrl && !recording && (
                  <audio controls src={audioUrl} className="h-10">
                    <track kind="captions" />
                  </audio>
                )}
              </div>
            ) : (
              <p className="border-t border-border pt-3 text-xs text-muted">
                Opnemen werkt niet in deze browser. Hardop voordragen kan altijd.
              </p>
            )}
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-ink">Basistips</p>
                <p className="text-xs text-muted">Regelgestuurde tips, geen AI-dienst.</p>
              </div>
              <Button onClick={requestTips} disabled={!text.trim()}>
                Vraag tips
              </Button>
            </div>

            {tips && (
              <div className="rounded-xl border border-primary/15 bg-primary/10 p-4">
                <p className="text-sm font-bold text-ink">{tips.encouragement}</p>
                {tips.suggestions.length > 0 && (
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {tips.suggestions.map((suggestion) => (
                      <li key={suggestion} className="flex items-start gap-2 text-sm text-ink">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
