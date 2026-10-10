import { useTranslation } from '../../i18n/LanguageContext'
import { languages } from '../../i18n/strings'
import type { Lang, MessageKey } from '../../i18n/strings'

/** Short, native labels. The accessible name of each option is its full name. */
const LABELS: Record<Lang, string> = { en: 'EN', so: 'SO' }

const NAMES: Record<Lang, MessageKey> = {
  en: 'lang.to_english',
  so: 'lang.to_somali',
}

/**
 * Language switch, styled as a segmented control rather than a button.
 *
 * A two-state toggle is the honest shape for two languages: both options stay
 * visible and the current one is marked, so switching back needs no memory of
 * what the control used to say. It mirrors the `SortSelect` pill — the same
 * `rounded-full border border-line-strong` on a light surface — so it reads as
 * part of the nav rather than a widget dropped onto it.
 *
 * Built on `aria-pressed` inside a labelled group rather than a `switch`, which
 * would imply an on/off state for what is actually a choice between two named
 * options. Each option also carries its own `lang`, so a screen reader
 * pronounces "EN" in English and "SO" in Somali rather than guessing.
 *
 * Deliberately light-surface only: `onInk` variants are wrong here and would
 * fail contrast on cream.
 */
export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { t, lang, setLang } = useTranslation()

  return (
    <div
      role="group"
      aria-label={t('lang.label')}
      className={`inline-flex items-center rounded-full border border-line-strong p-0.5 ${className}`}
    >
      {languages.map((option) => {
        const active = option === lang
        return (
          <button
            key={option}
            type="button"
            onClick={() => setLang(option)}
            aria-pressed={active}
            // Pronounced in its own language rather than read with the page's.
            lang={option}
            aria-label={t(NAMES[option])}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-200 ${
              active
                ? 'bg-accent-500 text-white'
                : 'text-muted hover:bg-ink-100 hover:text-body'
            }`}
          >
            {LABELS[option]}
          </button>
        )
      })}
    </div>
  )
}