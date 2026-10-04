import Button from '../ui/Button'

export interface Filters {
  search: string
  specialization: string
  minRating: number
  maxRate: number
  verifiedOnly: boolean
}

interface FilterSidebarProps {
  filters: Filters
  specializations: string[]
  onChange: (filters: Filters) => void
  onReset: () => void
}

const rateCeiling = 300

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
      className="flex w-full items-center justify-between gap-3 text-sm text-body"
    >
      {label}
      <span
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? 'bg-accent-500' : 'bg-ink-200'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
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
  onChange,
  onReset,
}: FilterSidebarProps) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value })

  return (
    <div className="space-y-7">
      <div>
        <h2 className="eyebrow mb-4">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onReset} className="-ml-3">
          Reset all
        </Button>
      </div>

      <div>
        <label htmlFor="filter-search" className="mb-2 block text-sm font-medium text-body">
          Search
        </label>
        <input
          id="filter-search"
          type="search"
          value={filters.search}
          onChange={(event) => set('search', event.target.value)}
          placeholder="Name or expertise"
          className="w-full cursor-text rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-sm placeholder:text-subtle transition-all duration-200 hover:border-ink-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
        />
      </div>

      <div>
        <label htmlFor="filter-specialization" className="mb-2 block text-sm font-medium text-body">
          Specialization
        </label>
        <select
          id="filter-specialization"
          value={filters.specialization}
          onChange={(event) => set('specialization', event.target.value)}
          className="w-full cursor-pointer rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-sm transition-all duration-200 hover:border-ink-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
        >
          <option value="">All specialties</option>
          {specializations.map((specialization) => (
            <option key={specialization} value={specialization}>
              {specialization}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label htmlFor="filter-rate" className="text-sm font-medium text-body">
            Max hourly rate
          </label>
          <span className="text-sm text-muted">${filters.maxRate}</span>
        </div>
        <input
          id="filter-rate"
          type="range"
          min={50}
          max={rateCeiling}
          step={10}
          value={filters.maxRate}
          onChange={(event) => set('maxRate', Number(event.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-200 accent-accent-500"
        />
        <div className="mt-1 flex justify-between text-xs text-subtle">
          <span>$50</span>
          <span>${rateCeiling}+</span>
        </div>
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium text-body">Minimum rating</span>
        <div className="flex flex-wrap gap-2">
          {[0, 4, 4.5, 4.8].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => set('minRating', rating)}
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
      </div>

      <div className="border-t border-line pt-6">
        <Toggle
          checked={filters.verifiedOnly}
          onChange={(checked) => set('verifiedOnly', checked)}
          label="Verified only"
        />
      </div>
    </div>
  )
}
