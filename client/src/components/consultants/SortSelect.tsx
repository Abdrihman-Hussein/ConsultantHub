import type { SortKey } from '../../lib/search'
import { sortKeys, sortLabelKeys } from '../../lib/search'
import { useTranslation } from '../../i18n/LanguageContext'

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

/**
 * Labelled sort control fed straight from the sort-key list, so new keys just
 * work once `sortLabelKeys` has an entry for them.
 */
export default function SortSelect({ value, onChange, id = 'sort-results' }: SortSelectProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm text-muted">
        {t('sort.label')}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as SortKey)}
        className="cursor-pointer rounded-full border border-line-strong bg-surface px-3.5 py-2 text-xs text-body transition-colors hover:border-accent-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
      >
        {sortKeys.map((key) => (
          <option key={key} value={key}>
            {t(sortLabelKeys[key])}
          </option>
        ))}
      </select>
    </div>
  )
}