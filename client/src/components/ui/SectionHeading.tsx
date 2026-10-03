import type { ReactNode } from 'react'
import Container from '../ui/Container'

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  action?: ReactNode
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
}: SectionHeadingProps) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start'

  return (
    <Container>
      <div className={`flex flex-col gap-6 sm:flex-row sm:justify-between ${alignment}`}>
        <div className="max-w-2xl">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h2 className="font-display text-display-lg text-ink-950">{title}</h2>
          {description && (
            <p className="mt-4 text-base leading-relaxed text-muted">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </Container>
  )
}
