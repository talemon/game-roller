import { tagFacet } from '../steam-tags';

export const viewpointFacet = tagFacet({
  id: 'viewpoint',
  label: 'Look & viewpoint',
  hint: 'Art style and camera',
  icon: 'eye',
  slot: 'prefix',
  enabledByDefault: false,
  hue: 150,
  count: { min: 1, max: 2, default: 1 },
  group: 'viewpoint',
  phrases: {
    'Third Person': 'third-person',
    'Pixel Graphics': 'pixel-art',
    'Comic Book': 'comic-book',
    'Side Scroller': 'side-scrolling',
  },
});
