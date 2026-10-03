import type { CSSProperties, ReactNode } from 'react'

type Tone = 'neutral' | 'accent' | 'gold' | 'muted' | 'danger'

const tones: Record<Tone, string> = {
  neutral: 'bg-ink-100 text-ink-800',
  accent: 'bg-accent-50 text-accent-700',
  gold: 'bg-gold-300/25 text-gold-600',
  muted: 'bg-surface-muted text-muted',
  danger: 'bg-danger-soft text-danger',
}

interface BadgeProps {
  tone?: Tone
  children: ReactNode
  className?: string
}

/**
 * Exposes the badge's own background as `--ch-badge-fill` so that icons
 * containing knockout details (a checkmark inside a filled seal, say) can
 * match it without hardcoding a hex value.
 */
const fills: Record<Tone, string> = {
  neutral: 'var(--ch-ink-100)',
  accent: 'var(--ch-accent-50)',
  gold: '#F7EAD2',
  muted: 'var(--ch-surface-muted)',
  danger: 'var(--ch-danger-soft)',
}

export default function Badge({ tone = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span
      style={{ '--ch-badge-fill': fills[tone] } as CSSProperties}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
