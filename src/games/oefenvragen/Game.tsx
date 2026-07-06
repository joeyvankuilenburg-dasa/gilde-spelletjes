import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LevelPicker } from '../../components/LevelPicker';
import { SamExplains } from '../../components/SamExplains';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Chip, GameTagBadge } from '../../components/ui/Badge';
import { useGameStats } from '../../hooks/useGameStats';
import { useLevelFilter } from '../../hooks/useLevelFilter';
import {
  generatePracticeQuestions,
  generateRulesFeedback,
  getRepeatWords,
  type PracticeFeedback,
} from '../../lib/practice/oefenvragen';
import type {
  ISpeechRecognition,
  SpeechRecognitionErrorEvent,
  SpeechRecognitionEvent,
} from '../../types/speech';
import { oefenvragenGame } from './meta';

export default function OefenvragenGame() {
  const [level, setLevel] = useLevelFilter();
  const [round, setRound] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [interim, setInterim] = useState('');
  const [feedback, setFeedback] = useState<PracticeFeedback | null>(null);
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const { recordRound } = useGameStats();

  const questions = useMemo(() => {
    void round;
    return generatePracticeQuestions(level, 5);
  }, [level, round]);
  const repeatWords = useMemo(() => getRepeatWords(), []);
  const currentQuestion = questions[questionIndex] ?? questions[0];

  useEffect(() => {
    setSpeechAvailable(!!(window.SpeechRecognition ?? window.webkitSpeechRecognition));
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
    setQuestionIndex(0);
    setAnswer('');
    setInterim('');
    setFeedback(null);
    setError(null);
  }, [level, round]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window) || !text.trim()) return;
      stopSpeaking();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'nl-NL';
      utterance.rate = 0.92;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },
    [stopSpeaking],
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
      if (finalText) setAnswer((prev) => `${prev} ${finalText}`.trim());
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
        setError('Microfoon geblokkeerd. Typ je antwoord of sta microfoontoegang toe.');
      } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setError('Spraakherkenning lukt niet. Typen werkt altijd.');
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

  function submitAnswer() {
    if (!currentQuestion) return;
    const text = answer.trim();
    if (!text) {
      setError('Geef eerst een antwoord.');
      return;
    }
    const nextFeedback = generateRulesFeedback(text, repeatWords, currentQuestion.prompt);
    setFeedback(nextFeedback);
    setError(null);
    recordRound('oefenvragen');
  }

  function nextQuestion() {
    stopSpeaking();
    setAnswer('');
    setInterim('');
    setFeedback(null);
    setError(null);
    if (questionIndex + 1 >= questions.length) {
      setRound((value) => value + 1);
    } else {
      setQuestionIndex((value) => value + 1);
    }
  }

  const displayedAnswer = answer + (interim ? ` ${interim}` : '');

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-rounded text-[24px]" aria-hidden="true">
              quiz
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Oefenvragen</h1>
          </div>
          <GameTagBadge tag={oefenvragenGame.tag} />
        </div>
        <p className="text-sm text-muted">{oefenvragenGame.description}</p>
      </header>

      <LevelPicker value={level} onChange={setLevel} />

      {currentQuestion && !feedback && (
        <>
          <Card className="p-6 text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <Chip>{currentQuestion.topic}</Chip>
              <span className="text-xs font-bold text-muted">
                {questionIndex + 1} / {questions.length}
              </span>
            </div>
            <p className="text-2xl font-black leading-snug text-ink">{currentQuestion.prompt}</p>
            <p className="mt-3 text-sm italic text-muted">{currentQuestion.levelHint}</p>
            {'speechSynthesis' in window && (
              <button
                type="button"
                onClick={() => (speaking ? stopSpeaking() : speak(currentQuestion.prompt))}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-bold text-muted hover:text-primary"
              >
                <span className="material-symbols-rounded text-[18px]" aria-hidden="true">
                  {speaking ? 'stop' : 'volume_up'}
                </span>
                {speaking ? 'Stop voorlezen' : 'Lees vraag voor'}
              </button>
            )}
          </Card>

          <div className="flex flex-col items-center gap-2">
            {speechAvailable ? (
              <button
                type="button"
                onClick={recording ? stopRecording : startRecording}
                disabled={false}
                aria-label={recording ? 'Stop opname' : 'Start opname'}
                className={`flex h-24 w-24 items-center justify-center rounded-full text-white shadow-xl transition-all active:scale-95 ${
                  recording ? 'bg-rose-500' : 'bg-primary hover:bg-primary/95'
                }`}
              >
                <span className="material-symbols-rounded text-[44px]" aria-hidden="true">
                  {recording ? 'stop' : 'mic'}
                </span>
              </button>
            ) : (
              <p className="max-w-sm text-center text-sm text-muted">
                Spraakherkenning werkt niet in deze browser. Typen werkt altijd.
              </p>
            )}
            <p className="text-sm font-bold text-muted">
              {recording ? 'Aan het opnemen...' : 'Spreek of typ je antwoord'}
            </p>
          </div>

          <Card className="p-5">
            <label className="text-sm font-bold text-ink" htmlFor="practice-answer">
              Jouw antwoord
            </label>
            <textarea
              id="practice-answer"
              value={displayedAnswer}
              onChange={(event) => setAnswer(event.target.value)}
              disabled={recording}
              rows={4}
              placeholder="Typ hier je antwoord in het Nederlands..."
              className="mt-2 w-full resize-none rounded-xl border border-border bg-bg px-4 py-3 text-base text-ink focus:border-primary"
            />
            {error && (
              <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </p>
            )}
            <Button onClick={submitAnswer} disabled={recording} className="mt-4 w-full">
              <span className="material-symbols-rounded text-[20px]" aria-hidden="true">
                check
              </span>
              Versturen
            </Button>
          </Card>

          <Card className="p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">
              Woorden om te oefenen
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {repeatWords.map((word) => (
                <Chip key={word}>{word}</Chip>
              ))}
            </div>
          </Card>
        </>
      )}

      {feedback && (
        <div className="flex flex-col gap-3">
          <Card className="p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Compliment</p>
            <p className="mt-1 text-sm text-ink">{feedback.positive}</p>
          </Card>

          {feedback.betterSentence && (
            <Card className="border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                Verbeterzin
              </p>
              <p className="mt-1 text-sm italic text-emerald-900">{feedback.betterSentence}</p>
            </Card>
          )}

          {feedback.correction && (
            <Card className="border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Tip</p>
              <p className="mt-1 text-sm text-amber-900">{feedback.correction}</p>
            </Card>
          )}

          {feedback.difficultWords.length > 0 && (
            <Card className="border border-rose-100 bg-rose-50 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-rose-700">
                Woorden om te oefenen
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {feedback.difficultWords.map((word) => (
                  <Chip key={word}>{word}</Chip>
                ))}
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button variant="secondary" onClick={() => setFeedback(null)}>
              Probeer opnieuw
            </Button>
            <Button variant="accent" onClick={nextQuestion}>
              Volgende vraag
            </Button>
          </div>
        </div>
      )}

      <SamExplains steps={oefenvragenGame.howToPlay} />
    </div>
  );
}
