import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { consultants } from '../data'
import { useApp } from '../context/AppContext'
import {
  countActiveFilters,
  defaultFilters,
  describeFilters,
  searchConsultants,
  sortLabels,
} from '../lib/search'
import type { Filters } from '../lib/search'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import EmptyState from '../components/ui/EmptyState'
import ConsultantCard from '../components/consultants/ConsultantCard'
import FilterSidebar from '../components/consultants/FilterSidebar'

const specialties = Array.from(new Set(consultants.map((c) => c.specialization))).sort()

/** Names and specialties, offered as search suggestions. */
const suggestions = Array.from(
  new Set([
    ...consultants.map((consultant) => consultant.name),
    ...consultants.map((consultant) => consultant.specialization),
    ...consultants.map((consultant) => consultant.location.split(',')[0]),
  ]),
).sort()

export default function Consultants() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { appointments } = useApp()

  const [filters, setFilters] = useState<Filters>(() => {
    const specialty = searchParams.get('specialty') ?? ''
    const query = searchParams.get('q') ?? ''
    return {
      ...defaultFilters,
      specialization: specialties.includes(specialty) ? specialty : '',
      search: query,
    }
  })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  /*
   * Mirrors the filters into the URL so a view can be shared or bookmarked.
   * Runs both ways, so clearing a filter drops its param rather than leaving a
   * stale value that re-applies on reload.
   */
  useEffect(() => {
    const next = new URLSearchParams()
    if (filters.search.trim()) next.set('q', filters.search.trim())
    if (filters.specialization) next.set('specialty', filters.specialization)

    const current = searchParams.toString()
    if (current === next.toString()) return

    setSearchParams(next, { replace: true })
  }, [filters.search, filters.specialization, searchParams, setSearchParams])

  const results = useMemo(() => searchConsultants(consultants, filters), [filters])

  const activeCount = countActiveFilters(filters)
  const chips = describeFilters(filters, specialties)

  /** Removes one filter, leaving the rest intact. */
  const clearFilter = (key: string) => {
    setFilters((current) => {
      const next = { ...current }
      if (key === 'search') next.search = ''
      if (key === 'specialization') next.specialization = ''
      if (key === 'minRating') next.minRating = 0
      if (key === 'maxRate') next.maxRate = defaultFilters.maxRate
      if (key === 'verifiedOnly') next.verifiedOnly = false
      return next
    })
  }

  const filterPanel = (
    <FilterSidebar
      filters={filters}
      specializations={specialties}
      suggestions={suggestions}
      onChange={setFilters}
      onReset={() => setFilters(defaultFilters)}
    />
  )

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-surface">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-accent-100/40 blur-3xl"
        />
        <Container className="relative py-14">
          <Reveal>
            <p className="eyebrow mb-3">Directory</p>
            <h1 className="font-display text-display-lg text-ink-950">Browse consultants</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              {consultants.length} consultants across {specialties.length} specialties. Search by
              name, expertise, or city.
            </p>
          </Reveal>
        </Container>
      </section>

      <Container className="py-10 lg:py-12">
        <div className="lg:grid lg:grid-cols-[264px_1fr] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-24">{filterPanel}</div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
              <p aria-live="polite" className="text-sm text-muted">
                <span className="font-medium text-body">{results.length}</span>{' '}
                {results.length === 1 ? 'result' : 'results'}
                {results.length > 0 && (
                  <span className="text-subtle"> · sorted by {sortLabels[filters.sort].toLowerCase()}</span>
                )}
              </p>

              <div className="flex items-center gap-2">
                {/* Compact sort control for small screens. */}
                <label htmlFor="sort-compact" className="sr-only">
                  Sort results
                </label>
                <select
                  id="sort-compact"
                  value={filters.sort}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, sort: event.target.value as Filters['sort'] }))
                  }
                  className="cursor-pointer rounded-full border border-line-strong bg-surface px-3.5 py-2 text-xs text-body transition-colors hover:border-accent-400 lg:hidden"
                >
                  {Object.entries(sortLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setMobileFiltersOpen((prev) => !prev)}
                  aria-expanded={mobileFiltersOpen}
                >
                  Filters
                  {activeCount > 0 && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent-500 px-1.5 text-xs text-white">
                      {activeCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Removable chips describing what is currently filtered. */}
            {chips.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {chips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={() => clearFilter(chip.key)}
                    className="group inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1.5 text-xs text-accent-800 transition-colors hover:bg-accent-100"
                  >
                    {chip.label}
                    <svg
                      viewBox="0 0 20 20"
                      className="h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M5.5 5.5l9 9M14.5 5.5l-9 9" strokeLinecap="round" />
                    </svg>
                  </button>
                ))}
                {activeCount > 1 && (
                  <button
                    type="button"
                    onClick={() => setFilters(defaultFilters)}
                    className="px-2 text-xs text-muted underline underline-offset-4 hover:text-ink-950"
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}

            {/* Height animates so the panel does not snap the grid around. */}
            <div
              className={`grid overflow-hidden transition-all duration-500 ease-out lg:hidden ${
                mobileFiltersOpen ? 'mt-6 max-h-[2400px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="rounded-2xl border border-line bg-surface p-6">{filterPanel}</div>
            </div>

            {results.length > 0 ? (
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {results.map(({ consultant }, index) => (
                  <Reveal key={consultant.id} delay={Math.min(index, 6) * 70}>
                    <div className="h-full">
                      <ConsultantCard consultant={consultant} />
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="mt-8">
                <EmptyState
                  title="No consultants match those filters"
                  body={
                    activeCount > 1
                      ? 'Try removing a filter or two — combining several narrows results quickly.'
                      : 'Try a different search term or specialty.'
                  }
                  icon="search"
                  action={
                    <Button variant="outline" onClick={() => setFilters(defaultFilters)}>
                      Reset filters
                    </Button>
                  }
                />
              </div>
            )}

            {/* Surfaced so a demo does not imply bookings are enforced. */}
            <p className="mt-12 text-center text-xs text-subtle">
              {appointments.length} booking{appointments.length === 1 ? '' : 's'} in this browser ·{' '}
              <Link to="/login" className="underline underline-offset-4 hover:text-muted">
                log in to manage yours
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </>
  )
}
