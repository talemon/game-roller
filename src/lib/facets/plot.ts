import { masterPlots } from '../../data/master-plots';
import type { Facet } from './types';

export const plotFacet: Facet = {
  id: 'plot',
  label: 'Master plot',
  hint: 'Playable premises: a situation, a pressure and a stake',
  slot: 'about',
  icon: 'book',
  enabledByDefault: true,
  hue: 45,
  count: { min: 1, max: 2, default: 1 },
  items: masterPlots.map((p) => ({
    id: `plot:${p.id}`,
    label: p.title,
    phrase: p.phrase,
    description: p.description,
    families: p.family === undefined ? undefined : [p.family],
  })),
};
