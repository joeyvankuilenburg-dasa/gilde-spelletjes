export type MascotSpriteName = 'notebook' | 'dance' | 'listening' | 'thinking' | 'encouragement';

interface MascotSpriteManifest {
  frameCount: number;
  src: string;
}

export const MASCOT_SPRITES: Record<MascotSpriteName, MascotSpriteManifest> = {
  notebook: { frameCount: 6, src: '/mascot/sheets/notebook.png' },
  dance: { frameCount: 8, src: '/mascot/sheets/dance.png' },
  listening: { frameCount: 6, src: '/mascot/sheets/listening.png' },
  thinking: { frameCount: 4, src: '/mascot/sheets/thinking.png' },
  encouragement: { frameCount: 4, src: '/mascot/sheets/encouragement.png' },
};

export const MASCOT_SPRITE_CLASS: Record<MascotSpriteName, string> = {
  notebook: 'mascot-sprite--notebook mascot-sprite--3x2',
  dance: 'mascot-sprite--dance mascot-sprite--4x2',
  listening: 'mascot-sprite--listening mascot-sprite--3x2',
  thinking: 'mascot-sprite--thinking mascot-sprite--2x2',
  encouragement: 'mascot-sprite--encouragement mascot-sprite--2x2',
};
