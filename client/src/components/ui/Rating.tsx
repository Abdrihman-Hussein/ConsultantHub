import { useTranslation } from '../../i18n/LanguageContext'

interface RatingProps {
  value: number
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

/**
 * A star rating and nothing else.
 *
 * This component deliberately has no `reviewCount` prop. It used to render a
 * bare ` (128)` next to the number, and a parenthesised figure beside five stars
 * is read as a written-review count everywhere except the one page that
 * explains it — the profile, whose review list states how many are actually
 * shown. On a card and on the hero the same number implied 128 written reviews
 * exist, which they do not. Rather than label the lie, the number is gone:
 * surfaces without visible reviews show session volume instead, which is real,
 * and the count is stated once, where it is qualified.
 */
export default function Rating({
  value,
  size = 'sm',
  compact = false,
  onInk = false,
}: RatingProps) {
  const { t } = useTranslation()

  return (
    <div className={`flex items-center ${sizes[size]}`}>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            viewBox="0 0 20 20"
            className={`${size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} ${
              star <= Math.round(value)
                ? onInk
                  ? 'text-gold-on-ink'
                  : 'text-gold-400'
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
      <span className="sr-only">{t('rating.sr_value', { value })}</span>
      {!compact && (
        <span className={`font-medium ${onInk ? 'text-on-ink' : 'text-body'}`}>
          {value.toFixed(1)}
        </span>
      )}
    </div>
  )
}
