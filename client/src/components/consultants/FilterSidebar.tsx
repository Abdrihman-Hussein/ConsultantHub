import Button from '../ui/Button'
import SearchInput from '../ui/SearchInput'
import type { Filters } from '../../lib/search'

interface FilterSidebarProps {
  filters: Filters
  specializations: string[]
  /** Names and specialties, offered as search suggestions. */
  suggestions: string[]
  onChange: (filters: Filters) => void
  onReset: () => void
  /** Prefix for control ids so inline and sheet copies never collide. */
  idPrefix?: string
}

const rateFloor = 50
const rateCeiling = 300
const ratingOptions = [0, 4, 4.5, 4.8]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="eyebrow mb-3">{title}</h3>
      {children}
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 text-sm text-body transition-colors hover:text-ink-950"
    >
      {label}
      <span
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? 'bg-accent-500' : 'bg-ink-200'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-spring ${
            checked ? 'translate-x-[18px]' : 'translate-x-0.5'
          }`}
        />
      </span>
    </button>
  )
}

export default function FilterSidebar({
  filters,
  specializations,
  suggestions,
  onChange,
  onReset,
  idPrefix = 'filter',
}: FilterSidebarProps) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold tracking-tight text-ink-950">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onReset} className="-mr-3 -ml-2">
          Reset
        </Button>
      </div>

      <SearchInput
        value={filters.search}
        onChange={(value) => set('search', value)}
        suggestions={suggestions}
        placeholder="Name, expertise, or city"
      />

      <Section title="Specialty">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => set('specialization', '')}
            aria-pressed={filters.specialization === ''}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-all duration-200 ease-out ${
              filters.specialization === ''
                ? 'border-accent-500 bg-accent-500 text-white shadow-glow'
                : 'border-line-strong text-muted hover:border-accent-400 hover:text-body'
            }`}
          >
            All
          </button>
          {specializations.map((specialization) => (
            <button
              key={specialization}
              type="button"
              onClick={() => set('specialization', specialization)}
              aria-pressed={filters.specialization === specialization}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-all duration-200 ease-out ${
                filters.specialization === specialization
                  ? 'border-accent-500 bg-accent-500 text-white shadow-glow'
                  : 'border-line-strong text-muted hover:border-accent-400 hover:text-body'
              }`}
            >
              {specialization}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Minimum rating">
        <div className="flex flex-wrap gap-2">
          {ratingOptions.map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => set('minRating', rating)}
              aria-pressed={filters.minRating === rating}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-all duration-200 ease-out ${
                filters.minRating === rating
                  ? 'border-accent-500 bg-accent-500 text-white shadow-glow'
                  : 'border-line-strong text-muted hover:border-accent-400 hover:text-body'
              }`}
            >
              {rating === 0 ? 'Any' : `${rating}+`}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Max hourly rate">
        <div className="mb-2 flex items-baseline justify-between">
          <label htmlFor={`${idPrefix}-rate`} className="text-sm text-muted">
            Up to
          </label>
          <span className="text-sm font-medium text-body">
            {filters.maxRate >= rateCeiling ? `$${rateCeiling}+` : `$${filters.maxRate}`}
          </span>
        </div>
        <input
          id={`${idPrefix}-rate`}
          type="range"
          min={rateFloor}
          max={rateCeiling}
          step={10}
          value={filters.maxRate}
          onChange={(event) => set('maxRate', Number(event.target.value))}
          aria-valuetext={`Up to $${filters.maxRate} per hour`}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-200"
        />
        <div className="mt-1 flex justify-between text-xs text-subtle">
          <span>${rateFloor}</span>
          <span>${rateCeiling}+</span>
        </div>
      </Section>

      <div className="border-t border-line pt-5">
        <Toggle
          checked={filters.verifiedOnly}
          onChange={(checked) => set('verifiedOnly', checked)}
          label="Verified only"
        />
      </div>

      {/* No sort control here. It used to sit at the foot of this panel, which
          meant desktop browse rendered two live selects bound to the same
          `filters.sort` state and the mobile sheet rendered a third — two
          controls that always agree and can never disagree is a defect, not a
          feature. Sorting is a property of the result set, so it lives once in
          the results bar (`SortSelect`). `idPrefix` stays: the rate slider and
          search field below still need unique ids between the inline panel and
          the sheet copy. */}
    </div>
  )
}
