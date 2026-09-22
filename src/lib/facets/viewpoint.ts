import { tagFacet } from '../steam-tags';

/**
 * Two looks roll at once, and Steam's list mixes answers to different questions with answers
 * to the same one. A game has one dimension, one camera and one way of being drawn, so those
 * are families; mood words (`cute`, `colorful`, `cinematic`) are free to combine with anything.
 * `Text-Based` and `FMV` answer all three questions at once — there is no isometric text game.
 */
const VIEWPOINT_FAMILIES: Record<string, readonly string[]> = {
  '2D': ['dimension'],
  '2.5D': ['dimension'],
  '3D': ['dimension'],
  'First-Person': ['camera'],
  'Third Person': ['camera'],
  'Top-Down': ['camera'],
  Isometric: ['camera'],
  'Side Scroller': ['camera'],
  'Pixel Graphics': ['drawing'],
  Voxel: ['drawing', 'dimension'],
  'Hand-drawn': ['drawing'],
  Realistic: ['drawing', 'toon', 'abstraction'],
  Cartoon: ['drawing', 'toon'],
  Cartoony: ['drawing', 'toon'],
  Anime: ['toon'],
  'Comic Book': ['toon'],
  Abstract: ['abstraction'],
  Minimalist: ['abstraction'],
  Stylized: ['abstraction', 'drawing'],
  VR: ['medium'],
  'Text-Based': ['medium', 'dimension', 'camera', 'drawing', 'toon', 'abstraction'],
  FMV: ['medium', 'dimension', 'camera', 'drawing', 'toon', 'abstraction'],
};

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
  families: VIEWPOINT_FAMILIES,
});
