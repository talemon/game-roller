/**
 * Turns a Steam tag name into a sentence fragment. Words that look like ordinary
 * capitalised words (`Turn-Based`) are lowercased; acronyms and oddities
 * (`RPG`, `4X`, `2D`, `eSports`, `'Em`) are left alone. `overrides` wins outright.
 */
export function tagPhrase(name: string, overrides: Readonly<Record<string, string>>): string {
  const override = overrides[name];
  if (override !== undefined) return override;
  return name
    .split(' ')
    .map((word) => (/^[A-Z][a-z]/.test(word) ? word.toLowerCase() : word))
    .join(' ');
}
