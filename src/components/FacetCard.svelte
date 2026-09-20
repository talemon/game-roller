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
</script>

<article class="card" class:disabled={!state.enabled}>
  <header>
    <label class="title">
      <input type="checkbox" bind:checked={state.enabled} />
      <span>{facet.label}</span>
    </label>
    <p class="hint">{facet.hint}</p>
  </header>

  <div class="controls">
    {#if facet.count.max > facet.count.min}
      <label class="count" for="count-{facet.id}">
        How many
        <input
          id="count-{facet.id}"
          type="number"
          min={facet.count.min}
          max={facet.count.max}
          bind:value={state.count}
          disabled={!state.enabled}
        />
      </label>
    {/if}
    <button onclick={onRoll} disabled={!state.enabled}>Roll</button>
  </div>

  {#if state.rolled.length > 0}
    <ul class="chips">
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
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    transition: opacity 0.15s;
  }

  .card.disabled {
    opacity: 0.55;
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

  .chips {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
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
  }

  .chip-label {
    font-weight: 500;
  }

  .emoji {
    margin-right: 0.35em;
  }

  .chip-desc {
    font-size: 0.8rem;
    color: var(--muted);
    line-height: 1.35;
  }

  .attribution {
    margin-left: 0.35rem;
    font-size: 0.75rem;
    opacity: 0.8;
  }

  .chip:has(.chip-desc) {
    border-radius: 12px;
    padding: 0.5rem 0.9rem;
  }
</style>
