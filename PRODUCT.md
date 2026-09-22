# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Solo game developers and game-jam entrants, at the moment before a project
exists: the jam theme just dropped, or a free weekend is open, and no concept
has arrived. They are alone, usually at a desk, and they want a starting point
they did not have to argue themselves into. They are not browsing for
entertainment; they are trying to leave with something to build.

## Product Purpose

Rolls a random game concept and composes it into one readable English sentence —
"A role-playing action game about a heist". Genres and optional theme, look &
viewpoint, and players come from Steam's public tag list, grouped into facets by
this project; the master plot comes from this project's own list of playable
premises, written for games and informed by Ronald B. Tobias's 20 Master Plots
among other sources.

Success is one idea worth keeping. A session ends well when the user copies a
sentence and leaves to build it. Copy is the conversion event, not dwell time or
roll count.

## Positioning

Two vocabularies most idea generators do not combine: the taxonomy Steam players
actually use to find games, and a plot taxonomy written for things a player is
put inside — a situation with a verb, a pressure and a stake. The result is a
concept that names both what the game *is* mechanically and what it is *about* —
and it arrives as a sentence, not a table of slot-machine columns the user has to
assemble themselves.

## Operating Context

Single page, no setup, no account. The user rolls, reads, re-rolls the facets
they dislike, and copies. Per-facet Roll buttons matter as much as Roll
everything: keeping a genre while re-rolling the plot is the core interaction,
not a refinement of it. The result usually leaves the app immediately — into a
notes file, a jam submission form, or a message to a collaborator.

## Capabilities and Constraints

- Static build, no backend, no accounts, no analytics, no data collection.
  `localStorage` holds only the theme and reveal preferences.
- Every facet must compose into one grammatical English sentence. A detail that
  cannot be phrased into the sentence is out of scope, however interesting.
  Facet slots: `prefix` (before "game"), `about` (after "about"), `trailing`
  (a comma clause rendered by `renderTrailing`).
- Facets stay user-controllable: per-facet on/off and per-facet counts within
  declared bounds. Nothing rolls that the user did not ask for.
- Tag data is a checked-in, dated snapshot (`src/data/steam-tags.json`) of Valve's
  public `IStoreService/GetTagList`, refreshed via `bun run tags:refresh`. Valve
  publishes tag ids and names but no grouping, so `src/data/tag-groups.ts` — which
  facet each tag rolls for, one group per tag — is this project's own work. A refresh
  fails on any classified name Valve no longer serves, and the snapshot carries only
  classified tags.
- Adding a rollable detail is a documented extension point: a `Facet` object in
  `src/lib/facets/`, listed in `registry.ts`, where registry order is sentence
  order.
- Svelte 5 + Vite + TypeScript, Bun for install/test/scripts. Deploys as static
  assets on a Cloudflare Worker.

## Brand Commitments

Name: Game Roller. Voice is plain and unceremonious — the app never oversells the
idea it just produced, and never editorializes about whether a combination is
good. The dice metaphor is behavioral (rattle, lock, land), not decorative.

## Evidence on Hand

- `src/data/steam-tags.json` — dated snapshot of Valve's tag list, 330 rollable tags
  across 142 genres, 147 themes, 28 looks and 13 player modes.
- `src/data/master-plots.ts` — 30 master plots, this project's own taxonomy, each
  with a description and a dedupe family.
- No users, no testimonials, no usage numbers, no press. Future work must not
  invent any.

## Product Principles

1. **The sentence is the product.** Every facet earns its place by reading well
   inside one sentence; chips and cards exist to explain and re-roll it.
2. **One idea worth keeping beats many ideas seen.** Optimize for the user
   leaving with a copied sentence, not for time spent rolling.
3. **Partial re-rolling is the real interaction.** Keeping what works and
   re-rolling what does not is how a random prompt becomes someone's concept.
4. **Credit the sources in the open.** Steam, Lucide and the plot list's
   influences stay visible; the tag snapshot stays dated, versioned and
   refreshable. The master plots themselves are this project's own work.
5. **Nothing rolls that the user did not ask for.** Facet toggles and counts are
   the contract; defaults may be opinionated, never sticky against the user.

## Accessibility & Inclusion

No product-specific standard was established beyond the implementation's current
bar: WCAG AA contrast in both themes, per-component reduced-motion alternatives,
the reveal skippable by button and Escape, and one announcement per outcome
rather than per reveal step.
