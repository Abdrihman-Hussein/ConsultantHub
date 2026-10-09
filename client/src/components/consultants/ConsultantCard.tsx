import { Link } from 'react-router-dom'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import Rating from '../ui/Rating'
import { useTranslation } from '../../i18n/LanguageContext'
import type { Consultant } from '../../types'

interface ConsultantCardProps {
  consultant: Consultant
}

/**
 * Smaller-scale sibling of `FeaturedConsultant` — same portrait-first shape
 * (portrait, name, credential line, rating, rate), light-surface styling.
 *
 * The trust signal under the rating is delivered sessions, not a review count.
 * A bare `(128)` beside the stars implied 128 written reviews, and only three
 * exist per consultant; the count itself is now stated once, qualified, in the
 * profile's review list.
 */
export default function ConsultantCard({ consultant }: ConsultantCardProps) {
  const { t } = useTranslation()

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
            {t('card.verified')}
          </Badge>
        )}
      </div>

      <h3 className="mt-4 font-display text-xl text-ink-950 truncate transition-colors duration-300 group-hover:text-accent-600">
        {consultant.name}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        {consultant.title} · {consultant.location}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
        <Rating value={consultant.rating} size="sm" />
        <span aria-hidden="true" className="text-ink-200">·</span>
        {/* One key for the whole phrase rather than a count and a separate word:
            Somali orders and shapes the two differently, and a count helper
            cannot know that. */}
        <span>{t('common.sessions_delivered', { count: consultant.sessions })}</span>
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
          {t('card.view_profile')}
        </Link>
      </div>
    </article>
  )
}
