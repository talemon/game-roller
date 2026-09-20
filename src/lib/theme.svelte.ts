export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'game-roller:theme';
const PREFERENCES: readonly ThemePreference[] = ['system', 'light', 'dark'];

function readStored(): ThemePreference {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    return PREFERENCES.includes(raw as ThemePreference) ? (raw as ThemePreference) : 'system';
  } catch {
    return 'system';
  }
}

const systemDark = matchMedia('(prefers-color-scheme: dark)');

/**
 * Theme preference with persistence. `index.html` applies the same rule inline before
 * first paint so the page never flashes the wrong scheme; this module keeps it in sync.
 */
class ThemeStore {
  preference = $state<ThemePreference>(readStored());
  #systemDark = $state(systemDark.matches);

  readonly resolved: ResolvedTheme = $derived(
    this.preference === 'system' ? (this.#systemDark ? 'dark' : 'light') : this.preference,
  );

  constructor() {
    systemDark.addEventListener('change', (e) => (this.#systemDark = e.matches));
    $effect.root(() => {
      $effect(() => {
        document.documentElement.dataset.theme = this.resolved;
      });
    });
  }

  set(preference: ThemePreference) {
    this.preference = preference;
    try {
      if (preference === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      // Storage unavailable (private mode, blocked): the choice still applies for this session.
    }
  }
}

export const theme = new ThemeStore();
