import type { ImagePrompt } from '../../types/content';

export const IMAGE_PROMPTS: ImagePrompt[] = [
  // ── A1 ──────────────────────────────────────────────────────────────────
  {
    id: 'img-a1-fiets',
    src: '/images/beeldraden/a1-fiets.svg',
    alt: 'Een fiets in een straat',
    levels: ['A1', 'A2'],
    hintCaption: 'Een fiets staat geparkeerd in een straat.',
  },
  {
    id: 'img-a1-huis',
    src: '/images/beeldraden/a1-huis.svg',
    alt: 'Een huis met een rode deur',
    levels: ['A1'],
    hintCaption: 'Een huis met een rode voordeur en een raam.',
  },
  {
    id: 'img-a1-appel',
    src: '/images/beeldraden/a1-appel.svg',
    alt: 'Een rode appel op een tafel',
    levels: ['A1'],
    hintCaption: 'Een rode appel ligt op een tafel.',
  },
  {
    id: 'img-a1-kat',
    src: '/images/beeldraden/a1-kat.svg',
    alt: 'Een oranje kat zit op een vensterbank en kijkt naar buiten',
    levels: ['A1', 'A2'],
    hintCaption: 'Een kat zit op de vensterbank en kijkt door het raam naar buiten.',
  },
  {
    id: 'img-a1-bloemen',
    src: '/images/beeldraden/a1-bloemen.svg',
    alt: 'Kleurrijke bloemen in een blauwe vaas op een tafel',
    levels: ['A1', 'A2'],
    hintCaption: 'Een vaas met rode, gele en roze bloemen staat op een tafel.',
  },

  // ── A2 ──────────────────────────────────────────────────────────────────
  {
    id: 'img-a2-markt',
    src: '/images/beeldraden/a2-markt.svg',
    alt: 'Een marktkraam vol met groente en fruit',
    levels: ['A2', 'B1'],
    hintCaption: 'Een marktkraam met groente en fruit op een plein.',
  },
  {
    id: 'img-a2-park',
    src: '/images/beeldraden/a2-park.svg',
    alt: 'Een park met een bankje en een grote boom',
    levels: ['A1', 'A2'],
    hintCaption: 'Een bankje staat onder een grote boom in een park.',
  },
  {
    id: 'img-a2-cafe',
    src: '/images/beeldraden/a2-cafe.svg',
    alt: 'Een gezellig café met mensen die koffie drinken aan tafeltjes',
    levels: ['A2', 'B1'],
    hintCaption: 'Twee mensen zitten in een café en drinken koffie.',
  },
  {
    id: 'img-a2-speeltuin',
    src: '/images/beeldraden/a2-speeltuin.svg',
    alt: 'Een speeltuin met een glijbaan, schommels en spelende kinderen',
    levels: ['A2', 'B1'],
    hintCaption: 'Kinderen spelen in een speeltuin met een glijbaan en schommels.',
  },

  // ── B1 ──────────────────────────────────────────────────────────────────
  {
    id: 'img-b1-keuken',
    src: '/images/beeldraden/b1-keuken.svg',
    alt: 'Een keuken met pannen en kruiden op het aanrecht',
    levels: ['B1', 'B2'],
    hintCaption: 'Een keuken waar iemand aan het koken is met pannen en kruiden.',
  },
  {
    id: 'img-b1-station',
    src: '/images/beeldraden/b1-station.svg',
    alt: 'Een gele trein die net is aangekomen op een station',
    levels: ['A2', 'B1'],
    hintCaption: 'Een trein staat op het perron van een station.',
  },
  {
    id: 'img-b1-gracht',
    src: '/images/beeldraden/b1-gracht.svg',
    alt: 'Een Hollandse gracht met grachtenpanden, een brug en een boot',
    levels: ['B1', 'B2'],
    hintCaption:
      'Een Hollandse gracht met kleurrijke panden, een brug met fietsen en een boot in het water.',
  },
  {
    id: 'img-b1-familie',
    src: '/images/beeldraden/b1-familie.svg',
    alt: 'Een familie van vijf mensen zit samen aan de eettafel voor het avondeten',
    levels: ['B1', 'B2'],
    hintCaption: 'Een familie eet samen aan tafel. Er staan borden met eten en glazen op tafel.',
  },

  // ── B2 ──────────────────────────────────────────────────────────────────
  {
    id: 'img-b2-strand',
    src: '/images/beeldraden/b2-strand.svg',
    alt: 'Een strand met de zee en een rode parasol op een zonnige dag',
    levels: ['A2', 'B1', 'B2'],
    hintCaption: 'Een rustig strand met zand, zee en een rode parasol op een zonnige dag.',
  },
  {
    id: 'img-b2-bibliotheek',
    src: '/images/beeldraden/b2-bibliotheek.svg',
    alt: 'Een bibliotheek met hoge boekenkasten en een leeshoek',
    levels: ['B1', 'B2'],
    hintCaption: 'Een grote bibliotheek met veel boekenkasten en een rustige leeshoek.',
  },
  {
    id: 'img-b2-stad-avond',
    src: '/images/beeldraden/b2-stad-avond.svg',
    alt: 'Een stad bij avond met verlichte wolkenkrabbers en mensen op straat',
    levels: ['B2'],
    hintCaption:
      'Een drukke stad bij avond. De gebouwen zijn verlicht en mensen lopen over straat.',
  },
];
