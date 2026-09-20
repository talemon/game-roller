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
    onRoll,
  }: { facet: Facet; state: FacetState; onRoll: () => void } = $props();

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

<article class="card" class:disabled={!state.enabled} aria-labelledby="facet-{facet.id}">
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

  {#if state.rolled.length > 0}
    <ul class="chips" aria-label="Rolled {facet.label}">
      {#each state.rolled as item (item.id)}
        <li class="chip">
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
    </ul>
  {/if}
</article>

<style>
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: var(--shadow);
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
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

  .chips {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    transition: opacity 0.15s;
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
</style>
