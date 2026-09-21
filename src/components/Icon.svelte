<script lang="ts">
  import { ICONS, type IconName } from '../lib/icons';

  /** Decorative by default: every icon sits next to the label it illustrates. */
  let { name }: { name: IconName } = $props();
</script>

<svg
  class="icon"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
  focusable="false">{@html ICONS[name]}</svg
>

<style>
  .icon {
    width: 1.1em;
    height: 1.1em;
    flex: none;
  }
</style>
