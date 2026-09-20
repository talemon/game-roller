import { masterPlots, type PlotSource } from '../../data/master-plots';
import type { Facet } from './types';

const SOURCE_NAME: Record<PlotSource, string> = { booker: 'Booker', tobias: 'Tobias' };

/**
 * Plots that name the same arc in different vocabularies. Booker and Tobias overlap, and
 * "about transformation and metamorphosis" is one idea printed twice.
 */
const PLOT_FAMILY: Record<string, string> = {
  transformation: 'change',
  metamorphosis: 'change',
  maturation: 'change',
  rebirth: 'change',
  ascension: 'fortune',
  descension: 'fortune',
  pursuit: 'chase',
  escape: 'chase',
  rivalry: 'contest',
  underdog: 'contest',
};

export const plotFacet: Facet = {
  id: 'plot',
  label: 'Master plot',
  hint: "Booker's 7 basic plots + Tobias's 20 master plots",
  slot: 'about',
  enabledByDefault: true,
  hue: 45,
  count: { min: 1, max: 2, default: 1 },
  items: masterPlots.map((p) => ({
    id: `plot:${p.id}`,
    label: p.title,
    phrase: p.phrase,
    description: p.description,
    attribution: p.sources.map((s) => SOURCE_NAME[s]).join(' & '),
    family: PLOT_FAMILY[p.id],
  })),
};
