<script lang="ts" module>
  import type { FacetItem } from '../lib/facets/types';

  export interface FacetState {
    enabled: boolean;
    count: number;
    rolled: FacetItem[];
  }
</script>

<script lang="ts">
  import type { Facet } from '../lib/facets/types';

  let {
    facet,
    state = $bindable(),
    ghosts,
    onRoll,
  }: {
    facet: Facet;
    state: FacetState;
    /** Decoy items while this slot is rattling; undefined once settled. */
    ghosts?: FacetItem[];
    onRoll: () => void;
  } = $props();

  const rattling = $derived(ghosts !== undefined);
  /** Rows reserved under the controls: one per rolled chip, so a lock never grows the card. */
  const reservedRows = $derived(state.count);
  const tallChips = $derived(facet.items.some((item) => item.description));

  const hasCount = $derived(facet.count.max > facet.count.min);

  /** Snap whatever the user typed (empty, decimal, out of range) back into the facet's bounds. */
  function clampCount(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const parsed = input.value.trim() === '' ? Number.NaN : Math.round(Number(input.value));
    const next = Number.isFinite(parsed)
      ? Math.max(facet.count.min, Math.min(parsed, facet.count.max))
      : facet.count.default;
    state.count = next;
    input.value = String(next);
  }
</script>

<article
  class="card"
  class:disabled={!state.enabled}
  class:rattling
  aria-labelledby="facet-{facet.id}"
  aria-busy={rattling}
>
  <header>
    <label class="title">
      <input type="checkbox" bind:checked={state.enabled} />
      <span id="facet-{facet.id}">{facet.label}</span>
    </label>
    <p class="hint" id="hint-{facet.id}">{facet.hint}</p>
  </header>

  <div class="controls">
    {#if hasCount}
      <label class="count" for="count-{facet.id}">
        How many
        <input
          id="count-{facet.id}"
          type="number"
          inputmode="numeric"
          min={facet.count.min}
          max={facet.count.max}
          step="1"
          bind:value={state.count}
          onchange={clampCount}
          disabled={!state.enabled}
          aria-describedby="range-{facet.id}"
        />
        <span class="range" id="range-{facet.id}">{facet.count.min}–{facet.count.max}</span>
      </label>
    {/if}
    <button onclick={onRoll} disabled={!state.enabled} aria-describedby="hint-{facet.id}">
      Roll
    </button>
  </div>

  <ul
    class="chips"
    class:tall={tallChips}
    style="--rows: {reservedRows}"
    aria-label="Rolled {facet.label}"
    aria-hidden={ghosts !== undefined}
  >
    {#if ghosts}
      {#each ghosts as item, i (i)}
        <li class="chip ghost">
          <span class="chip-label">
            {#if item.emoji}<span class="emoji">{item.emoji}</span>{/if}{item.label}
          </span>
        </li>
      {/each}
    {:else}
      {#each state.rolled as item, i (item.id)}
        <li class="chip landed" style="--i: {i}">
          <span class="chip-label">
            {#if item.emoji}<span class="emoji" aria-hidden="true">{item.emoji}</span>{/if}{item.label}
          </span>
          {#if item.description}
            <span class="chip-desc">
              {item.description}
              {#if item.attribution}<span class="attribution">{item.attribution}</span>{/if}
            </span>
          {/if}
        </li>
      {/each}
    {/if}
  </ul>
</article>

<style>
  /* Narrow: stacked. Wide: a row — title and controls in a fixed left column, chips fill the rest. */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: var(--shadow);
    padding: 1rem 1.25rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
    min-width: 0;
    transition: border-color 0.15s;
  }

  /* Disabled: fade the controls and rolled chips, keep the title and hint readable. */
  .card.disabled {
    border-style: dashed;
  }

  .card.disabled .title span,
  .card.disabled .hint {
    color: var(--muted);
  }

  .card.disabled .controls,
  .card.disabled .chips {
    opacity: 0.5;
  }

  header {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    font-size: 1.05rem;
    cursor: pointer;
    min-height: 2.75rem;
    margin-block: -0.5rem;
  }

  .hint {
    margin: 0;
    color: var(--muted);
    font-size: 0.85rem;
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    transition: opacity 0.15s;
  }

  .count {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--muted);
  }

  .count input {
    width: 4rem;
  }

  .range {
    font-variant-numeric: tabular-nums;
    font-size: 0.8rem;
  }

  /* Always present with rows reserved, so landing chips never push the layout. */
  .chips {
    --row: 2.4rem;
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 0.5rem;
    min-height: calc(var(--rows, 1) * var(--row) + (var(--rows, 1) - 1) * 0.5rem);
    transition: opacity 0.15s;
  }

  /* Sized for the longest plot description at full mobile width (3 lines). */
  .chips.tall {
    --row: 5.2rem;
  }

  .chip {
    background: var(--chip);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 0.35rem 0.8rem;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    max-width: 100%;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .chip-label {
    font-weight: 500;
  }

  .emoji {
    margin-inline-end: 0.35em;
  }

  .chip-desc {
    font-size: 0.8rem;
    color: var(--muted);
    line-height: 1.35;
  }

  .attribution {
    margin-inline-start: 0.35rem;
    font-size: 0.75rem;
    opacity: 0.8;
  }

  .chip:has(.chip-desc) {
    border-radius: 12px;
    padding: 0.5rem 0.9rem;
  }

  /* Rattling: the slot is live — accent edge, decoys dimmed and blurred like dice still moving. */
  .card.rattling {
    border-color: var(--accent);
  }

  .chip.ghost {
    color: var(--muted);
    border-style: dashed;
    filter: blur(0.6px);
    width: 7.5rem;
    max-width: 100%;
  }

  .chip.ghost .chip-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Landing: each locked chip drops into place, staggered by index. */
  .chip.landed {
    animation: land 320ms cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(var(--i) * 45ms);
  }

  @keyframes land {
    from {
      transform: translateY(-0.5rem) scale(1.06);
      opacity: 0;
    }
    to {
      transform: none;
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .chip.landed {
      animation: appear 180ms ease-out both;
    }

    .chip.ghost {
      filter: none;
    }

    @keyframes appear {
      from {
        opacity: 0;
      }
    }
  }

  @media (min-width: 720px) {
    .card {
      grid-template-columns: 17rem 1fr;
      grid-template-areas:
        'header chips'
        'controls chips';
      column-gap: 1.5rem;
      align-items: start;
    }

    header {
      grid-area: header;
    }

    .controls {
      grid-area: controls;
    }

    .chips {
      grid-area: chips;
      align-self: stretch;
      /* Results read as the row's answer: pushed right, centred against the controls. */
      justify-content: flex-end;
      align-content: center;
      /* Full width fits every roll on one row; reserve just that. */
      min-height: var(--row);
    }

    /* Two plot descriptions side by side, each with room to wrap. */
    .chip:has(.chip-desc) {
      flex: 1 1 18rem;
      max-width: 28rem;
    }
  }
</style>
