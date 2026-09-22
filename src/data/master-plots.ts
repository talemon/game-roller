export interface MasterPlot {
  id: string;
  title: string;
  /** Fragment used after "about". */
  phrase: string;
  description: string;
  /** Plots naming the same dramatic engine; at most one per family is rolled. */
  family?: string;
}

/**
 * This project's own taxonomy of master plots, written for video games rather than novels.
 * Each one is a premise a player can be *put inside* — a situation with a verb, a pressure and
 * a stake — not a shape a story takes when read from outside. That is the whole selection rule:
 * if it cannot be played, it is not here.
 */
export const masterPlots: readonly MasterPlot[] = [
  {
    id: 'survival',
    title: 'Survival',
    phrase: 'survival',
    description: 'The world is trying to kill you slowly. Every resource spent buys one more day.',
  },
  {
    id: 'escape',
    title: 'Escape',
    phrase: 'an escape',
    description: 'Something holds you. Getting out is the entire problem.',
    family: 'chase',
  },
  {
    id: 'the-hunt',
    title: 'The Hunt',
    phrase: 'a hunt',
    description: 'Predator and prey, and the distance between them closing.',
    family: 'chase',
  },
  {
    id: 'infiltration',
    title: 'Infiltration',
    phrase: 'an infiltration',
    description: 'Being somewhere you do not belong, for as long as nobody looks twice.',
  },
  {
    id: 'heist',
    title: 'The Heist',
    phrase: 'a heist',
    description: 'A plan, a crew and a prize — and every step has to land in order.',
  },
  {
    id: 'rescue',
    title: 'Rescue',
    phrase: 'a rescue',
    description: 'Someone is out of reach. Reaching them costs more than it should.',
  },
  {
    id: 'last-stand',
    title: 'Last Stand',
    phrase: 'a last stand',
    description: 'A place worth holding, a force that will take it, and the time in between.',
  },
  {
    id: 'uprising',
    title: 'Uprising',
    phrase: 'an uprising',
    description: 'A power owns this world. Breaking it starts small and never stays small.',
  },
  {
    id: 'expedition',
    title: 'Expedition',
    phrase: 'an expedition',
    description: 'A blank map, a long way out, and no guarantee the way back still exists.',
    family: 'journey',
  },
  {
    id: 'descent',
    title: 'The Descent',
    phrase: 'a descent',
    description: 'Deeper is the only direction. Each level further from air, light and help.',
    family: 'journey',
  },
  {
    id: 'homecoming',
    title: 'Homecoming',
    phrase: 'a homecoming',
    description: 'Return to the place you left and find that one of you has changed.',
    family: 'journey',
  },
  {
    id: 'aftermath',
    title: 'Aftermath',
    phrase: 'the aftermath',
    description: 'The catastrophe already happened. This is about what gets built on top of it.',
    family: 'making',
  },
  {
    id: 'settlement',
    title: 'Settlement',
    phrase: 'building something lasting',
    description: 'Turning an empty place into somewhere people stay, against weather and time.',
    family: 'making',
  },
  {
    id: 'investigation',
    title: 'Investigation',
    phrase: 'an investigation',
    description: 'The truth exists in fragments, and the order you find them in changes it.',
    family: 'truth',
  },
  {
    id: 'conspiracy',
    title: 'Conspiracy',
    phrase: 'a conspiracy',
    description: 'The world is lying about itself, and noticing makes you a target.',
    family: 'truth',
  },
  {
    id: 'first-contact',
    title: 'First Contact',
    phrase: 'first contact',
    description: 'Something genuinely other is on the far side, and neither side has a word yet.',
  },
  {
    id: 'the-loop',
    title: 'The Loop',
    phrase: 'a loop that will not end',
    description: 'The same span of time, again. Knowledge is the only thing that carries over.',
  },
  {
    id: 'the-bargain',
    title: 'The Bargain',
    phrase: 'a bargain',
    description: 'Power is offered on terms. The terms are not clear until the power is spent.',
    family: 'ruin',
  },
  {
    id: 'downfall',
    title: 'Downfall',
    phrase: 'a downfall',
    description: 'A slide that could have been stopped three decisions ago.',
    family: 'ruin',
  },
  {
    id: 'rise-to-power',
    title: 'Rise to Power',
    phrase: 'a rise to power',
    description: 'Climbing works. The question is who is still standing below you.',
  },
  {
    id: 'rivalry',
    title: 'Rivalry',
    phrase: 'a rivalry',
    description: 'An equal wants exactly what you want, and only one of you gets it.',
    family: 'contest',
  },
  {
    id: 'underdog',
    title: 'The Underdog',
    phrase: 'an underdog',
    description: 'Outmatched on paper, and the paper is mostly right.',
    family: 'contest',
  },
  {
    id: 'mastery',
    title: 'Mastery',
    phrase: 'mastery',
    description: 'A craft that punishes you until it does not. The change is in your hands.',
    family: 'becoming',
  },
  {
    id: 'transformation',
    title: 'Transformation',
    phrase: 'a transformation',
    description: 'Becoming something else — by choice, by infection, or by degrees.',
    family: 'becoming',
  },
  {
    id: 'the-bond',
    title: 'The Bond',
    phrase: 'a bond',
    description: 'Two of you cross this together. The relationship is the mechanic.',
    family: 'ties',
  },
  {
    id: 'betrayal',
    title: 'Betrayal',
    phrase: 'a betrayal',
    description: 'Trust given, used and spent — by them, or by you.',
    family: 'ties',
  },
  {
    id: 'revenge',
    title: 'Revenge',
    phrase: 'revenge',
    description: 'A wrong gets answered. The answer keeps asking for more.',
    family: 'debt',
  },
  {
    id: 'redemption',
    title: 'Redemption',
    phrase: 'redemption',
    description: 'You did the harm. Everything now is payment on it.',
    family: 'debt',
  },
  {
    id: 'sacrifice',
    title: 'Sacrifice',
    phrase: 'sacrifice',
    description: 'Something vital has to be given up, and the game makes you pick it.',
  },
  {
    id: 'stewardship',
    title: 'Stewardship',
    phrase: 'stewardship',
    description: 'A place, a people or a thing is yours to keep alive. Neglect is the antagonist.',
  },
];
