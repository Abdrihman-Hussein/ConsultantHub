import type { ReactNode } from 'react'
import Container from './Container'
import Reveal from './Reveal'

interface EmptyStateProps {
  title: string
  body?: string
  icon?: 'user' | 'calendar' | 'search' | 'clock' | 'inbox'
  action?: ReactNode
  className?: string
}

const icons = {
  user: 'M10 4a3 3 0 100 6 3 3 0 000-6zM4.5 17c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5',
  calendar:
    'M4 6.5h12v10H4v-10zM4 9.5h12M7.5 4.5v3M12.5 4.5v3',
  search: 'M15 15l-3.5-3.5M9 4.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z',
  clock: 'M10 4.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM10 7.5v3l2 1.5',
  inbox: 'M3.5 11.5h4l1 2h3l1-2h4M4.5 4.5h11l1.5 7v4H3v-4l1.5-7z',
}

/**
 * Consistent empty/zero state. Having one component means every list in the app
 * fails the same way, which reads as intentional rather than broken.
 */
export default function EmptyState({
  title,
  body,
  icon = 'inbox',
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <Reveal>
      <div
        className={`rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center ${className}`}
      >
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent-50 text-accent-500">
          <svg
            viewBox="0 0 20 20"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={icons[icon]} />
          </svg>
        </span>
        <h2 className="mt-5 text-lg font-semibold tracking-tight text-ink-950">{title}</h2>
        {body && (
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">{body}</p>
        )}
        {action && <div className="mt-7">{action}</div>}
      </div>
    </Reveal>
  )
}

/** Convenience wrapper when the empty state sits inside an existing container. */
export function PanelEmptyState(props: EmptyStateProps) {
  return (
    <Container>
      <EmptyState {...props} />
    </Container>
  )
}
