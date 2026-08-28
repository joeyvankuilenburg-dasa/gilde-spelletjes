export const NOTEBOOK_CONTEXTS = {
  home: '/mascot/sheets/notebooks/home-leidse-sleutels-v2.png',
  onderwerpen: '/mascot/sheets/notebooks/onderwerpen-leidse-sleutels-v2.png',
  stellingen: '/mascot/sheets/notebooks/stellingen-leidse-sleutels-v2.png',
  beeldraden: '/mascot/sheets/notebooks/beeldraden-leidse-sleutels-v2.png',
  letterdobbelsteen: '/mascot/sheets/notebooks/letterdobbelsteen-leidse-sleutels-v2.png',
  situaties: '/mascot/sheets/notebooks/situaties-leidse-sleutels-v2.png',
  woordenweb: '/mascot/sheets/notebooks/woordenweb-leidse-sleutels-v2.png',
  wiewatbenik: '/mascot/sheets/notebooks/wiewatbenik-leidse-sleutels-v2.png',
  spreekwoorden: '/mascot/sheets/notebooks/spreekwoorden-leidse-sleutels-v2.png',
  uitdrukkingen: '/mascot/sheets/notebooks/uitdrukkingen-leidse-sleutels-v2.png',
  'ai-gesprek': '/mascot/sheets/notebooks/ai-gesprek-leidse-sleutels-v2.png',
  oefenvragen: '/mascot/sheets/notebooks/oefenvragen-leidse-sleutels-v2.png',
  promptkaarten: '/mascot/sheets/notebooks/promptkaarten-leidse-sleutels-v2.png',
  nazeggen: '/mascot/sheets/notebooks/nazeggen-leidse-sleutels-v2.png',
  uitspraakoefening: '/mascot/sheets/notebooks/uitspraakoefening-leidse-sleutels-v2.png',
  'taal-slam': '/mascot/sheets/notebooks/taal-slam-leidse-sleutels-v2.png',
} as const;

export type NotebookContext = keyof typeof NOTEBOOK_CONTEXTS;
export type NotebookSpriteName = `notebook-${NotebookContext}`;

interface MascotSpriteManifest {
  frameCount: number;
  src: string;
}

const NOTEBOOK_SPRITES = Object.fromEntries(
  Object.entries(NOTEBOOK_CONTEXTS).map(([context, src]) => [
    `notebook-${context}`,
    { frameCount: 6, src },
  ]),
) as Record<NotebookSpriteName, MascotSpriteManifest>;

export const MASCOT_SPRITES = {
  notebook: { frameCount: 6, src: '/mascot/sheets/notebook-leidse-sleutels-v2.png' },
  ...NOTEBOOK_SPRITES,
  dance: { frameCount: 8, src: '/mascot/sheets/dance-leidse-sleutels-v2.png' },
  listening: { frameCount: 6, src: '/mascot/sheets/listening-leidse-sleutels-v2.png' },
  thinking: { frameCount: 4, src: '/mascot/sheets/thinking-leidse-sleutels-v2.png' },
  encouragement: { frameCount: 4, src: '/mascot/sheets/encouragement-leidse-sleutels-v2.png' },
} satisfies Record<string, MascotSpriteManifest>;

export type MascotSpriteName = keyof typeof MASCOT_SPRITES;

export function notebookSprite(context: NotebookContext): NotebookSpriteName {
  return `notebook-${context}`;
}

export function notebookContextForPath(pathname: string): NotebookContext {
  const context = pathname.replace(/^\//, '').split('/')[0];
  return context in NOTEBOOK_CONTEXTS ? (context as NotebookContext) : 'home';
}

export const MASCOT_SPRITE_CLASS: Record<MascotSpriteName, string> = Object.fromEntries(
  Object.keys(MASCOT_SPRITES).map((name) => [
    name,
    name === 'dance'
      ? 'mascot-sprite--dance mascot-sprite--4x2'
      : name === 'listening'
        ? 'mascot-sprite--listening mascot-sprite--3x2'
        : name === 'thinking'
          ? 'mascot-sprite--thinking mascot-sprite--2x2'
          : name === 'encouragement'
            ? 'mascot-sprite--encouragement mascot-sprite--2x2'
            : 'mascot-sprite--3x2',
  ]),
) as Record<MascotSpriteName, string>;
