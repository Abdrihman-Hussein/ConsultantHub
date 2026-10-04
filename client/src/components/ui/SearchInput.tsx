import { useEffect, useId, useRef, useState } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  /** Suggestions shown beneath the field, e.g. matching specialties. */
  suggestions?: string[]
  className?: string
}

/**
 * Search field with debouncing and inline suggestions.
 *
 * Typing is debounced so filtering does not run on every keystroke, and the
 * delay is skipped when the user presses Enter or blurs the field.
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search',
  label = 'Search consultants',
  suggestions = [],
  className = '',
}: SearchInputProps) {
  const [draft, setDraft] = useState(value)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputId = useId()

  // Keep in sync when the parent clears the field (e.g. "Reset all").
  useEffect(() => setDraft(value), [value])

  useEffect(() => {
    if (draft === value) return
    const timer = setTimeout(() => onChange(draft), 250)
    return () => clearTimeout(timer)
  }, [draft, value, onChange])

  // Close the suggestion list on outside click.
  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const matches = suggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(draft.trim().toLowerCase()),
  )

  const commit = (next: string) => {
    setDraft(next)
    onChange(next)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>

      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="9" cy="9" r="5.5" />
        <path d="M13 13l4 4" strokeLinecap="round" />
      </svg>

      <input
        id={inputId}
        type="search"
        role="combobox"
        aria-expanded={open && matches.length > 0}
        aria-autocomplete="list"
        aria-controls={`${inputId}-listbox`}
        value={draft}
        placeholder={placeholder}
        onChange={(event) => {
          setDraft(event.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          // Commit immediately rather than making the user wait out the debounce.
          if (event.key === 'Enter') {
            event.preventDefault()
            commit(draft)
          }
        }}
        className="w-full cursor-text rounded-xl border border-line-strong bg-surface py-2.5 pl-10 pr-10 text-sm text-body placeholder:text-subtle transition-all duration-200 hover:border-ink-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
      />

      {draft && (
        <button
          type="button"
          onClick={() => commit('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-ink-100 hover:text-body"
        >
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M5.5 5.5l9 9M14.5 5.5l-9 9" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {open && matches.length > 0 && (
        <ul
          id={`${inputId}-listbox`}
          role="listbox"
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-lift"
        >
          {matches.slice(0, 6).map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => commit(suggestion)}
                className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-body transition-colors hover:bg-accent-50"
              >
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 text-subtle" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="9" cy="9" r="5" />
                  <path d="M13 13l4 4" strokeLinecap="round" />
                </svg>
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
