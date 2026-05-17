# GSSL Spelletjes

Web app met spelletjes voor **Gilde SamenSpraak Leiden** — bedoeld voor taalmaatjes en anderstaligen om samen een gesprek op gang te brengen. Geen account, geen internet-afhankelijke services: een statische app die op telefoon of laptop draait.

## Spelletjes

1. **Onderwerpen** — willekeurig gespreksonderwerp (filter op niveau A1–B2 en op thema).
2. **Stellingen & dilemma's** — een stelling waarover ieder z'n mening geeft.
3. **Beeldraden** — beschrijf samen wat je op de foto ziet (met optionele hint).
4. **Letter-dobbelsteen** — virtuele dobbelsteen met 26 letters + 4 wild-vlakjes en meerdere spelmodi (beginklank / eindklank / thema + letter).
5. **Situatiekaarten** — speel een alledaagse situatie na en verdeel de rollen.
6. **Woordenweb** — noem in 60 seconden zoveel mogelijk woorden rond één thema.
7. **Wie of Wat ben ik?** — raad met ja/nee-vragen wat er op de kaart staat.
8. **Spreekwoorden** — raad de betekenis van Nederlandse spreekwoorden en uitdrukkingen.

De meeste spelletjes filteren op taalniveau (A1–B2) en op een gedeelde set thema's: Buurt, Familie, Werk, Eten, Reizen, Vrije tijd, Wonen en Gezondheid.

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
│   ├── letterdobbelsteen/
│   ├── situaties/
│   ├── woordenweb/
│   ├── wiewatbenik/
│   └── spreekwoorden/
├── components/                  # gedeelde UI: Button, Card, AppShell, LevelPicker, CategoryFilter, GameCard
├── hooks/                       # useLevelFilter, useNoRepeatPicker, useCountdown, useOnboarding, useTheme
├── lib/                         # random, storage, cn helpers
├── pages/                       # HomePage, NotFoundPage
├── types/content.ts             # Topic, Statement, ImagePrompt, Situation, WordPrompt, Spreekwoord
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
- Situaties: `src/games/situaties/data.ts`
- Woordenweb: `src/games/woordenweb/data.ts`
- Wie of Wat ben ik: `src/games/wiewatbenik/data.ts`
- Spreekwoorden: `src/games/spreekwoorden/data.ts`
- Foto's: `src/games/beeldraden/images.ts` (en de bestanden in `public/images/beeldraden/`)
- Thema's voor de letter-dobbelsteen: `src/games/letterdobbelsteen/themes.ts`

## Huisstijl

Brand-kleuren staan als HSL-variabelen in `src/index.css` (`:root`-blok). Pas die regels aan zodra het GSSL-logo en kleurpalet beschikbaar zijn — verder hoeft er niets te veranderen.

## Deploy (Netlify)

`netlify.toml` en `public/_redirects` zijn al ingesteld voor SPA-routing.

1. Verbind de repo met een Netlify-site.
2. Build-instellingen worden automatisch opgepakt: `npm run build` → `dist/`.

## Licentie

Dit project staat onder de **[Creative Commons Naamsvermelding-NietCommercieel 4.0 Internationaal](https://creativecommons.org/licenses/by-nc/4.0/deed.nl)** licentie (CC BY-NC 4.0). Zie het [`LICENSE`](./LICENSE)-bestand voor de volledige tekst.

Dit betekent dat je het project — broncode, teksten én foto's — vrij mag gebruiken, delen en aanpassen, op twee voorwaarden:

- **Naamsvermelding** — vermeld de maker en Gilde SamenSpraak Leiden, met een link naar deze repository.
- **Niet-commercieel** — gebruik het niet voor commerciële doeleinden.

## Credits

Gemaakt door **Joey van Kuilenburg** voor **Gilde SamenSpraak Leiden**.

De foto's bij Beeldraden zijn eigen werk van Joey van Kuilenburg en vallen onder dezelfde CC BY-NC 4.0-licentie.
