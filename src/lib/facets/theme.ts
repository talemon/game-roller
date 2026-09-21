import { themeDescriptions } from '../../data/theme-descriptions';
import { indefiniteArticle } from '../sentence';
import { tagFacet } from '../steam-tags';

export const themeFacet = tagFacet({
  id: 'theme',
  label: 'Theme',
  hint: 'Setting, subject or mood',
  icon: 'palette',
  slot: 'trailing',
  enabledByDefault: false,
  hue: 330,
  count: { min: 1, max: 2, default: 1 },
  group: 'theme',
  descriptions: themeDescriptions,
  renderTrailing: (p) =>
    p.length === 1 ? `with ${indefiniteArticle(p[0])} ${p[0]} theme` : `with ${p.join(' and ')} themes`,
});
