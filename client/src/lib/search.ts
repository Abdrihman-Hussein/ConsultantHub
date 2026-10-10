import type { Consultant } from '../types';
import type { MessageKey } from '../i18n/strings';

/**
 * Search and filter logic for the directory, kept out of the component so it
 * can be reasoned about (and tested) independently of React.
 */

export interface Filters {
  search: string;
  specialization: string;
  maxRate: number;
  verifiedOnly: boolean;
  sort: SortKey;
}

/**
 * There is no `rating` sort and no minimum-rating filter.
 *
 * Both sorted or filtered over `Consultant.rating`, a seeded number that no
 * review in the app supported. Keeping the control would mean offering readers
 * a choice between ranking criteria that all return the same answer — with no
 * reviews yet, "highest rated" has nothing to rank on — which is worse than
 * not offering it. Both return when consultants have been reviewed by people
 * who booked them.
 */
export type SortKey = 'recommended' | 'rate-low' | 'rate-high' | 'sessions';

/** Render order of the sort control. */
export const sortKeys: SortKey[] = ['recommended', 'rate-low', 'rate-high', 'sessions'];

/**
 * Sort option labels, as dictionary keys rather than English strings.
 *
 * A specialty's own name (`consultant.specialization`) is seeded data and is
 * deliberately NOT translated — it is the same value used as the filter, so
 * translating the label while the value stayed English would make the control
 * unmatchable.
 */
export const sortLabelKeys: Record<SortKey, MessageKey> = {
  recommended: 'sort.recommended',
  'rate-low': 'sort.rate-low',
  'rate-high': 'sort.rate-high',
  sessions: 'sort.sessions',
};

export const defaultFilters: Filters = {
  search: '',
  specialization: '',
  maxRate: 300,
  verifiedOnly: false,
  sort: 'recommended',
};

/**
 * Recommended ordering: verified consultants first, then delivered sessions.
 *
 * A stable proxy for editorial ranking that stays deterministic, and — unlike
 * the rating version it replaces — built entirely from fields the record
 * actually publishes.
 */
function compareRecommended(a: Consultant, b: Consultant): number {
  if (a.verified !== b.verified) return a.verified ? -1 : 1;
  return b.sessions - a.sessions;
}

const comparators: Record<SortKey, (a: Consultant, b: Consultant) => number> = {
  recommended: compareRecommended,
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
    (filters.maxRate < defaultFilters.maxRate ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0) +
    (filters.sort !== 'recommended' ? 1 : 0)
  );
}

/**
 * Chips describing the filters in play, for the results bar.
 *
 * Each chip is a dictionary key plus its parameters, not a finished string, so
 * the surrounding words are translated while the values inside them — the
 * search text, the specialty, the rate — are rendered exactly as they are
 * stored. `value` is passed as a parameter rather than concatenated so a
 * value containing a placeholder-shaped substring cannot be misread.
 */
export function describeFilters(
  filters: Filters,
  specializations: string[],
): { key: string; labelKey: MessageKey; value?: string }[] {
  const chips: { key: string; labelKey: MessageKey; value?: string }[] = [];

  if (filters.search.trim()) {
    // The typed text, quoted — the quotes are the chip's own, not the value's.
    chips.push({ key: 'search', labelKey: 'chip.search', value: filters.search.trim() });
  }
  if (filters.specialization) {
    // Only label it if it is a real specialty rather than free text.
    const known = specializations.includes(filters.specialization);
    chips.push(
      known
        ? { key: 'specialization', labelKey: 'chip.specialty_value', value: filters.specialization }
        : { key: 'specialization', labelKey: 'chip.specialty', value: filters.specialization },
    );
  }
  if (filters.maxRate < defaultFilters.maxRate) {
    chips.push({ key: 'maxRate', labelKey: 'chip.max_rate', value: `$${filters.maxRate}` });
  }
  if (filters.verifiedOnly) chips.push({ key: 'verifiedOnly', labelKey: 'chip.verified_only' });

  return chips;
}
