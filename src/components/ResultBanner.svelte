<script lang="ts">
  let { sentence, onRollAll }: { sentence: string; onRollAll: () => void } = $props();

  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | undefined;

  async function copy() {
    await navigator.clipboard.writeText(sentence);
    copied = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => (copied = false), 1500);
  }
</script>

<section class="banner">
  {#if sentence}
    <p class="sentence">{sentence}</p>
  {:else}
    <p class="sentence placeholder">Roll to get an idea</p>
  {/if}
  <div class="actions">
    <button class="primary" onclick={onRollAll}>Roll everything</button>
    <button onclick={copy} disabled={!sentence}>{copied ? 'Copied' : 'Copy'}</button>
  </div>
</section>

<style>
  .banner {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .sentence {
    margin: 0;
    font-size: clamp(1.4rem, 3.5vw, 2rem);
    font-weight: 600;
    line-height: 1.3;
    text-wrap: balance;
  }

  .placeholder {
    color: var(--muted);
    font-weight: 400;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
</style>
