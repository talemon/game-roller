import { tagFacet } from '../steam-tags';
import { VIEWPOINT_CATEGORIES } from './categories';

export const viewpointFacet = tagFacet({
  id: 'viewpoint',
  label: 'Look & viewpoint',
  hint: 'Art style and camera',
  slot: 'prefix',
  enabledByDefault: false,
  hue: 150,
  count: { min: 1, max: 2, default: 1 },
  categories: [...VIEWPOINT_CATEGORIES],
  exclude: ['360 Video', 'Split Screen'],
  phrases: {
    'Third Person': 'third-person',
    'Pixel Graphics': 'pixel-art',
    'Comic Book': 'comic-book',
  },
});
