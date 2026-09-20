import { tagFacet } from '../steam-tags';

export const playersFacet = tagFacet({
  id: 'players',
  label: 'Players',
  hint: 'Solo, co-op or competitive',
  slot: 'prefix',
  enabledByDefault: false,
  hue: 195,
  count: { min: 1, max: 1, default: 1 },
  categories: ['Players'],
  phrases: {
    Singleplayer: 'single-player',
    PvP: 'PvP',
    '4 Player Local': '4-player local',
  },
});
