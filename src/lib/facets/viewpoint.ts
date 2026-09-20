import { tagFacet } from '../steam-tags';

export const viewpointFacet = tagFacet({
  id: 'viewpoint',
  label: 'Look & viewpoint',
  hint: 'Steam visuals & viewpoint tags',
  slot: 'prefix',
  enabledByDefault: false,
  count: { min: 1, max: 2, default: 1 },
  categories: ['Visuals & Viewpoint'],
  exclude: ['360 Video', 'Split Screen'],
  phrases: {
    'Third Person': 'third-person',
    'Pixel Graphics': 'pixel-art',
    'Comic Book': 'comic-book',
  },
});
