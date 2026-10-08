import type { SortKey } from '../../lib/search'
import { sortLabels } from '../../lib/search'

interface SortSelectProps {
  value: SortKey
  onChange: (key: SortKey) => void
  /**
   * Override the `<label>`/`select` id pairing. The default is unique because
   * this control is the only sort UI on the page — the sidebar's copy was
   * removed rather than id-suffixed, since two bound selects cannot disagree.
   */
  id?: string
}

/** Labelled sort control fed straight from `sortLabels`, so new keys just work. */
export default function SortSelect({ value, onChange, id = 'sort-results' }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm text-muted">
        Sort by
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as SortKey)}
        className="cursor-pointer rounded-full border border-line-strong bg-surface px-3.5 py-2 text-xs text-body transition-colors hover:border-accent-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
      >
        {Object.entries(sortLabels).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
