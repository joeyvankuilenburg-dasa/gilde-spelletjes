# GSSL Spelletjes

Web app met spelletjes voor **Gilde SamenSpraak Leiden** — bedoeld voor taalmaatjes en anderstaligen om samen een gesprek op gang te brengen.

## Spelletjes

1. **Onderwerpen** — willekeurig gespreksonderwerp (filter op niveau A1/A2/B1/B2).
2. **Stellingen & dilemma's** — een stelling waarover ieder z'n mening geeft.
3. **Beeldraden** — beschrijf samen wat je op de foto ziet (met optionele hint).
4. **Letter-dobbelsteen** — virtuele dobbelsteen met 26 letters + 4 wild-vlakjes en meerdere spelmodi (ik zie ik zie / beginklank / eindklank / thema + letter).

## Lokaal draaien

```bash
npm install
npm run dev          # dev server op http://localhost:5173
npm run build        # productie-build naar dist/
npm run preview      # preview de productie-build
npm run test         # vitest één keer
npm run check        # tsc + eslint + prettier (CI-check)
```

Node 20+ vereist.

## Structuur

```
src/
├── games/                       # elk spel staat op zichzelf
│   ├── index.ts                 # GAMES — single source of truth
│   ├── types.ts
│   ├── onderwerpen/             # Game.tsx, data.ts, meta.ts
│   ├── stellingen/
│   ├── beeldraden/
│   └── letterdobbelsteen/
├── components/                  # gedeelde UI: Button, Card, AppShell, LevelPicker, GameCard
├── hooks/                       # useLevelFilter, useNoRepeatPicker
├── lib/                         # random, storage, cn helpers
├── pages/                       # HomePage, NotFoundPage
├── types/content.ts             # Topic, Statement, ImagePrompt, DiceTheme
├── router.tsx                   # routes opgebouwd uit GAMES
└── index.css                    # Tailwind + brand-tokens (:root variabelen)
```

### Een spel toevoegen

1. Maak een nieuwe folder onder `src/games/<naam>/` met `Game.tsx`, eventuele `data.ts`, en `meta.ts`.
2. Exporteer in `meta.ts` een `Game`-object (zie bestaande spelletjes).
3. Voeg je nieuwe game toe aan `src/games/index.ts`.

Klaar — de homepagina toont automatisch een kaart, en de router heeft een nieuwe route.

## Content aanpassen

Alle teksten staan in TypeScript-bestanden, geen database:

- Onderwerpen: `src/games/onderwerpen/data.ts`
- Stellingen: `src/games/stellingen/data.ts`
- Foto's: `src/games/beeldraden/images.ts` (en de bestanden in `public/images/beeldraden/`)
- Thema's voor de letter-dobbelsteen: `src/games/letterdobbelsteen/themes.ts`

De afbeeldingen in `public/images/beeldraden/` zijn placeholder-illustraties (SVG). Vervang ze met royalty-free foto's (Unsplash / Pexels / Pixabay) en vul `credit` in op `ImagePrompt`.

## Huisstijl

Brand-kleuren staan als HSL-variabelen in `src/index.css` (`:root`-blok). Pas die regels aan zodra het GSSL-logo en kleurpalet beschikbaar zijn — verder hoeft er niets te veranderen.

## Deploy (Netlify)

`netlify.toml` en `public/_redirects` zijn al ingesteld voor SPA-routing.

1. Verbind de repo met een Netlify-site.
2. Build-instellingen worden automatisch opgepakt: `npm run build` → `dist/`.
