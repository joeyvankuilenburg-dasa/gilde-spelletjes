import { useEffect, useRef, useState } from 'react';
import { SamExplains } from '../../components/SamExplains';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Chip, GameTagBadge, LevelBadge } from '../../components/ui/Badge';
import { useGameStats } from '../../hooks/useGameStats';
import { readStorage, writeStorage } from '../../lib/storage';
import { SHADOWING_SENTENCES, type ShadowingSentence } from '../../lib/practice/content';
import { nazeggenGame } from './meta';

type LevelFilter = 'A1' | 'A2' | 'B1';
type ShadowingStatus = 'saved' | 'difficult' | 'practiced';

interface Assessment {
  allWords: boolean;
  calm: boolean;
  clearEnough: boolean;
  wantsRetry: boolean;
}

const STORAGE_KEY = 'samenspraak.shadowing';
const LEVELS: LevelFilter[] = ['A1', 'A2', 'B1'];
const STATUS_LABELS: Record<ShadowingStatus, string> = {
  saved: 'Bewaren',
  difficult: 'Moeilijk',
  practiced: 'Geoefend',
};

function isShadowingStatus(value: unknown): value is ShadowingStatus {
  return value === 'saved' || value === 'difficult' || value === 'practiced';
}

function isStatusRecord(value: unknown): value is Record<string, ShadowingStatus> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return Object.values(value as Record<string, unknown>).every(isShadowingStatus);
}

function feedbackLines(
  assessment: Assessment,
  recorded: boolean,
  listenedBack: boolean,
  attempts: number,
): string[] {
  const lines: string[] = [];
  if (recorded && listenedBack) {
    lines.push('Goed gedaan. Je hebt jezelf opgenomen en teruggeluisterd.');
  } else if (recorded) {
    lines.push('Mooi, je hebt de zin opgenomen. Luister hem terug als je kunt.');
  } else {
    lines.push('Goed dat je hardop oefent. Ook zonder opname helpt rustig herhalen.');
  }
  if (!assessment.allWords) lines.push('Probeer de zin nog één keer en spreek langzamer.');
  if (!assessment.calm) lines.push('Oefen eerst de zin in twee stukjes.');
  if (!assessment.clearEnough) lines.push('Kies één moeilijk woord en oefen dat apart.');
  if (assessment.wantsRetry || attempts > 1)
    lines.push('Door opnieuw te proberen word je zekerder.');
  return lines;
}

export default function NazeggenGame() {
  const [level, setLevel] = useState<LevelFilter>('A1');
  const [selectedId, setSelectedId] = useState(
    SHADOWING_SENTENCES.find((sentence) => sentence.level === 'A1')?.id ??
      SHADOWING_SENTENCES[0]?.id ??
      '',
  );
  const [statuses, setStatuses] = useState<Record<string, ShadowingStatus>>(() =>
    readStorage(STORAGE_KEY, {}, isStatusRecord),
  );
  const [recordingAvailable, setRecordingAvailable] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [listenedBack, setListenedBack] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<Assessment>({
    allWords: false,
    calm: false,
    clearEnough: false,
    wantsRetry: false,
  });
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const dutchVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const { recordRound } = useGameStats();

  const sentences = SHADOWING_SENTENCES.filter((sentence) => sentence.level === level);
  const selected =
    SHADOWING_SENTENCES.find((sentence) => sentence.id === selectedId) ??
    sentences[0] ??
    SHADOWING_SENTENCES[0];
  const selectedStatus = selected ? statuses[selected.id] : undefined;
  const feedback = feedbackLines(assessment, !!audioUrl, listenedBack, attempts);

  useEffect(() => {
    setRecordingAvailable('MediaRecorder' in window && !!navigator.mediaDevices?.getUserMedia);
    if ('speechSynthesis' in window) {
      const findDutchVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        dutchVoiceRef.current =
          voices.find((voice) => voice.lang === 'nl-NL') ??
          voices.find((voice) => voice.lang.startsWith('nl')) ??
          null;
      };
      findDutchVoice();
      window.speechSynthesis.addEventListener('voiceschanged', findDutchVoice);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', findDutchVoice);
        window.speechSynthesis.cancel();
      };
    }
    return undefined;
  }, []);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  function resetRecording(countAsRetry: boolean) {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setListenedBack(false);
    setRecording(false);
    chunksRef.current = [];
    if (countAsRetry) setAttempts((value) => value + 1);
  }

  function selectLevel(nextLevel: LevelFilter) {
    setLevel(nextLevel);
    setSelectedId(
      SHADOWING_SENTENCES.find((sentence) => sentence.level === nextLevel)?.id ??
        SHADOWING_SENTENCES[0]?.id ??
        '',
    );
    resetRecording(false);
    setAssessment({ allWords: false, calm: false, clearEnough: false, wantsRetry: false });
  }

  function speak(sentence: ShadowingSentence) {
    if (ttsAudioRef.current) {
      ttsAudioRef.current.pause();
      ttsAudioRef.current = null;
    }
    window.speechSynthesis?.cancel();
    const audio = new Audio(`/audio/shadowing/${sentence.id}.mp3`);
    ttsAudioRef.current = audio;
    audio.play().catch(() => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(sentence.sentence);
        utterance.lang = 'nl-NL';
        utterance.rate = 0.86;
        if (dutchVoiceRef.current) utterance.voice = dutchVoiceRef.current;
        window.speechSynthesis.speak(utterance);
      }
    });
  }

  async function startRecording() {
    if (!recordingAvailable) return;
    setMessage(null);
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
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(URL.createObjectURL(blob));
        setAttempts((value) => Math.max(value + 1, 1));
      };
      recorder.start();
      setRecording(true);
    } catch {
      setMessage('Microfoon opnemen lukt niet. Je kunt de zin hardop oefenen zonder opname.');
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  function save(status: ShadowingStatus) {
    if (!selected) return;
    const next = { ...statuses, [selected.id]: status };
    setStatuses(next);
    writeStorage(STORAGE_KEY, next);
    setMessage('Nazeggen opgeslagen in deze browser.');
    recordRound('nazeggen');
  }

  if (!selected) {
    return <p className="text-sm text-muted">Geen zinnen gevonden.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-rounded text-[24px]" aria-hidden="true">
              record_voice_over
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Nazeggen</h1>
          </div>
          <GameTagBadge tag={nazeggenGame.tag} />
        </div>
        <p className="text-sm text-muted">{nazeggenGame.description}</p>
      </header>

      {message && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          {message}
        </p>
      )}

      <Card className="flex flex-col gap-4 p-4">
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => selectLevel(item)}
              className={`rounded-full px-3 py-1.5 text-sm font-bold transition-colors ${
                level === item ? 'bg-primary text-primary-fg' : 'bg-bg text-muted hover:text-ink'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-widest text-muted">
          Kies een zin
          <select
            value={selected.id}
            onChange={(event) => {
              setSelectedId(event.target.value);
              resetRecording(false);
            }}
            className="rounded-xl border border-border bg-bg px-3 py-2 text-sm normal-case tracking-normal text-ink"
          >
            {sentences.map((sentence) => (
              <option key={sentence.id} value={sentence.id}>
                {sentence.sentence}
              </option>
            ))}
          </select>
        </label>
      </Card>

      <Card className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <LevelBadge level={selected.level} />
            <Chip>{selected.theme}</Chip>
          </div>
          {selectedStatus && <Chip>{STATUS_LABELS[selectedStatus]}</Chip>}
        </div>

        <p className="text-2xl font-black leading-snug text-ink">{selected.sentence}</p>
        <p className="rounded-xl border border-border bg-bg p-3 text-sm text-muted">
          Tip: {selected.tip}
        </p>

        {selected.chunks && (
          <div className="flex flex-wrap gap-2">
            {selected.chunks.map((chunk) => (
              <span
                key={chunk}
                className="rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary"
              >
                {chunk}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button onClick={() => speak(selected)}>
            <span className="material-symbols-rounded text-[20px]" aria-hidden="true">
              volume_up
            </span>
            Luister naar voorbeeldzin
          </Button>
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
              Neem mijn stem op
            </Button>
          )}
        </div>

        {!recordingAvailable && (
          <p className="text-xs text-amber-700">
            Opnemen is niet beschikbaar in deze browser. Hardop oefenen kan altijd.
          </p>
        )}
        <p className="text-xs text-muted">Je opname blijft lokaal en wordt niet geüpload.</p>

        {audioUrl && (
          <div className="rounded-xl border border-border bg-bg p-3">
            <p className="mb-2 text-sm font-bold text-ink">Luister naar jezelf</p>
            <audio src={audioUrl} controls onPlay={() => setListenedBack(true)} className="w-full">
              <track kind="captions" />
            </audio>
            <button
              type="button"
              onClick={() => resetRecording(true)}
              className="mt-2 text-sm font-bold text-primary hover:text-primary/80"
            >
              Nog een keer proberen
            </button>
          </div>
        )}
      </Card>

      <Card className="flex flex-col gap-4 p-5">
        <h2 className="text-sm font-bold text-ink">Zelfcheck</h2>
        <div className="grid grid-cols-1 gap-2">
          {(
            [
              ['allWords', 'Heb ik alle woorden gezegd?'],
              ['calm', 'Sprak ik rustig?'],
              ['clearEnough', 'Was mijn uitspraak duidelijk genoeg?'],
              ['wantsRetry', 'Wil ik het nog een keer proberen?'],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-bold text-ink hover:bg-bg"
            >
              <input
                type="checkbox"
                checked={assessment[key]}
                onChange={(event) =>
                  setAssessment((prev) => ({ ...prev, [key]: event.target.checked }))
                }
              />
              {label}
            </label>
          ))}
        </div>

        <div className="rounded-xl border border-primary/15 bg-primary/10 p-3">
          {feedback.map((line) => (
            <p key={line} className="text-sm text-ink">
              {line}
            </p>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Button onClick={() => save('practiced')}>Geoefend opslaan</Button>
          <Button variant="secondary" onClick={() => save('difficult')}>
            Moeilijk
          </Button>
          <Button variant="secondary" onClick={() => save('saved')}>
            Bewaren
          </Button>
        </div>
      </Card>

      <SamExplains steps={nazeggenGame.howToPlay} />
    </div>
  );
}
