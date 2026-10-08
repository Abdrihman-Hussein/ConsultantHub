import { Link } from 'react-router-dom'
import type { Consultant } from '../../types'
import Avatar from '../ui/Avatar'
import Rating from '../ui/Rating'
import Button from '../ui/Button'
import { bioLine } from '../../lib/featured'

interface FeaturedConsultantProps {
  consultant: Consultant
}

/**
 * The consultant card that occupies the ink hero — the single strongest trust
 * signal on the page, and the way into the directory.
 *
 * The one line of copy is the consultant's own first bio sentence, extracted
 * rather than written (see `lib/featured`). It is deliberately not wrapped in
 * quotation marks: none of these people said it, and implying otherwise would
 * be the same class of dishonesty as the invented figures this redesign
 * removed.
 */
export default function FeaturedConsultant({ consultant }: FeaturedConsultantProps) {
  const firstName = consultant.name.split(' ')[0]

  return (
    <article className="rounded-2xl border border-ink-line bg-white/[0.07] p-5 backdrop-blur-sm sm:p-6">
      <div className="flex items-start gap-4">
        <Avatar src={consultant.avatar} name={consultant.name} size="lg" className="ring-ink-line" />

        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-xl text-on-ink">{consultant.name}</h2>
          <p className="mt-1 text-xs leading-relaxed text-on-ink-muted truncate">
            {consultant.title} · {consultant.location}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-on-ink-muted">
            <Rating value={consultant.rating} reviewCount={consultant.reviewCount} size="sm" onInk />
            <span aria-hidden="true" className="text-ink-line shrink-0">|</span>
            <span className="truncate">responds {consultant.responseTime}</span>
          </div>
        </div>
      </div>

      <p className="mt-5 border-l-2 border-accent-on-ink pl-4 text-sm leading-relaxed text-on-ink/85 line-clamp-3">
        {bioLine(consultant.bio, consultant.title)}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button to={`/consultants/${consultant.id}`} variant="onInk" size="sm">
          View {firstName}&rsquo;s profile
        </Button>
        <Link
          to="/consultants"
          className="text-xs font-medium text-on-ink-muted underline-offset-4 transition-colors hover:text-on-ink hover:underline"
        >
          Browse all
        </Link>
      </div>
    </article>
  )
}