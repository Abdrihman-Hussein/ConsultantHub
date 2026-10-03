import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { consultants } from '../data/consultants'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
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
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState<Filters>({
    ...defaultFilters,
    specialization: searchParams.get('specialty') ?? '',
  })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

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

  return (
    <>
      <section className="border-b border-line bg-surface">
        <Container className="py-14">
          <p className="eyebrow mb-3">Directory</p>
          <h1 className="font-display text-display-lg text-ink-950">Browse consultants</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            {consultants.length} verified specialists across marketing, engineering, finance, and
            law.
          </p>
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
              <p className="text-sm text-muted">
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
              </Button>
            </div>

            {mobileFiltersOpen && (
              <div className="mt-6 rounded-2xl border border-line bg-surface p-6 lg:hidden">
                <FilterSidebar
                  filters={filters}
                  specializations={specializations}
                  onChange={setFilters}
                  onReset={() => setFilters(defaultFilters)}
                />
              </div>
            )}

            {results.length > 0 ? (
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {results.map((consultant) => (
                  <ConsultantCard key={consultant.id} consultant={consultant} />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-dashed border-line-strong bg-surface p-14 text-center">
                <h2 className="text-lg font-semibold tracking-tight text-ink-950">
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
            )}
          </div>
        </div>
      </Container>
    </>
  )
}
