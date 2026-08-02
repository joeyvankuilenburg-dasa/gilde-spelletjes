import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';

/**
 * Sam als reagerende mascotte naast de oefening.
 *
 * Spellen roepen `useMascot().play(...)` aan bij een gebeurtenis (luisteren,
 * nadenken, goed antwoord, mijlpaal). De mascotte staat vast aan de zijkant van
 * de oefenkolom en steekt net over de rand van de spelkaart heen.
 */

export type MascotVariant = 'notebook' | 'dance' | 'listening' | 'thinking' | 'encouragement';
export type MascotPriority = 1 | 2 | 3 | 4;

interface MascotManifest {
  frames: readonly string[];
  frameDurationMs: number;
  /** Vanaf dit frame is het notitieblok leesbaar en tonen we de tekst erin. */
  messageFrame?: number;
}

function framePaths(variant: MascotVariant, count: number): string[] {
  return Array.from(
    { length: count },
    (_, index) => `/mascot/${variant}/${variant}-${String(index + 1).padStart(2, '0')}.webp`,
  );
}

export const MASCOT_MANIFESTS: Record<MascotVariant, MascotManifest> = {
  notebook: { frames: framePaths('notebook', 6), frameDurationMs: 210, messageFrame: 5 },
  dance: { frames: framePaths('dance', 8), frameDurationMs: 140 },
  listening: { frames: framePaths('listening', 6), frameDurationMs: 210 },
  thinking: { frames: framePaths('thinking', 4), frameDurationMs: 260 },
  encouragement: { frames: framePaths('encouragement', 4), frameDurationMs: 230 },
};

const IDLE_FRAME = MASCOT_MANIFESTS.encouragement.frames[0]!;

export interface MascotRequest {
  variant: MascotVariant;
  /** Wordt voorgelezen door schermlezers; bij 'notebook' ook in het blok getoond. */
  announcement: string;
  notebookMessage?: string;
  priority?: MascotPriority;
  loop?: boolean;
  cycles?: number;
  holdFinalMs?: number;
}

interface MascotEvent extends MascotRequest {
  id: number;
  priority: MascotPriority;
}

const preloadCache = new Map<string, Promise<void>>();

function preloadFrame(src: string): Promise<void> {
  const cached = preloadCache.get(src);
  if (cached) return cached;

  const pending = new Promise<void>((resolve) => {
    const image = new window.Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
  preloadCache.set(src, pending);
  return pending;
}

function preloadFrames(frames: readonly string[]): Promise<void> {
  return Promise.all(frames.map(preloadFrame)).then(() => undefined);
}

function defaultPriority(variant: MascotVariant): MascotPriority {
  if (variant === 'dance') return 3;
  if (variant === 'notebook' || variant === 'encouragement') return 2;
  return 1;
}

interface MascotApi {
  play: (request: MascotRequest) => void;
  /** Stopt de huidige animatie, optioneel alleen als die van deze variant is. */
  stop: (variant?: MascotVariant) => void;
}

const MascotContext = createContext<MascotApi>({ play: () => {}, stop: () => {} });

/** Spellen gebruiken dit om Sam te laten reageren. */
export function useMascot(): MascotApi {
  return useContext(MascotContext);
}

export function MascotProvider({ children }: { children: ReactNode }) {
  const [event, setEvent] = useState<MascotEvent | null>(null);
  const nextIdRef = useRef(0);

  const play = useCallback((request: MascotRequest) => {
    nextIdRef.current += 1;
    const next: MascotEvent = {
      ...request,
      id: nextIdRef.current,
      priority: request.priority ?? defaultPriority(request.variant),
    };
    // Een lopende, belangrijkere animatie (bijv. een viering) wint.
    setEvent((current) => (current && current.priority > next.priority ? current : next));
  }, []);

  const stop = useCallback((variant?: MascotVariant) => {
    setEvent((current) => {
      if (!current || (variant && current.variant !== variant)) return current;
      return null;
    });
  }, []);

  const complete = useCallback((eventId: number) => {
    setEvent((current) => (current?.id === eventId ? null : current));
  }, []);

  const api = useMemo<MascotApi>(() => ({ play, stop }), [play, stop]);

  return (
    <MascotContext.Provider value={api}>
      {children}
      <MascotStage event={event} onComplete={complete} />
    </MascotContext.Provider>
  );
}

interface MascotStageProps {
  event: MascotEvent | null;
  onComplete: (eventId: number) => void;
}

function MascotStage({ event, onComplete }: MascotStageProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    void preloadFrames(Object.values(MASCOT_MANIFESTS).flatMap((manifest) => manifest.frames));
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!event) {
      setReady(false);
      setFrameIndex(0);
      return undefined;
    }

    const activeEvent = event;
    const manifest = MASCOT_MANIFESTS[activeEvent.variant];
    const finalFrame = manifest.frames.length - 1;
    let cancelled = false;
    let frameTimer: ReturnType<typeof setInterval> | null = null;
    let holdTimer: ReturnType<typeof setTimeout> | null = null;

    setReady(false);

    void preloadFrames(manifest.frames).then(() => {
      if (cancelled) return;
      setReady(true);

      if (reducedMotion) {
        setFrameIndex(finalFrame);
        if (!activeEvent.loop) {
          holdTimer = setTimeout(() => onComplete(activeEvent.id), activeEvent.holdFinalMs ?? 1800);
        }
        return;
      }

      let currentFrame = 0;
      let completedCycles = 0;
      const requestedCycles = Math.max(1, activeEvent.cycles ?? 1);
      setFrameIndex(currentFrame);

      frameTimer = setInterval(() => {
        if (currentFrame < finalFrame) {
          currentFrame += 1;
          setFrameIndex(currentFrame);
          return;
        }

        completedCycles += 1;
        if (activeEvent.loop || completedCycles < requestedCycles) {
          currentFrame = 0;
          setFrameIndex(currentFrame);
          return;
        }

        if (frameTimer) clearInterval(frameTimer);
        frameTimer = null;
        holdTimer = setTimeout(() => onComplete(activeEvent.id), activeEvent.holdFinalMs ?? 1400);
      }, manifest.frameDurationMs);
    });

    return () => {
      cancelled = true;
      if (frameTimer) clearInterval(frameTimer);
      if (holdTimer) clearTimeout(holdTimer);
    };
  }, [event, onComplete, reducedMotion]);

  const manifest = event ? MASCOT_MANIFESTS[event.variant] : null;
  const visibleFrame = event && ready && manifest ? manifest.frames[frameIndex]! : IDLE_FRAME;
  const showNotebookMessage = Boolean(
    event &&
      manifest &&
      ready &&
      event.variant === 'notebook' &&
      event.notebookMessage &&
      frameIndex >= (manifest.messageFrame ?? manifest.frames.length - 1),
  );

  return (
    <div
      data-mascot-state={event?.variant ?? 'idle'}
      aria-hidden={!event}
      className={cn(
        // Klein scherm: zwevend in de hoek, net over de rand van de kaart.
        'pointer-events-none fixed bottom-3 right-2 z-30 h-24 w-24 transition-transform duration-300 sm:h-28 sm:w-28',
        // Groot scherm: naast de oefenkolom, ~1.5rem over de rand heen.
        'xl:bottom-auto xl:right-[calc(50vw-24rem-8rem)] xl:top-36 xl:h-40 xl:w-40',
        event ? 'scale-105' : 'scale-100 opacity-90',
      )}
    >
      <img
        key={visibleFrame}
        src={visibleFrame}
        alt=""
        aria-hidden="true"
        className="h-full w-full select-none object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.18)]"
      />

      <p
        aria-live="polite"
        aria-atomic="true"
        className={
          showNotebookMessage
            ? 'absolute left-[29%] top-[45%] flex h-[18%] w-[42%] items-center justify-center text-center text-[7px] font-extrabold leading-tight text-gray-800 xl:text-[9px]'
            : 'sr-only'
        }
      >
        {event?.announcement ?? ''}
      </p>
    </div>
  );
}
