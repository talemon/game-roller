export type PlotSource = 'booker' | 'tobias';

export interface MasterPlot {
  id: string;
  title: string;
  /** Fragment used after "about". */
  phrase: string;
  description: string;
  sources: PlotSource[];
}

/**
 * Christopher Booker, *The Seven Basic Plots* (2004), and
 * Ronald B. Tobias, *20 Master Plots* (1993). "The Quest" appears in both.
 */
export const masterPlots: readonly MasterPlot[] = [
  // Booker
  {
    id: 'overcoming-the-monster',
    title: 'Overcoming the Monster',
    phrase: 'overcoming the monster',
    description: 'The hero must confront and destroy a threatening evil force.',
    sources: ['booker'],
  },
  {
    id: 'rags-to-riches',
    title: 'Rags to Riches',
    phrase: 'rags to riches',
    description:
      'An overlooked protagonist gains wealth, power or love, loses it, and earns it back on their own merit.',
    sources: ['booker'],
  },
  {
    id: 'quest',
    title: 'The Quest',
    phrase: 'a quest',
    description:
      'The hero and companions journey toward a vital goal, overcoming obstacles along the way.',
    sources: ['booker', 'tobias'],
  },
  {
    id: 'voyage-and-return',
    title: 'Voyage and Return',
    phrase: 'a voyage and return',
    description: 'The hero travels to a strange world, faces its dangers, and returns home changed.',
    sources: ['booker'],
  },
  {
    id: 'comedy',
    title: 'Comedy',
    phrase: 'comedy',
    description:
      'Confusion and misunderstanding escalate until everything is revealed and resolved in a happy union.',
    sources: ['booker'],
  },
  {
    id: 'tragedy',
    title: 'Tragedy',
    phrase: 'tragedy',
    description: "A protagonist's flaw or fatal decision drags them step by step to ruin.",
    sources: ['booker'],
  },
  {
    id: 'rebirth',
    title: 'Rebirth',
    phrase: 'rebirth',
    description: 'A character falls under a dark shadow and is redeemed, often through someone else.',
    sources: ['booker'],
  },
  // Tobias
  {
    id: 'adventure',
    title: 'Adventure',
    phrase: 'adventure',
    description: "A journey where the events of the trip matter more than the hero's inner change.",
    sources: ['tobias'],
  },
  {
    id: 'pursuit',
    title: 'Pursuit',
    phrase: 'pursuit',
    description: 'A chase: one party hunts another, and the gap keeps closing.',
    sources: ['tobias'],
  },
  {
    id: 'rescue',
    title: 'Rescue',
    phrase: 'a rescue',
    description: "The protagonist must free a victim from an antagonist's grasp.",
    sources: ['tobias'],
  },
  {
    id: 'escape',
    title: 'Escape',
    phrase: 'an escape',
    description: 'Held captive, the protagonist must break free against the odds.',
    sources: ['tobias'],
  },
  {
    id: 'revenge',
    title: 'Revenge',
    phrase: 'revenge',
    description: 'Retaliation for a real or imagined wrong, at growing cost.',
    sources: ['tobias'],
  },
  {
    id: 'riddle',
    title: 'The Riddle',
    phrase: 'a riddle',
    description: 'A mystery whose solution has been hidden in plain sight.',
    sources: ['tobias'],
  },
  {
    id: 'rivalry',
    title: 'Rivalry',
    phrase: 'rivalry',
    description: 'Two roughly equal forces compete for the same goal.',
    sources: ['tobias'],
  },
  {
    id: 'underdog',
    title: 'Underdog',
    phrase: 'an underdog',
    description: 'A protagonist badly overmatched by an opponent overcomes the odds.',
    sources: ['tobias'],
  },
  {
    id: 'temptation',
    title: 'Temptation',
    phrase: 'temptation',
    description:
      'The protagonist is lured to act against their better judgment, and consequences follow.',
    sources: ['tobias'],
  },
  {
    id: 'metamorphosis',
    title: 'Metamorphosis',
    phrase: 'metamorphosis',
    description: 'A physical transformation, usually a curse, that only love can undo.',
    sources: ['tobias'],
  },
  {
    id: 'transformation',
    title: 'Transformation',
    phrase: 'transformation',
    description: 'An inner change in the protagonist triggered by a life event.',
    sources: ['tobias'],
  },
  {
    id: 'maturation',
    title: 'Maturation',
    phrase: 'maturation',
    description: 'Coming of age: growing from naivety into adulthood through a hard lesson.',
    sources: ['tobias'],
  },
  {
    id: 'love',
    title: 'Love',
    phrase: 'love',
    description: 'Lovers must overcome the obstacles keeping them apart.',
    sources: ['tobias'],
  },
  {
    id: 'forbidden-love',
    title: 'Forbidden Love',
    phrase: 'forbidden love',
    description: 'A love that breaks social convention, and rarely ends well.',
    sources: ['tobias'],
  },
  {
    id: 'sacrifice',
    title: 'Sacrifice',
    phrase: 'sacrifice',
    description: 'The protagonist gives up something vital for a higher ideal.',
    sources: ['tobias'],
  },
  {
    id: 'discovery',
    title: 'Discovery',
    phrase: 'discovery',
    description: 'A character learns something fundamental about themselves or the world.',
    sources: ['tobias'],
  },
  {
    id: 'wretched-excess',
    title: 'Wretched Excess',
    phrase: 'wretched excess',
    description: "A character's decline driven by a flaw, obsession or addiction.",
    sources: ['tobias'],
  },
  {
    id: 'ascension',
    title: 'Ascension',
    phrase: 'ascension',
    description: 'The rise of a character, often at a moral price.',
    sources: ['tobias'],
  },
  {
    id: 'descension',
    title: 'Descension',
    phrase: 'descension',
    description: 'The fall of a character from grace.',
    sources: ['tobias'],
  },
];
