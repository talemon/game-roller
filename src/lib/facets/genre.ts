import { tagFacet } from '../steam-tags';
import { GENRE_CATEGORIES } from './categories';

export const genreFacet = tagFacet({
  id: 'genre',
  label: 'Genre',
  hint: 'What kind of game it is',
  slot: 'prefix',
  enabledByDefault: true,
  hue: 255,
  count: { min: 1, max: 4, default: 2 },
  categories: [...GENRE_CATEGORIES],
  excludeCategories: ['Software Genres'],
  exclude: ['Indie'],
  phrases: {
    RPG: 'role-playing',
    'Action RPG': 'action role-playing',
    'Strategy RPG': 'strategy role-playing',
    'Party-Based RPG': 'party-based role-playing',
    'Tactical RPG': 'tactical role-playing',
    RTS: 'real-time strategy',
    'Action RTS': 'action real-time strategy',
    FPS: 'first-person shooter',
    'Point & Click': 'point-and-click',
    'Hack and Slash': 'hack-and-slash',
    "Shoot 'Em Up": "shoot-'em-up",
    "Beat 'em up": "beat-'em-up",
    'Choose Your Own Adventure': 'choose-your-own-adventure',
    'Open World Survival Craft': 'open-world survival-craft',
    'Match 3': 'match-3',
  },
});
