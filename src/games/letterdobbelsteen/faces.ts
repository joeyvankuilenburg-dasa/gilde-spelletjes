export type DieFace = { kind: 'letter'; value: string } | { kind: 'wild' };

export const FACES: DieFace[] = [
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((v) => ({ kind: 'letter', value: v }) as const),
  { kind: 'wild' },
  { kind: 'wild' },
  { kind: 'wild' },
  { kind: 'wild' },
];
