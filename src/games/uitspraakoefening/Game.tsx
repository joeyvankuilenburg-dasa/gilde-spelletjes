import { useEffect, useMemo, useRef, useState } from 'react';
import { LevelPicker } from '../../components/LevelPicker';
import { SamExplains } from '../../components/SamExplains';
import { useMascot } from '../../components/practice/mascot';
import { speakDutch } from '../../lib/speech/voice';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Chip, GameTagBadge, LevelBadge } from '../../components/ui/Badge';
import { useGameStats } from '../../hooks/useGameStats';
import type { Level } from '../../types/content';
import {
  getThemesForLevel,
  getWordsByLevelAndTheme,
  THEME_LABELS,
  type PronunciationTheme,
  type PronunciationWord,
} from '../../lib/practice/pronunciation';
import {
  getLevelStats,
  getSessionWords,
  loadProgress,
  recordAttempt,
  saveProgress,
  updateLevel,
  updateMode,
  updateSound,
  updateTheme,
} from '../../lib/practice/pronunciation/progress';
import {
  DIFFICULT_SOUNDS,
  SOUND_EXAMPLES,
  SOUND_HINTS,
  getSoundCounts,
  getSoundSessionWords,
  getSoundStats,
  segmentWord,
} from '../../lib/practice/pronunciation/sounds';
import type {
  DifficultSound,
  PracticeMode,
  PronunciationProgress,
  WordStatus,
} from '../../lib/practice/pronunciation/types';
import { uitspraakoefeningGame } from './meta';

type Phase = 'select' | 'practice' | 'done';

function HighlightedWord({ word, target }: { word: string; target: DifficultSound | 'all' }) {
  return (
    <>
      {segmentWord(word, target).map((segment, index) =>
        segment.isSound ? (
          <span
            key={`${segment.text}-${index}`}
            className="text-primary underline decoration-accent decoration-2 underline-offset-4"
          >
            {segment.text}
          </span>
        ) : (
          <span key={`${segment.text}-${index}`}>{segment.text}</span>
        ),
      )}
    </>
  );
}

export default function UitspraakoefeningGame() {
  const [progress, setProgress] = useState<PronunciationProgress>(() => loadProgress());
  const [level, setLevel] = useState<Level>(progress.currentLevel);
  const [theme, setTheme] = useState<PronunciationTheme | 'all'>(progress.currentTheme);
  const [mode, setMode] = useState<PracticeMode>(progress.currentMode);
  const [sound, setSound] = useState<DifficultSound | 'all'>(progress.currentSound);
  const [session, setSession] = useState<PronunciationWord[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('select');
  const [recordingAvailable, setRecordingAvailable] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const { recordRound } = useGameStats();
  const mascot = useMascot();

  const themes = useMemo(() => getThemesForLevel(level), [level]);
  const totalWords = useMemo(() => getWordsByLevelAndTheme(level, theme).length, [level, theme]);
  const levelStats = useMemo(() => getLevelStats(progress, level), [progress, level]);
  const soundStats = useMemo(() => getSoundStats(progress, sound), [progress, sound]);
  const soundCounts = useMemo(() => getSoundCounts(), []);
  const stats = mode === 'sounds' ? soundStats : levelStats;
  const poolTotal = mode === 'sounds' ? soundStats.total : totalWords;
  const currentWord = session[wordIndex] ?? null;

  useEffect(() => {
    setRecordingAvailable('MediaRecorder' in window && !!navigator.mediaDevices?.getUserMedia);
    return () => window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  function persist(next: PronunciationProgress) {
    setProgress(next);
    saveProgress(next);
  }

  function cleanupAudio() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecording(false);
    chunksRef.current = [];
  }

  function handleLevelChange(nextLevel: Level) {
    setLevel(nextLevel);
    persist(updateLevel(progress, nextLevel));
    setSession([]);
    setWordIndex(0);
    setPhase('select');
  }

  function handleThemeChange(nextTheme: PronunciationTheme | 'all') {
    setTheme(nextTheme);
    persist(updateTheme(progress, nextTheme));
    setSession([]);
    setWordIndex(0);
    setPhase('select');
  }

  function handleModeChange(nextMode: PracticeMode) {
    setMode(nextMode);
    persist(updateMode(progress, nextMode));
    setSession([]);
    setWordIndex(0);
    setPhase('select');
  }

  function handleSoundChange(nextSound: DifficultSound | 'all') {
    setSound(nextSound);
    persist(updateSound(progress, nextSound));
    setSession([]);
    setWordIndex(0);
    setPhase('select');
  }

  function startSession() {
    const currentProgress = {
      ...progress,
      currentLevel: level,
      currentTheme: theme,
      currentMode: mode,
      currentSound: sound,
    };
    const words =
      mode === 'sounds'
        ? getSoundSessionWords(currentProgress, sound, 10)
        : getSessionWords(currentProgress, 10);
    if (words.length === 0) return;
    setSession(words);
    setWordIndex(0);
    setSessionCorrect(0);
    setPhase('practice');
    cleanupAudio();
  }

  function speak(word: PronunciationWord) {
    if (ttsAudioRef.current) {
      ttsAudioRef.current.pause();
      ttsAudioRef.current = null;
    }
    window.speechSynthesis?.cancel();
    const audio = new Audio(`/audio/pronunciation/${word.id}.mp3`);
    ttsAudioRef.current = audio;
    audio.play().catch(() => {
      speakDutch(word.ttsText ?? word.word, { rate: 0.75 });
    });
  }

  async function startRecording() {
    if (!recordingAvailable) return;
    cleanupAudio();
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
      mascot.play({
        variant: 'listening',
        announcement: 'Ik luister naar je uitspraak.',
        loop: true,
      });
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

  function advanceWord() {
    cleanupAudio();
    if (wordIndex + 1 >= session.length) {
      setPhase('done');
    } else {
      setWordIndex((value) => value + 1);
    }
  }

  function assess(status: WordStatus) {
    if (!currentWord) return;
    const next = recordAttempt(progress, currentWord.id, status);
    persist(next);
    if (status === 'mastered') setSessionCorrect((value) => value + 1);
    recordRound('uitspraakoefening');

    const isLastWord = wordIndex + 1 >= session.length;
    if (isLastWord) {
      mascot.play({
        variant: 'dance',
        announcement: 'Sessie klaar. Goed gedaan!',
        cycles: 2,
        holdFinalMs: 700,
      });
    } else if (status === 'mastered') {
      mascot.play({
        variant: 'notebook',
        announcement: 'Goed gesproken!',
        notebookMessage: 'Goed gesproken!',
        holdFinalMs: 1600,
      });
    } else {
      mascot.play({ variant: 'encouragement', announcement: 'Blijf oefenen!', holdFinalMs: 1400 });
    }

    advanceWord();
  }

  if (phase === 'select') {
    return (
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-rounded text-[24px]" aria-hidden="true">
                hearing
              </span>
              <h1 className="text-2xl font-bold tracking-tight">Uitspraakoefening</h1>
            </div>
            <GameTagBadge tag={uitspraakoefeningGame.tag} />
          </div>
          <p className="text-sm text-muted">{uitspraakoefeningGame.description}</p>
        </header>

        <Card className="flex flex-col gap-5 p-5">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-bg p-1">
            <button
              type="button"
              onClick={() => handleModeChange('level')}
              className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                mode === 'level' ? 'bg-surface text-ink shadow-card' : 'text-muted'
              }`}
            >
              Op niveau
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('sounds')}
              className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                mode === 'sounds' ? 'bg-surface text-ink shadow-card' : 'text-muted'
              }`}
            >
              Moeilijke klanken
            </button>
          </div>

          {mode === 'level' ? (
            <>
              <LevelPicker value={level} onChange={handleLevelChange} />
              <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-widest text-muted">
                Thema
                <select
                  value={theme}
                  onChange={(event) =>
                    handleThemeChange(event.target.value as PronunciationTheme | 'all')
                  }
                  className="rounded-xl border border-border bg-bg px-3 py-2 text-sm normal-case tracking-normal text-ink"
                >
                  <option value="all">Alle thema’s ({totalWords} woorden)</option>
                  {themes.map((item) => (
                    <option key={item} value={item}>
                      {THEME_LABELS[item]} ({getWordsByLevelAndTheme(level, item).length})
                    </option>
                  ))}
                </select>
              </label>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted">
                Kies één lastige klank of oefen alle lastige klanken door elkaar.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSoundChange('all')}
                  className={`rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    sound === 'all'
                      ? 'bg-primary text-primary-fg'
                      : 'bg-bg text-ink hover:bg-primary/10'
                  }`}
                >
                  <span className="font-bold">Alle klanken</span>
                  <span className="block text-xs opacity-70">{soundCounts.all} woorden</span>
                </button>
                {DIFFICULT_SOUNDS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSoundChange(item)}
                    className={`rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                      sound === item
                        ? 'bg-primary text-primary-fg'
                        : 'bg-bg text-ink hover:bg-primary/10'
                    }`}
                  >
                    <span className="font-bold lowercase">{item}</span>
                    <span className="block text-xs opacity-70">
                      zoals {SOUND_EXAMPLES[item]} · {soundCounts[item]}
                    </span>
                  </button>
                ))}
              </div>
              {sound !== 'all' && SOUND_HINTS[sound] && (
                <p className="rounded-xl border border-sky-100 bg-sky-50 px-3 py-2 text-xs text-sky-700">
                  {SOUND_HINTS[sound]}
                </p>
              )}
            </div>
          )}

          <div className="rounded-xl border border-border bg-bg p-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">
              {mode === 'sounds'
                ? `Voortgang ${sound === 'all' ? 'lastige klanken' : sound}`
                : `Voortgang ${level}`}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold">
              <span className="text-primary">{stats.mastered} geleerd</span>
              <span className="text-muted">{stats.practicing} bezig</span>
              <span className="text-amber-700">{stats.difficult} moeilijk</span>
              <span className="text-muted">{stats.new} nieuw</span>
            </div>
          </div>

          <Button onClick={startSession} disabled={poolTotal === 0} className="w-full">
            Start oefening ({Math.min(10, poolTotal)} woorden)
          </Button>
        </Card>

        <SamExplains notebookContext="uitspraakoefening" steps={uitspraakoefeningGame.howToPlay} />
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="flex flex-col gap-4">
        <Card className="p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-rounded text-[34px]" aria-hidden="true">
              check
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-ink">Sessie klaar</h1>
          <p className="mt-2 text-sm text-muted">
            Je hebt {session.length} woorden geoefend. {sessionCorrect} keer als goed beoordeeld.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button onClick={startSession}>Nog een ronde</Button>
            <Button
              variant="secondary"
              onClick={() => {
                setPhase('select');
                setSession([]);
                setWordIndex(0);
              }}
            >
              Terug
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!currentWord) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="shrink-0 text-xs font-bold text-muted">
          Woord {wordIndex + 1} van {session.length}
        </span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
          <div
            className={`h-full rounded-full bg-primary ${
              wordIndex + 1 >= session.length ? 'w-full' : 'w-1/2'
            }`}
          />
        </div>
      </div>

      <Card className="flex flex-col gap-4 p-5 text-center">
        <div className="flex items-center justify-center gap-2">
          <LevelBadge level={currentWord.level} />
          <Chip>{THEME_LABELS[currentWord.theme]}</Chip>
          {currentWord.grammar && <Chip>{currentWord.grammar}</Chip>}
        </div>
        <p className="py-4 text-4xl font-black text-ink">
          {mode === 'sounds' ? (
            <HighlightedWord word={currentWord.word} target={sound} />
          ) : (
            currentWord.word
          )}
        </p>
        <p className="text-sm italic text-muted">"{currentWord.exampleSentence}"</p>
      </Card>

      <Card className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Stap 1 · Luister</p>
          <Button onClick={() => speak(currentWord)}>
            <span className="material-symbols-rounded text-[20px]" aria-hidden="true">
              volume_up
            </span>
            Luister naar het woord
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">
            Stap 2 · Spreek na
          </p>
          {recording ? (
            <Button variant="secondary" onClick={stopRecording}>
              <span className="material-symbols-rounded text-[20px]" aria-hidden="true">
                stop
              </span>
              Stop opname
            </Button>
          ) : (
            <Button variant="secondary" onClick={startRecording} disabled={!recordingAvailable}>
              <span className="material-symbols-rounded text-[20px]" aria-hidden="true">
                mic
              </span>
              Neem je stem op
            </Button>
          )}
          {!recordingAvailable && (
            <p className="text-xs text-amber-700">
              Opnemen is niet beschikbaar. Je kunt het woord hardop oefenen.
            </p>
          )}
          <p className="text-xs text-muted">Je opname blijft lokaal en wordt niet geüpload.</p>
        </div>

        {audioUrl && (
          <div className="rounded-xl border border-border bg-bg p-3">
            <p className="mb-2 text-sm font-bold text-ink">Mijn uitspraak</p>
            <audio src={audioUrl} controls className="w-full">
              <track kind="captions" />
            </audio>
            <button
              type="button"
              onClick={cleanupAudio}
              className="mt-2 text-sm font-bold text-primary hover:text-primary/80"
            >
              Nog een keer opnemen
            </button>
          </div>
        )}
      </Card>

      <Card className="flex flex-col gap-3 p-5">
        <p className="text-sm font-bold text-ink">Hoe ging het?</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Button onClick={() => assess('mastered')}>Goed</Button>
          <Button variant="secondary" onClick={() => assess('practicing')}>
            Nog oefenen
          </Button>
          <Button variant="secondary" onClick={() => assess('difficult')}>
            Moeilijk
          </Button>
        </div>
        <button
          type="button"
          onClick={advanceWord}
          className="text-xs font-bold text-muted hover:text-ink"
        >
          Overslaan
        </button>
      </Card>
    </div>
  );
}
