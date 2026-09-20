import { genreFacet } from './genre';
import { playersFacet } from './players';
import { plotFacet } from './plot';
import { themeFacet } from './theme';
import type { Facet } from './types';
import { viewpointFacet } from './viewpoint';

/**
 * Every rollable facet, in sentence order: `prefix` facets are emitted left to right
 * (`A first-person co-op action game …`), then `about`, then `trailing` clauses.
 * To add a facet: export a `Facet` from a new file in this directory and list it here.
 */
export const facets: readonly Facet[] = [
  viewpointFacet,
  playersFacet,
  genreFacet,
  plotFacet,
  themeFacet,
];
