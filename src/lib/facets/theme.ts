import { themeDescriptions } from '../../data/theme-descriptions';
import { indefiniteArticle } from '../sentence';
import { tagFacet } from '../steam-tags';
import { THEME_CATEGORIES } from './categories';

export const themeFacet = tagFacet({
  id: 'theme',
  label: 'Theme',
  hint: 'Setting, subject or mood',
  slot: 'trailing',
  enabledByDefault: false,
  hue: 330,
  count: { min: 1, max: 2, default: 1 },
  categories: [...THEME_CATEGORIES],
  descriptions: themeDescriptions,
  renderTrailing: (p) =>
    p.length === 1 ? `with ${indefiniteArticle(p[0])} ${p[0]} theme` : `with ${p.join(' and ')} themes`,
});
