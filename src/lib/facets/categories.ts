/**
 * SteamDB categories each tag facet draws from. Single source of truth: the facets roll
 * from these lists and `scripts/scrape-steam-tags.ts` keeps only tags that land in one,
 * so the bundled dataset carries no tag the app can never show.
 *
 * A tag's own `categories` array stays complete even when some of its categories are not
 * listed here — `excludeCategories` (e.g. genre dropping `Software Genres`) reads it.
 */
export const GENRE_CATEGORIES = [
  'Top-Level Genres',
  'Genres',
  'Sub-Genres',
  'Role-Playing Genres',
  'Card & Board Genres',
] as const;

export const THEME_CATEGORIES = ['Themes & Moods'] as const;
export const VIEWPOINT_CATEGORIES = ['Visuals & Viewpoint'] as const;
export const PLAYERS_CATEGORIES = ['Players'] as const;

/** Every category the app rolls from; the scraper prunes tags outside this set. */
export const ROLLED_CATEGORIES: readonly string[] = [
  ...GENRE_CATEGORIES,
  ...THEME_CATEGORIES,
  ...VIEWPOINT_CATEGORIES,
  ...PLAYERS_CATEGORIES,
];
