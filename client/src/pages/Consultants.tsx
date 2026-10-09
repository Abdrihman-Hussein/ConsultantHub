import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { consultants } from '../data'
import { useApp } from '../context/AppContext'
import { countLabelLocalized, isMdUp } from '../lib/format'
import {
  countActiveFilters,
  defaultFilters,
  describeFilters,
  searchConsultants,
  sortLabelKeys,
} from '../lib/search'
import type { Filters } from '../lib/search'
import { useTranslation } from '../i18n/LanguageContext'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import Reveal from '../components/ui/Reveal'
import EmptyState from '../components/ui/EmptyState'
import ConsultantCard from '../components/consultants/ConsultantCard'
import FilterSidebar from '../components/consultants/FilterSidebar'
import SortSelect from '../components/consultants/SortSelect'

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
  const { t } = useTranslation()

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

  const mobileTriggerRef = useRef<HTMLButtonElement | null>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  /** Fallback focus target when the trigger is hidden (viewport ≥ md). */
  const headingRef = useRef<HTMLHeadingElement>(null)
  /** Tracks whether the sheet was open, so focus only returns on close. */
  const sheetWasOpen = useRef(false)

  /* Focus trap + Escape while the sheet is open. */
  useEffect(() => {
    if (!mobileFiltersOpen) return
    sheetWasOpen.current = true
    const sheet = sheetRef.current
    if (!sheet) return

    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    sheet.querySelector<HTMLElement>(focusableSelector)?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setMobileFiltersOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const items = Array.from(sheet.querySelectorAll<HTMLElement>(focusableSelector))
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const activeEl = document.activeElement as HTMLElement | null
      const insideSheet = activeEl !== null && sheet.contains(activeEl)
      const onAFocusable = activeEl !== null && items.includes(activeEl)

      // If focus is outside the sheet (e.g. a click on the overlay padding
      // made <body> active), or is inside but not on a focusable control
      // (e.g. the page heading the fallback below returns focus to, which
      // carries tabIndex={-1} and is therefore only programmatically
      // focusable), wrap unconditionally instead of letting Tab escape
      // into the page behind the dialog.
      if (!insideSheet || !onAFocusable) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
      } else if (event.shiftKey && activeEl === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && activeEl === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mobileFiltersOpen])

  /* Close the sheet when the viewport grows to `md` and up. Only fires on a
   * breakpoint crossing (scroll on a small screen does not trigger it). */
  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches && isMdUp(window.innerWidth)) setMobileFiltersOpen(false)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  /* Return focus to the trigger button when the sheet closes. The trigger is
   * md:hidden, so when the sheet was closed by the desktop-resize reset it is
   * display:none — focusing it would silently no-op and strand keyboard users
   * at <body>. Guard for visibility and fall back to the page heading. */
  useEffect(() => {
    if (!mobileFiltersOpen && sheetWasOpen.current) {
      sheetWasOpen.current = false
      const trigger = mobileTriggerRef.current
      if (trigger && trigger.offsetParent !== null) {
        trigger.focus()
      } else {
        headingRef.current?.focus()
      }
    }
  }, [mobileFiltersOpen])

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
            <p className="eyebrow mb-3">{t('directory.eyebrow')}</p>
            <h1 ref={headingRef} tabIndex={-1} className="font-display text-display-lg text-ink-950 focus:outline-none">
              {t('directory.title')}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              {/* Both figures are interpolated, never written in: they come from
                  the directory, and a literal here would be a figure that could
                  go stale without anything failing. */}
              {t('directory.description', {
                count: consultants.length,
                specialties: specialties.length,
              })}
            </p>
          </Reveal>
        </Container>
      </section>

      <Container className="py-10 lg:py-12">
        <div className="md:grid md:grid-cols-[264px_1fr] md:gap-12">
          <aside className="hidden md:block">
            <div className="sticky top-24">{filterPanel}</div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
              <p aria-live="polite" className="text-sm text-muted">
                <span className="font-medium text-body">
                  {countLabelLocalized(
                    results.length,
                    t,
                    'terms.consultant',
                    'terms.consultants',
                  )}
                </span>
                {results.length > 0 && (
                  <span className="text-subtle">
                    {/* Not lower-cased: the label is a whole clause in Somali and
                        in English, and neither reads right part-folded. */}
                    {t('directory.sorted_by', { label: t(sortLabelKeys[filters.sort]) })}
                  </span>
                )}
              </p>

              <div className="flex items-center gap-2">
                <SortSelect
                  value={filters.sort}
                  onChange={(key) => setFilters((current) => ({ ...current, sort: key }))}
                />

                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden"
                  onClick={(event) => {
                    mobileTriggerRef.current = event.currentTarget
                    setMobileFiltersOpen(true)
                  }}
                  aria-expanded={mobileFiltersOpen}
                >
                  {t('directory.filters')}
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
                    {/* `verifiedOnly` carries no value; its key has no
                        placeholder, so passing undefined is harmless. */}
                    {t(chip.labelKey, { value: chip.value ?? '' })}
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
                    {t('directory.clear_all')}
                  </button>
                )}
              </div>
            )}

            {/* Bottom sheet on small screens; inline sidebar above `md`. */}
            {mobileFiltersOpen && (
              <div className="fixed inset-0 z-50 md:hidden">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-ink-950/40 transition-opacity duration-300 ease-out motion-reduce:transition-none"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <div
                  ref={sheetRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label={t('directory.filters')}
                  className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-line bg-surface-subtle p-6 shadow-2xl"
                >
                  <div className="-mr-2 -mt-2 mb-2 flex justify-end">
                    <button
                      type="button"
                      aria-label={t('directory.close_filters')}
                      onClick={() => setMobileFiltersOpen(false)}
                      className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-ink-100 hover:text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/45"
                    >
                      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M5.5 5.5l9 9M14.5 5.5l-9 9" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                  <div aria-hidden="true" className="mx-auto mb-5 h-1 w-10 rounded-full bg-ink-200" />
                  <FilterSidebar
                    filters={filters}
                    specializations={specialties}
                    suggestions={suggestions}
                    onChange={setFilters}
                    onReset={() => setFilters(defaultFilters)}
                    idPrefix="sheet"
                  />
                  <Button className="mt-6 w-full" onClick={() => setMobileFiltersOpen(false)}>
                    {t('directory.show_results', {
                      count: countLabelLocalized(
                        results.length,
                        t,
                        'terms.consultant',
                        'terms.consultants',
                      ),
                    })}
                  </Button>
                </div>
              </div>
            )}

            {results.length > 0 ? (
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {results.map(({ consultant }, index) => (
                  <Reveal key={consultant.id} delay={Math.min(index, 6) * 70}>
                    <div className="flex h-full flex-col">
                      {/* Session volume sits on the card itself now that the
                          rating no longer carries a review count. */}
                      <div className="min-h-0 flex-1">
                        <ConsultantCard consultant={consultant} />
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="mt-8">
                <EmptyState
                  title={t('directory.empty_title')}
                  body={
                    activeCount > 1
                      ? t('directory.empty_body_many')
                      : t('directory.empty_body_one')
                  }
                  icon="search"
                  action={
                    <Button variant="outline" onClick={() => setFilters(defaultFilters)}>
                      {t('directory.reset_filters')}
                    </Button>
                  }
                />
              </div>
            )}

            {/* Surfaced so a demo does not imply bookings are enforced. */}
            <p className="mt-12 text-center text-xs text-subtle">
              {/* Count first, then the scope qualifier — Somali puts the
                  qualifier after the noun phrase, so the two are separate
                  fragments rather than one concatenated sentence. */}
              {countLabelLocalized(
                appointments.length,
                t,
                'terms.booking',
                'terms.bookings',
              )}{' '}
              {t('directory.bookings_note')} ·{' '}
              <Link to="/login" className="underline underline-offset-4 hover:text-muted">
                {t('directory.bookings_manage')}
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </>
  )
}
