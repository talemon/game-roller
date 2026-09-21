import { tagFacet } from '../steam-tags';

export const playersFacet = tagFacet({
  id: 'players',
  label: 'Players',
  hint: 'Solo, co-op or competitive',
  icon: 'users',
  slot: 'prefix',
  enabledByDefault: false,
  hue: 195,
  count: { min: 1, max: 1, default: 1 },
  group: 'players',
  phrases: {
    Singleplayer: 'single-player',
    PvP: 'PvP',
    '4 Player Local': '4-player local',
    'Split Screen': 'split-screen',
  },
});
