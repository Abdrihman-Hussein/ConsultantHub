import type { Consultant } from '../types';

/**
 * Search and filter logic for the directory, kept out of the component so it
 * can be reasoned about (and tested) independently of React.
 */

export interface Filters {
  search: string;
  specialization: string;
  minRating: number;
  maxRate: number;
  verifiedOnly: boolean;
  sort: SortKey;
}

export type SortKey = 'recommended' | 'rating' | 'rate-low' | 'rate-high' | 'sessions';

export const sortLabels: Record<SortKey, string> = {
  recommended: 'Recommended',
  rating: 'Highest rated',
  'rate-low': 'Rate: low to high',
  'rate-high': 'Rate: high to low',
  sessions: 'Most sessions',
};

export const defaultFilters: Filters = {
  search: '',
  specialization: '',
  minRating: 0,
  maxRate: 300,
  verifiedOnly: false,
  sort: 'recommended',
};

/**
 * Recommended ordering: verified consultants first, then rating, then volume.
 * A stable proxy for editorial ranking that stays deterministic.
 */
function compareRecommended(a: Consultant, b: Consultant): number {
  if (a.verified !== b.verified) return a.verified ? -1 : 1;
  if (b.rating !== a.rating) return b.rating - a.rating;
  return b.sessions - a.sessions;
}

const comparators: Record<SortKey, (a: Consultant, b: Consultant) => number> = {
  recommended: compareRecommended,
  rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
  'rate-low': (a, b) => a.hourlyRate - b.hourlyRate,
  'rate-high': (a, b) => b.hourlyRate - a.hourlyRate,
  sessions: (a, b) => b.sessions - a.sessions,
};

/**
 * Every field a search term can match. Searching the bio and location means
 * "cloud" or "Berlin" find the right people, not just exact title matches.
 */
function searchableText(consultant: Consultant): string {
  return [
    consultant.name,
    consultant.title,
    consultant.specialization,
    consultant.bio,
    consultant.location,
    consultant.experience,
  ]
    .join(' ')
    .toLowerCase();
}

/**
 * All terms must appear somewhere, so extra words narrow results rather than
 * widening them. Returns a match score used to rank "recommended".
 */
function scoreMatch(consultant: Consultant, terms: string[]): number {
  const haystack = searchableText(consultant);
  let score = 0;

  for (const term of terms) {
    if (!haystack.includes(term)) return -1;

    // Exact name matches are almost always what the user meant.
    if (consultant.name.toLowerCase().includes(term)) score += 6;
    if (consultant.title.toLowerCase().includes(term)) score += 4;
    if (consultant.specialization.toLowerCase().includes(term)) score += 3;
    score += 1;
  }

  return score;
}

export interface SearchResult {
  consultant: Consultant;
  score: number;
}

export function searchConsultants(
  consultants: Consultant[],
  filters: Filters,
): SearchResult[] {
  const terms = filters.search
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const matches: SearchResult[] = [];

  for (const consultant of consultants) {
    if (filters.specialization && consultant.specialization !== filters.specialization) {
      continue;
    }
    if (filters.verifiedOnly && !consultant.verified) continue;
    if (consultant.rating < filters.minRating) continue;
    if (consultant.hourlyRate > filters.maxRate) continue;

    const score = terms.length > 0 ? scoreMatch(consultant, terms) : 0;
    if (score < 0) continue;

    matches.push({ consultant, score });
  }

  // Relevance first when searching, otherwise the chosen sort. Recommended
  // uses the search score as its primary key so a term match beats a default.
  matches.sort((a, b) => {
    if (filters.sort === 'recommended') {
      if (terms.length > 0 && b.score !== a.score) return b.score - a.score;
      return compareRecommended(a.consultant, b.consultant);
    }
    return comparators[filters.sort](a.consultant, b.consultant);
  });

  return matches;
}

/** Distinct values for a field, for populating filter controls. */
export function collectSpecializations(consultants: Consultant[]): string[] {
  return Array.from(new Set(consultants.map((c) => c.specialization))).sort();
}

export function countActiveFilters(filters: Filters): number {
  return (
    (filters.search.trim() ? 1 : 0) +
    (filters.specialization ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.maxRate < defaultFilters.maxRate ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0) +
    (filters.sort !== 'recommended' ? 1 : 0)
  );
}

/** Human-readable chips describing the filters in play, for the results bar. */
export function describeFilters(
  filters: Filters,
  specializations: string[],
): { key: string; label: string }[] {
  const chips: { key: string; label: string }[] = [];

  if (filters.search.trim()) chips.push({ key: 'search', label: `"${filters.search.trim()}"` });
  if (filters.specialization) {
    // Only label it if it is a real specialty rather than free text.
    const known = specializations.includes(filters.specialization);
    chips.push({
      key: 'specialization',
      label: known ? filters.specialization : `Specialty: ${filters.specialization}`,
    });
  }
  if (filters.minRating > 0) chips.push({ key: 'minRating', label: `${filters.minRating}+ rating` });
  if (filters.maxRate < defaultFilters.maxRate) {
    chips.push({ key: 'maxRate', label: `Under $${filters.maxRate}/hr` });
  }
  if (filters.verifiedOnly) chips.push({ key: 'verifiedOnly', label: 'Verified only' });

  return chips;
}
