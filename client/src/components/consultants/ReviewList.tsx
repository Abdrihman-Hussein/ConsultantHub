import type { Consultant } from '../../types'
import { getReviewsFor } from '../../data'
import { reviewsSummary } from '../../lib/reviews'
import { formatDate } from '../../lib/format'
import Avatar from '../ui/Avatar'
import Rating from '../ui/Rating'

interface ReviewListProps {
  consultant: Consultant
}

/**
 * The seeded sample of written reviews, framed by the `reviewsSummary` line so
 * the true total is never hidden. Author portraits are initials monograms, not
 * photographs, and review bodies are rendered as plain text — nothing here
 * should read as a real testimonial.
 */
export default function ReviewList({ consultant }: ReviewListProps) {
  const sample = getReviewsFor(consultant.id)

  return (
    <section aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="text-lg font-semibold tracking-tight text-ink-950">
        Reviews
      </h2>

      {sample.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{reviewsSummary(consultant, sample)}</p>
      ) : (
        <ol className="mt-2 divide-y divide-line">
          {sample.map((review) => (
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
              <p className="mt-3 text-sm leading-relaxed text-muted">{review.body}</p>
            </li>
          ))}
        </ol>
      )}

      {sample.length > 0 && (
        <p className="mt-4 border-t border-line pt-4 text-xs text-subtle">
          {reviewsSummary(consultant, sample)}
        </p>
      )}
    </section>
  )
}
