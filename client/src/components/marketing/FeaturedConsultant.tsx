import { Link } from 'react-router-dom'
import type { Consultant } from '../../types'
import Avatar from '../ui/Avatar'
import Rating from '../ui/Rating'
import Button from '../ui/Button'
import { bioLine } from '../../lib/featured'
import { countLabel } from '../../lib/format'

interface FeaturedConsultantProps {
  consultant: Consultant
}

/**
 * The consultant card that occupies the hero — the single strongest trust
 * signal on the page, and the way into the directory.
 *
 * It sits on cream, so it is a light-surface card rather than a translucent
 * panel: an opaque `bg-surface` with a `border-line` edge, and the same muted
 * tiers every other card on the site uses. That also means the `Rating` runs
 * on its default palette (`gold-400` stars, `ink-200` empties) — the `onInk`
 * variant exists because that palette disappears against a dark band, and on
 * cream it would be a light peach on white.
 *
 * The one line of copy is the consultant's own first bio sentence, extracted
 * rather than written (see `lib/featured`). It is deliberately not wrapped in
 * quotation marks: none of these people said it, and implying otherwise would
 * be the same class of dishonesty as the invented figures this redesign
 * removed. For the same reason the credential line carries delivered sessions
 * rather than a review count.
 */
export default function FeaturedConsultant({ consultant }: FeaturedConsultantProps) {
  const firstName = consultant.name.split(' ')[0]

  return (
    <article className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
      <div className="flex items-start gap-4">
        <Avatar src={consultant.avatar} name={consultant.name} size="lg" />

        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-xl text-ink-950">{consultant.name}</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted truncate">
            {consultant.title} · {consultant.location}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <Rating value={consultant.rating} size="sm" />
            <span aria-hidden="true" className="text-ink-200 shrink-0">|</span>
            <span className="truncate">{countLabel(consultant.sessions, 'session')} delivered</span>
            <span aria-hidden="true" className="text-ink-200 shrink-0">|</span>
            <span className="truncate">responds {consultant.responseTime}</span>
          </div>
        </div>
      </div>

      <p className="mt-5 border-l-2 border-accent-600 pl-4 text-sm leading-relaxed text-muted line-clamp-3">
        {bioLine(consultant.bio, consultant.title)}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button to={`/consultants/${consultant.id}`} variant="primary" size="sm">
          View {firstName}&rsquo;s profile
        </Button>
        <Link
          to="/consultants"
          className="text-xs font-medium text-muted underline-offset-4 transition-colors hover:text-body hover:underline"
        >
          Browse all
        </Link>
      </div>
    </article>
  )
}
