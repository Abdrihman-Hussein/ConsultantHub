import type { ReactNode } from 'react'

type Tone = 'neutral' | 'accent' | 'gold' | 'muted' | 'danger'

const tones: Record<Tone, string> = {
  neutral: 'bg-ink-100 text-ink-700',
  accent: 'bg-accent-50 text-accent-700',
  gold: 'bg-gold-300/25 text-gold-600',
  muted: 'bg-surface-muted text-muted',
  danger: 'bg-red-50 text-danger',
}

interface BadgeProps {
  tone?: Tone
  children: ReactNode
  className?: string
}

export default function Badge({ tone = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
