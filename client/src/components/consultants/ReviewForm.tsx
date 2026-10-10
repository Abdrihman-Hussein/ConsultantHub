import { useState } from 'react'
import type { FormEvent } from 'react'
import { useApp } from '../../context/AppContext'
import { canReview } from '../../lib/reviews'
import { useCurrentUser } from '../../lib/useCurrentUser'
import { useTranslation } from '../../i18n/LanguageContext'
import type { MessageKey } from '../../i18n/strings'
import type { Consultant } from '../../types'
import Card from '../ui/Card'
import Button from '../ui/Button'
import StarInput from '../ui/StarInput'

interface ReviewFormProps {
  consultant: Consultant
}

/** The gate's refusal reasons, as dictionary keys rather than sentences. */
export const BLOCK_KEYS: Record<string, MessageKey> = {
  not_signed_in: 'reviews.block.not_signed_in',
  no_completed_booking: 'reviews.block.no_completed_booking',
  already_reviewed: 'reviews.block.already_reviewed',
  storage_unavailable: 'reviews.block.storage_unavailable',
}

/**
 * The review form, rendered only when the gate says this client has earned it.
 *
 * When it is not earned, this component renders nothing at all — the reason
 * is explained by the profile beside it, which is where the reader is looking.
 * The gate (`canReview`) is the single authority and is re-read on every
 * render, so if the appointment is cancelled or already reviewed the form
 * disappears rather than offering an action that will be refused. The same
 * gate runs again inside `addReview` before anything is written.
 *
 * The stars are required; the written review is not. Refusing a written review
 * would push people back towards the bare rating, which is the thing a
 * five-star average is most misleading without.
 */
export default function ReviewForm({ consultant }: ReviewFormProps) {
  const { appointments, reviews, isPersistent, addReview } = useApp()
  const user = useCurrentUser()
  const { t } = useTranslation()
  const [rating, setRating] = useState<number | null>(null)
  const [body, setBody] = useState('')
  const [error, setError] = useState<MessageKey | null>(null)
  const [saved, setSaved] = useState(false)

  // Unchanged rule, changed source: the reviewer's id is Clerk's `user.id`
  // rather than `session.userId`. Both are strings, so the gate's four-argument
  // contract and every appointment it reads are untouched — only the completed
  // sessions belonging to *this* person can earn a review, and only once each.
  const gate = canReview(
    consultant.id,
    user?.id ?? null,
    appointments,
    reviews,
    new Date(),
    isPersistent,
  )

  if (!gate.ok) return null

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (rating === null) {
      setError('reviews.form.stars_required')
      setSaved(false)
      return
    }

    // `addReview` re-runs the gate; a refusal here means the session moved
    // under the form, which is a different problem from a validation failure
    // and says so.
    if (!addReview({ consultantId: consultant.id, rating, body })) {
      setError('reviews.form.refused')
      setSaved(false)
      return
    }

    setError(null)
    setRating(null)
    setBody('')
    setSaved(true)
  }

  return (
    <Card className="border-line bg-surface p-6">
      <h3 className="text-base font-semibold tracking-tight text-ink-950">
        {t('reviews.form.title')}
      </h3>
      <p className="mt-1 text-sm text-muted">
        {t('reviews.form.subtitle', { name: consultant.name })}
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-5">
        <StarInput
          value={rating}
          onChange={(value) => {
            setRating(value)
            setError(null)
          }}
          label={t('reviews.form.stars_label')}
          hint={t('reviews.form.stars_hint')}
        />

        <div className="space-y-1.5">
          <label htmlFor="review-body" className="block text-sm font-medium text-muted">
            {t('reviews.form.body_label')}
          </label>
          <textarea
            id="review-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={4}
            placeholder={t('reviews.form.body_placeholder')}
            aria-describedby="review-body-hint"
            className="w-full appearance-none rounded-xl border border-line-strong bg-surface px-4 py-2.5 text-sm text-body placeholder:text-subtle transition-all duration-200 ease-out hover:border-ink-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
          />
          <p id="review-body-hint" className="text-xs text-subtle">
            {t('reviews.form.hint')}
          </p>
        </div>

        {/* One live region for both outcomes, so a screen reader hears the
            result of submitting rather than only seeing the form reset. */}
        <p role="status" aria-live="polite" className="min-h-5 text-xs text-muted">
          {error ? (
            <span className="text-danger">{t(error)}</span>
          ) : saved ? (
            t('reviews.form.saved')
          ) : null}
        </p>

        <Button type="submit">{t('reviews.form.submit')}</Button>
      </form>
    </Card>
  )
}