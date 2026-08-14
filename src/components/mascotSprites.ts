export const NOTEBOOK_CONTEXTS = {
  home: '/mascot/sheets/notebooks/home.png',
  onderwerpen: '/mascot/sheets/notebooks/onderwerpen.png',
  stellingen: '/mascot/sheets/notebooks/stellingen.png',
  beeldraden: '/mascot/sheets/notebooks/beeldraden.png',
  letterdobbelsteen: '/mascot/sheets/notebooks/letterdobbelsteen.png',
  situaties: '/mascot/sheets/notebooks/situaties.png',
  woordenweb: '/mascot/sheets/notebooks/woordenweb.png',
  wiewatbenik: '/mascot/sheets/notebooks/wiewatbenik.png',
  spreekwoorden: '/mascot/sheets/notebooks/spreekwoorden.png',
  uitdrukkingen: '/mascot/sheets/notebooks/uitdrukkingen.png',
  'ai-gesprek': '/mascot/sheets/notebooks/ai-gesprek.png',
  oefenvragen: '/mascot/sheets/notebooks/oefenvragen.png',
  promptkaarten: '/mascot/sheets/notebooks/promptkaarten.png',
  nazeggen: '/mascot/sheets/notebooks/nazeggen.png',
  uitspraakoefening: '/mascot/sheets/notebooks/uitspraakoefening.png',
  'taal-slam': '/mascot/sheets/notebooks/taal-slam.png',
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
  notebook: { frameCount: 6, src: '/mascot/sheets/notebook.png' },
  ...NOTEBOOK_SPRITES,
  dance: { frameCount: 8, src: '/mascot/sheets/dance.png' },
  listening: { frameCount: 6, src: '/mascot/sheets/listening.png' },
  thinking: { frameCount: 4, src: '/mascot/sheets/thinking.png' },
  encouragement: { frameCount: 4, src: '/mascot/sheets/encouragement.png' },
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
