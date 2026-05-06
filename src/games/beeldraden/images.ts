import type { ImagePrompt } from '../../types/content';

// Placeholder-illustraties: vervang vrijblijvend met royalty-free foto's
// (Unsplash / Pexels / Pixabay) en vul `credit` in. Bestandsnamen: <level>-<slug>.<ext>.
export const IMAGE_PROMPTS: ImagePrompt[] = [
  {
    id: 'img-a1-fiets',
    src: '/images/beeldraden/a1-fiets.svg',
    alt: 'Een fiets in een straat',
    levels: ['A1'],
    hintCaption: 'een fiets in een straat',
  },
  {
    id: 'img-a1-huis',
    src: '/images/beeldraden/a1-huis.svg',
    alt: 'Een huis met een rode deur',
    levels: ['A1'],
    hintCaption: 'een huis met een rode deur',
  },
  {
    id: 'img-a1-appel',
    src: '/images/beeldraden/a1-appel.svg',
    alt: 'Een rode appel op een tafel',
    levels: ['A1'],
    hintCaption: 'een rode appel op tafel',
  },
  {
    id: 'img-a2-markt',
    src: '/images/beeldraden/a2-markt.svg',
    alt: 'Een marktkraam met groente en fruit',
    levels: ['A2'],
    hintCaption: 'een marktkraam met groente en fruit',
  },
  {
    id: 'img-a2-park',
    src: '/images/beeldraden/a2-park.svg',
    alt: 'Een park met een bankje en een grote boom',
    levels: ['A2'],
    hintCaption: 'een park met een bankje onder een boom',
  },
  {
    id: 'img-b1-keuken',
    src: '/images/beeldraden/b1-keuken.svg',
    alt: 'Een keuken met pannen en kruiden',
    levels: ['B1'],
    hintCaption: 'een keuken waarin iemand aan het koken is',
  },
  {
    id: 'img-b1-station',
    src: '/images/beeldraden/b1-station.svg',
    alt: 'Een gele trein op een station',
    levels: ['B1'],
    hintCaption: 'een trein die net is aangekomen op het station',
  },
  {
    id: 'img-b2-strand',
    src: '/images/beeldraden/b2-strand.svg',
    alt: 'Een strand met de zee en een rode parasol',
    levels: ['B2'],
    hintCaption: 'een rustig strand op een zonnige dag',
  },
  {
    id: 'img-b2-bibliotheek',
    src: '/images/beeldraden/b2-bibliotheek.svg',
    alt: 'Een bibliotheek met boekenkasten en een leeshoek',
    levels: ['B2'],
    hintCaption: 'een bibliotheek met veel boeken en een leeshoek',
  },
];
