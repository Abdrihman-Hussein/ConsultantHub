import { Link } from 'react-router-dom'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import Rating from '../ui/Rating'
import type { Consultant } from '../../types'

interface ConsultantCardProps {
  consultant: Consultant
}

/**
 * Smaller-scale sibling of `FeaturedConsultant` — same portrait-first shape
 * (portrait, name, credential line, rating, rate), light-surface styling.
 */
export default function ConsultantCard({ consultant }: ConsultantCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-colors duration-300 hover:border-line-strong">
      <div className="flex items-start justify-between gap-4">
        <Avatar
          src={consultant.avatar}
          name={consultant.name}
          size="xl"
          className="transition-transform duration-500 ease-spring group-hover:scale-105"
        />
        {consultant.verified && (
          <Badge tone="accent" className="shrink-0">
            Verified
          </Badge>
        )}
      </div>

      <h3 className="mt-4 font-display text-xl text-ink-950 transition-colors duration-300 group-hover:text-accent-600">
        {consultant.name}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        {consultant.title} · {consultant.location}
      </p>

      <div className="mt-3 text-xs text-muted">
        <Rating value={consultant.rating} reviewCount={consultant.reviewCount} size="sm" />
      </div>

      <div className="mt-auto flex items-end justify-between gap-4 pt-5">
        <div>
          <span className="text-xl font-semibold tracking-tight text-ink-950">
            ${consultant.hourlyRate}
          </span>
          <span className="text-sm text-subtle"> /hr</span>
        </div>
        <Link
          to={`/consultants/${consultant.id}`}
          className="rounded-full border border-line-strong px-4 py-2 text-sm font-medium text-body transition-all duration-300 ease-out hover:border-accent-500 hover:bg-accent-500 hover:text-white"
        >
          View profile
        </Link>
      </div>
    </article>
  )
}
