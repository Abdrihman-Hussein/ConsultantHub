import { useTranslation } from '../../i18n/LanguageContext'

interface RatingProps {
  /**
   * The average, or `null` when nobody has reviewed this consultant yet.
   *
   * `null` renders as "No reviews yet" rather than five empty stars, because
   * five empty stars read as a zero out of five — a score nobody gave. The
   * value used to be a seeded `Consultant.rating`; there is no fallback
   * number now, so an un-reviewed consultant looks un-reviewed.
   */
  value: number | null
  size?: 'sm' | 'md'
  /** Hide the numeric value and show stars only. */
  compact?: boolean
  /**
   * Render for a dark surface. The default palette — `text-body` type on
   * `text-ink-200` empty stars — is tuned for cream and becomes invisible on
   * an ink band.
   */
  onInk?: boolean
}

const sizes = {
  sm: 'text-xs gap-1',
  md: 'text-sm gap-1.5',
}

const starSize = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
}

/**
 * A star rating, or an honest statement that there is not one.
 *
 * This component deliberately has no `reviewCount` prop, and it has never had
 * a default value: a parenthesised figure beside five stars is read as a
 * written-review count, and a rating with no reviews behind it is a claim the
 * data cannot support. Both are shown where they can be substantiated —
 * sessions on the cards, and the written reviews themselves on the profile.
 */
export default function Rating({
  value,
  size = 'sm',
  compact = false,
  onInk = false,
}: RatingProps) {
  const { t } = useTranslation()
  const empty = value === null

  return (
    <div className={`flex items-center ${sizes[size]}`}>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            viewBox="0 0 20 20"
            className={`${starSize[size]} ${
              empty
                ? onInk
                  ? 'text-on-ink/25'
                  : 'text-ink-200'
                : star <= Math.round(value)
                  ? onInk
                    ? 'text-accent-on-ink'
                    : 'text-accent-500'
                  : onInk
                    ? 'text-on-ink/25'
                    : 'text-ink-200'
            }`}
            fill="currentColor"
          >
            <path d="M10 1.5l2.47 5.34 5.84.66-4.32 3.98 1.15 5.77L10 14.4l-5.14 2.85 1.15-5.77L1.7 7.5l5.83-.66L10 1.5z" />
          </svg>
        ))}
      </span>
      {empty ? (
        <>
          <span className="sr-only">{t('rating.none')}</span>
          {!compact && (
            <span className={onInk ? 'text-on-ink' : 'text-muted'}>{t('rating.none')}</span>
          )}
        </>
      ) : (
        <>
          <span className="sr-only">{t('rating.sr_value', { value })}</span>
          {!compact && (
            <span className={`font-medium ${onInk ? 'text-on-ink' : 'text-body'}`}>
              {value.toFixed(1)}
            </span>
          )}
        </>
      )}
    </div>
  )
}