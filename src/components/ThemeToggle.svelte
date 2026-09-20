<script lang="ts">
  import { theme, type ThemePreference } from '../lib/theme.svelte';

  const OPTIONS: { value: ThemePreference; label: string }[] = [
    { value: 'system', label: 'System' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];
</script>

<fieldset class="toggle">
  <legend class="visually-hidden">Theme</legend>
  {#each OPTIONS as option (option.value)}
    <label class="option" class:active={theme.preference === option.value}>
      <input
        type="radio"
        name="theme"
        value={option.value}
        checked={theme.preference === option.value}
        onchange={() => theme.set(option.value)}
        class="visually-hidden"
      />
      {option.label}
    </label>
  {/each}
</fieldset>

<style>
  .toggle {
    display: inline-flex;
    margin: 0;
    padding: 0.2rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--surface);
    gap: 0.15rem;
  }

  .option {
    padding: 0.3rem 0.8rem;
    min-height: 2rem;
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    font-size: 0.85rem;
    color: var(--muted);
    cursor: pointer;
    user-select: none;
    transition:
      background 0.15s,
      color 0.15s;
  }

  .option:hover {
    color: var(--text);
  }

  .option.active {
    background: var(--chip);
    color: var(--text);
    font-weight: 600;
  }

  .option:has(input:focus-visible) {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  @media (pointer: coarse) {
    .option {
      min-height: 2.5rem;
    }
  }
</style>
