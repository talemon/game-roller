import { describe, expect, test } from 'bun:test';
import { parseSteamTags } from './scrape-steam-tags';

const fixture = `Scrape ID: abc123
<div class="taglist-wrap">
  <h2 class="b" id="theme"><svg viewBox="0 0 1 1"><path d="M0 0"/></svg>Themes &amp; Moods</h2>
  <div class="taglist">
    <div class="label" data-s="ATMOSPHERIC">
      <a class="btn btn-outline tag-color-6" href="https://steamdb.info/tag/4166/?min_reviews=500"><span aria-hidden="true">🌫 </span>Atmospheric</a>
      <span class="label-count">50904</span>
    </div>
    <div class="label" data-s="SPORTS">
      <a class="btn btn-outline" href="https://steamdb.info/tag/701/?min_reviews=500"><span aria-hidden="true">🏅 </span>Sports</a>
      <span class="label-count">12,856</span>
    </div>
  </div>
</div>
<div class="taglist-wrap">
  <h2 class="b" id="top"><svg viewBox="0 0 1 1"><path d="M0 0"/></svg>Top-Level Genres</h2>
  <div class="taglist">
    <div class="label" data-s="SPORTS">
      <a class="btn btn-outline" href="https://steamdb.info/tag/701/?min_reviews=500"><span aria-hidden="true">🏅 </span>Sports</a>
      <span class="label-count">12856</span>
    </div>
  </div>
</div>`;

describe('parseSteamTags', () => {
  const parsed = parseSteamTags(fixture);

  test('categories keep page order with svg icons stripped', () => {
    expect(parsed.categories).toEqual(['Themes & Moods', 'Top-Level Genres']);
  });

  test('dedupes repeated tags by id, accumulating categories', () => {
    expect(parsed.tags).toHaveLength(2);
    const sports = parsed.tags.find((t) => t.id === 701);
    expect(sports).toEqual({
      id: 701,
      name: 'Sports',
      emoji: '🏅',
      count: 12856,
      categories: ['Themes & Moods', 'Top-Level Genres'],
    });
  });

  test('sorts tags by id', () => {
    expect(parsed.tags.map((t) => t.id)).toEqual([701, 4166]);
  });
});
