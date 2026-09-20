import { indefiniteArticle } from '../sentence';
import { tagFacet } from '../steam-tags';

export const themeFacet = tagFacet({
  id: 'theme',
  label: 'Theme',
  hint: 'Setting, subject or mood',
  slot: 'trailing',
  enabledByDefault: false,
  count: { min: 1, max: 2, default: 1 },
  categories: ['Themes & Moods'],
  renderTrailing: (p) =>
    p.length === 1 ? `with ${indefiniteArticle(p[0])} ${p[0]} theme` : `with ${p.join(' and ')} themes`,
});
