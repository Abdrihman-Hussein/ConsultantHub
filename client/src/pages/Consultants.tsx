import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { consultants } from '../data/consultants'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import ConsultantCard from '../components/consultants/ConsultantCard'
import FilterSidebar, { type Filters } from '../components/consultants/FilterSidebar'

const defaultFilters: Filters = {
  search: '',
  specialization: '',
  minRating: 0,
  maxRate: 300,
  verifiedOnly: false,
}

const specializations = Array.from(new Set(consultants.map((c) => c.specialization))).sort()

export default function Consultants() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState<Filters>(() => ({
    ...defaultFilters,
    specialization: searchParams.get('specialty') ?? '',
  }))
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  /*
   * Mirrors the specialty filter into the URL so the view can be shared. Writes
   * in both directions: clearing the filter drops the param rather than leaving
   * a stale one behind.
   */
  useEffect(() => {
    const current = searchParams.get('specialty') ?? ''
    if (current === filters.specialization) return

    const next = new URLSearchParams(searchParams)
    if (filters.specialization) next.set('specialty', filters.specialization)
    else next.delete('specialty')

    setSearchParams(next, { replace: true })
  }, [filters.specialization, searchParams, setSearchParams])

  const results = useMemo(() => {
    const query = filters.search.trim().toLowerCase()

    return consultants.filter((consultant) => {
      if (filters.specialization && consultant.specialization !== filters.specialization) {
        return false
      }
      if (filters.verifiedOnly && !consultant.verified) return false
      if (consultant.rating < filters.minRating) return false
      if (consultant.hourlyRate > filters.maxRate) return false
      if (
        query &&
        !consultant.name.toLowerCase().includes(query) &&
        !consultant.title.toLowerCase().includes(query) &&
        !consultant.bio.toLowerCase().includes(query)
      ) {
        return false
      }
      return true
    })
  }, [filters])

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    (filters.specialization ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.maxRate < defaultFilters.maxRate ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0)

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
              {consultants.length} verified specialists across marketing, engineering, finance, and
              law.
            </p>
          </Reveal>
        </Container>
      </section>

      <Container className="py-12">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                specializations={specializations}
                onChange={setFilters}
                onReset={() => setFilters(defaultFilters)}
              />
            </div>
          </aside>

          <div>
            <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
              <p aria-live="polite" className="text-sm text-muted">
                <span className="font-medium text-body">{results.length}</span>{' '}
                {results.length === 1 ? 'consultant' : 'consultants'}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setMobileFiltersOpen((prev) => !prev)}
              >
                {mobileFiltersOpen ? 'Hide filters' : 'Filters'}
                {activeFilterCount > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent-500 px-1.5 text-xs text-white">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Height animates so the panel does not snap the grid around. */}
            <div
              className={`grid overflow-hidden transition-all duration-500 ease-out lg:hidden ${
                mobileFiltersOpen ? 'mt-6 max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="rounded-2xl border border-line bg-surface p-6">
                <FilterSidebar
                  filters={filters}
                  specializations={specializations}
                  onChange={setFilters}
                  onReset={() => setFilters(defaultFilters)}
                />
              </div>
            </div>

            {results.length > 0 ? (
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {results.map((consultant, index) => (
                  <Reveal key={consultant.id} delay={index * 70}>
                    <div className="h-full">
                      <ConsultantCard consultant={consultant} />
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <Reveal>
                <div className="mt-8 rounded-2xl border border-dashed border-line-strong bg-surface p-14 text-center">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent-50 text-accent-500">
                    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="9" cy="9" r="5.5" />
                      <path d="M13 13l4 4" strokeLinecap="round" />
                    </svg>
                  </span>
                  <h2 className="mt-5 text-lg font-semibold tracking-tight text-ink-950">
                    No consultants match those filters
                  </h2>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
                    Try widening your rate range or clearing the specialty filter.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-6"
                    onClick={() => setFilters(defaultFilters)}
                  >
                    Reset filters
                  </Button>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </Container>
    </>
  )
}
