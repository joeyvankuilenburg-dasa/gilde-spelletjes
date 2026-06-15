export type SamEventKind = 'milestone' | 'big-milestone' | 'set-complete';

export interface SamEventDetail {
  kind: SamEventKind;
  message: string;
}

const EVENT_NAME = 'sam:show';

export function emitSam(detail: SamEventDetail): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<SamEventDetail>(EVENT_NAME, { detail }));
}

export function onSam(handler: (detail: SamEventDetail) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const listener = (e: Event) => {
    const ce = e as CustomEvent<SamEventDetail>;
    handler(ce.detail);
  };
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}
