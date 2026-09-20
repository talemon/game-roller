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
"A role-playing action game about discovery". Genres and optional theme, look &
viewpoint, and players come from the SteamDB tag list; the master plot comes from
Christopher Booker's seven basic plots and Ronald B. Tobias's twenty master plots.

Success is one idea worth keeping. A session ends well when the user copies a
sentence and leaves to build it. Copy is the conversion event, not dwell time or
roll count.

## Positioning

Two vocabularies most idea generators do not combine: the taxonomy Steam players
actually use to find games, and the plot taxonomy from narrative theory. The
result is a concept that names both what the game *is* mechanically and what it
is *about* — and it arrives as a sentence, not a table of slot-machine columns
the user has to assemble themselves.

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
- Tag data is a checked-in, dated snapshot (`src/data/steam-tags.json`),
  refreshed via `bun run tags:refresh`. The parser refuses a snapshot under 300
  tags or 20 categories; facet modules throw at load if a category they depend
  on was renamed. The committed snapshot is pruned to categories a facet
  actually rolls from.
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

- `src/data/steam-tags.json` — dated SteamDB tag snapshot, 343 rollable tags.
- `src/data/master-plots.ts` — Booker's 7 and Tobias's 20, each with a
  description and source attribution.
- No users, no testimonials, no usage numbers, no press. Future work must not
  invent any.

## Product Principles

1. **The sentence is the product.** Every facet earns its place by reading well
   inside one sentence; chips and cards exist to explain and re-roll it.
2. **One idea worth keeping beats many ideas seen.** Optimize for the user
   leaving with a copied sentence, not for time spent rolling.
3. **Partial re-rolling is the real interaction.** Keeping what works and
   re-rolling what does not is how a random prompt becomes someone's concept.
4. **Credit the sources in the open.** SteamDB and Booker/Tobias attribution
   stays visible; the tag snapshot stays dated and refreshable.
5. **Nothing rolls that the user did not ask for.** Facet toggles and counts are
   the contract; defaults may be opinionated, never sticky against the user.

## Accessibility & Inclusion

No product-specific standard was established beyond the implementation's current
bar: WCAG AA contrast in both themes, per-component reduced-motion alternatives,
the reveal skippable by button and Escape, and one announcement per outcome
rather than per reveal step.
