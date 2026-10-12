import { useId, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { useTranslation } from '../../i18n/LanguageContext'

const VALUES = [1, 2, 3, 4, 5]

interface StarInputProps {
  /** The chosen rating, or `null` when nothing has been chosen yet. */
  value: number | null
  onChange: (value: number) => void
  /** Required. Announced as the name of the radio group. */
  label: string
  /** Keyboard instructions, associated with the group. */
  hint?: string
  disabled?: boolean
}

/**
 * Five stars as a real radio group.
 *
 * This is `role="radiogroup"` with five `role="radio"` children, not five
 * buttons styled to look like one. That distinction is the whole point: a
 * screen reader announces "4 of 5" and "radio button", and the arrow keys
 * behave the way every other radio group on the platform behaves — moving
 * between the options and selecting as it goes.
 *
 * One tab stop (roving `tabindex`): Tab moves past the whole group rather than
 * through five stops, and whichever star currently holds the selection is the
 * one focus returns to. With nothing chosen, focus lands on the first star —
 * an arbitrary but consistent entry point, and moving right from there selects
 * one, which is what arrow keys do in a native radio group.
 */
export default function StarInput({
  value,
  onChange,
  label,
  hint,
  disabled = false,
}: StarInputProps) {
  const { t } = useTranslation()
  const labelId = useId()
  const hintId = useId()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  // With no selection yet, the first star is the tab stop and the arrow-key
  // origin. It is not "selected" — `aria-checked` stays false until chosen.
  const active = value ?? 1

  const focus = (index: number) => {
    buttons.current[index]?.focus()
  }

  const move = (from: number, step: number) => {
    const next = Math.min(VALUES.length, Math.max(1, from + step))
    onChange(next)
    focus(next - 1)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    // Every arrow direction moves one step and wraps at the ends, matching a
    // native radio group: there is no previous/next to disable here, and
    // wrapping is what readers expect from a five-item single-select.
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault()
        move(index + 1, 1)
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault()
        move(index + 1, -1)
        break
      case 'Home':
        event.preventDefault()
        move(1, -VALUES.length)
        break
      case 'End':
        event.preventDefault()
        move(1, VALUES.length)
        break
      default:
        break
    }
  }

  const describedBy = hint ? hintId : undefined

  return (
    <div className="space-y-1.5">
      <span id={labelId} className="block text-sm font-medium text-muted">
        {label}
      </span>

      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-disabled={disabled || undefined}
        aria-required="true"
        className="flex items-center gap-1"
      >
        {VALUES.map((star) => {
          const selected = value === star
          return (
            <button
              key={star}
              ref={(element) => {
                buttons.current[star - 1] = element
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={t('reviews.form.star_option', { value: star })}
              tabIndex={disabled ? -1 : star === active ? 0 : -1}
              disabled={disabled}
              onClick={() => onChange(star)}
              onKeyDown={(event) => onKeyDown(event, star - 1)}
              className={`rounded-full p-1 transition-transform duration-150 ease-out ${
                disabled
                  ? 'cursor-not-allowed text-ink-200'
                  : 'cursor-pointer hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/40'
              }`}
            >
              <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                className={`h-6 w-6 ${
                  value !== null && star <= Math.round(value) ? 'text-accent-500' : 'text-ink-200'
                }`}
                fill="currentColor"
              >
                <path d="M10 1.5l2.47 5.34 5.84.66-4.32 3.98 1.15 5.77L10 14.4l-5.14 2.85 1.15-5.77L1.7 7.5l5.83-.66L10 1.5z" />
              </svg>
            </button>
          )
        })}
      </div>

      {/* The current selection, re-announced as the arrows move through it.
          Not a claim about the consultant — it is what this reader has chosen
          so far, and it is null until they choose something. */}
      <span aria-live="polite" className="sr-only">
        {value === null ? t('rating.none') : t('rating.sr_value', { value })}
      </span>
      {hint && (
        <p id={hintId} className="text-xs text-subtle">
          {hint}
        </p>
      )}
    </div>
  )
}