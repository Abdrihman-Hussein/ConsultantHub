import { useApp } from '../../context/AppContext'
import { reviewsFor, reviewsSummary } from '../../lib/reviews'
import { formatDate } from '../../lib/format'
import { useTranslation } from '../../i18n/LanguageContext'
import type { Consultant } from '../../types'
import Avatar from '../ui/Avatar'
import Rating from '../ui/Rating'

interface ReviewListProps {
  consultant: Consultant
}

/**
 * The reviews this consultant actually has.
 *
 * These come from `KEYS.reviews`, which starts empty and is only ever written
 * through the gate in `lib/reviews.ts` — every entry belongs to a completed
 * session and to a real account. The fictional sample in `data/index.ts` is
 * not rendered here, because a five-star quote from nobody reads exactly like
 * a rating nobody earned.
 *
 * Author portraits are initials monograms, not photographs, and bodies are
 * plain text: nothing on this page should read as a verified testimonial
 * beyond what the booking it came from establishes.
 */
export default function ReviewList({ consultant }: ReviewListProps) {
  const { reviews } = useApp()
  const { t } = useTranslation()
  const list = reviewsFor(consultant.id, reviews)

  return (
    <section aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="text-lg font-semibold tracking-tight text-ink-950">
        {t('profile.reviews_heading')}
      </h2>

      {list.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{reviewsSummary(list, t)}</p>
      ) : (
        <ol className="mt-2 divide-y divide-line">
          {list.map((review) => (
            <li key={review.id} className="py-5 first:pt-4">
              <div className="flex items-center gap-3">
                <Avatar name={review.authorName} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-950">{review.authorName}</p>
                  <p className="text-xs text-subtle">
                    <time dateTime={review.date}>{formatDate(review.date)}</time>
                  </p>
                </div>
                <div className="ml-auto">
                  <Rating value={review.rating} />
                </div>
              </div>
              {review.body && (
                <p className="mt-3 text-sm leading-relaxed text-muted">{review.body}</p>
              )}
            </li>
          ))}
        </ol>
      )}

      {list.length > 0 && (
        <p className="mt-4 border-t border-line pt-4 text-xs text-subtle">
          {reviewsSummary(list, t)}
        </p>
      )}
    </section>
  )
}