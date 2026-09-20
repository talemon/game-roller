# Game Roller

Static web app that rolls random game ideas. Roll one or more genres (from the
[SteamDB tag list](https://steamdb.info/tags/)) and a "master plot" (Christopher
Booker's seven basic plots plus Ronald B. Tobias's twenty master plots), and the
app composes a sentence such as:

> A role-playing action game about discovery

Optional facets — theme, look & viewpoint, players — can be switched on per card.

Svelte 5 + Vite, TypeScript, Bun. No backend, no persistence.

## Commands

```sh
bun install
bun run dev       # dev server
bun run build     # static build in dist/
bun run preview   # serve dist/
bun test          # unit tests (bun:test)
bun run check     # svelte-check + tsc
```

## Refreshing the Steam tag data

`src/data/steam-tags.json` is a checked-in snapshot of https://steamdb.info/tags/.
SteamDB returns HTTP 403 to plain HTTP clients, so the fetch step uses the
[Firecrawl CLI](https://www.firecrawl.dev/) (must be installed and logged in):

```sh
bun run tags:refresh   # = tags:fetch (firecrawl → .cache/steamdb-tags.html) + tags:parse
```

Without Firecrawl, save the page from a browser ("Webpage, HTML only") to
`.cache/steamdb-tags.html` and run `bun run tags:parse`. The parser refuses to
overwrite the snapshot if it finds fewer than 300 tags or 20 categories, and the
facet modules throw at load if a category they depend on has been renamed.

## Adding a rollable detail

A facet is any object matching `Facet` in `src/lib/facets/types.ts`:

```ts
export interface Facet {
  id: string;
  label: string;
  hint: string;                      // one line under the card title
  slot: 'prefix' | 'about' | 'trailing';
  items: readonly FacetItem[];       // { id, label, phrase, emoji?, description?, attribution? }
  count: { min: number; max: number; default: number };
  enabledByDefault: boolean;
  hue: number;                       // OKLCH hue for this facet's chips (0–360)
  renderTrailing?: (phrases: string[]) => string;   // required when slot === 'trailing'
}
```

`prefix` phrases go before "game", `about` phrases after "about", and
`trailing` facets append a comma clause rendered by `renderTrailing`.

For a SteamDB-backed facet, use `tagFacet` from `src/lib/steam-tags.ts`;
otherwise build `items` by hand. Then add it to `src/lib/facets/registry.ts` —
registry order is sentence order.

```ts
// src/lib/facets/setting.ts
import { tagFacet } from '../steam-tags';

export const settingFacet = tagFacet({
  id: 'setting',
  label: 'Setting',
  hint: 'Steam science-fiction tags',
  slot: 'trailing',
  enabledByDefault: false,
  hue: 280,
  count: { min: 1, max: 1, default: 1 },
  categories: ['Science Fiction'],
  renderTrailing: (p) => `set in a ${p[0]} world`,
});
```

```ts
// src/lib/facets/registry.ts
export const facets = [viewpointFacet, playersFacet, genreFacet, plotFacet, themeFacet, settingFacet];
```
