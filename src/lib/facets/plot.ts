import { masterPlots, type PlotSource } from '../../data/master-plots';
import type { Facet } from './types';

const SOURCE_NAME: Record<PlotSource, string> = { booker: 'Booker', tobias: 'Tobias' };

export const plotFacet: Facet = {
  id: 'plot',
  label: 'Master plot',
  hint: "Booker's 7 basic plots + Tobias's 20 master plots",
  slot: 'about',
  enabledByDefault: true,
  count: { min: 1, max: 2, default: 1 },
  items: masterPlots.map((p) => ({
    id: `plot:${p.id}`,
    label: p.title,
    phrase: p.phrase,
    description: p.description,
    attribution: p.sources.map((s) => SOURCE_NAME[s]).join(' & '),
  })),
};
