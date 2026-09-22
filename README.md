# Game Roller

Static web app that rolls random game ideas. Roll one or more genres (from Steam's public
tag list) and a "master plot" (this project's own list of playable premises), and the app
composes a sentence such as:

> A role-playing action game about a heist

Optional facets — theme, look & viewpoint, players — can be switched on per card.

Svelte 5 + Vite, TypeScript, Bun. No backend; preferences (theme, reveal, left-out options) live in `localStorage`.

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

`src/data/steam-tags.json` is a checked-in snapshot of Valve's tag list:

```sh
bun run tags:refresh
```

It fetches `IStoreService/GetTagList` (public, no key, no bot shield), keeps only the tags
classified in `src/data/tag-groups.ts`, and records Valve's `version_hash` so an unchanged
upstream is obvious. Valve serves `{tagid, name}` and no grouping, so **which facet a tag
rolls for is this project's own classification** — written against the vocabulary Valve's
[Tag Wizard](https://partner.steamgames.com/doc/store/tags) uses (Genres and Sub-Genres,
Themes & Moods, Visuals & View Points, Player support). One group per tag.

The refresh fails if a name in `tag-groups.ts` is gone from Valve's list, so an upstream
rename surfaces as a broken refresh instead of a facet quietly losing an item. It also
prints the Valve tags that roll for nothing, which is where new tags show up.

## Adding a rollable detail

A facet is any object matching `Facet` in `src/lib/facets/types.ts`:

```ts
export interface Facet {
  id: string;
  label: string;
  hint: string;                      // one line under the card title
  slot: 'prefix' | 'about' | 'trailing';
  icon: IconName;                    // Lucide icon beside the card title (src/lib/icons.ts)
  items: readonly FacetItem[];       // { id, label, phrase, description?, families? }
  count: { min: number; max: number; default: number };
  enabledByDefault: boolean;
  hue: number;                       // OKLCH hue for this facet's chips (0–360)
  renderTrailing?: (phrases: string[]) => string;   // required when slot === 'trailing'
}
```

`prefix` phrases go before "game", `about` phrases after "about", and
`trailing` facets append a comma clause rendered by `renderTrailing`.

For a Steam-tag-backed facet, use `tagFacet` from `src/lib/steam-tags.ts` and give it a
`group` from `src/data/tag-groups.ts`; otherwise build `items` by hand. Then add it to
`src/lib/facets/registry.ts` — registry order is sentence order.

```ts
// src/lib/facets/setting.ts
import { tagFacet } from '../steam-tags';

export const settingFacet = tagFacet({
  id: 'setting',
  label: 'Setting',
  hint: 'Where the story happens',
  slot: 'trailing',
  icon: 'palette',
  enabledByDefault: false,
  hue: 280,
  count: { min: 1, max: 1, default: 1 },
  group: 'theme',
  renderTrailing: (p) => `set in a ${p[0]} world`,
});
```

```ts
// src/lib/facets/registry.ts
export const facets = [viewpointFacet, playersFacet, genreFacet, plotFacet, themeFacet, settingFacet];
```
