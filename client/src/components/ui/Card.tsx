import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Adds hover elevation — use for cards that link somewhere. */
  interactive?: boolean
}

export default function Card({ children, className = '', interactive = false, ...rest }: CardProps) {
  const interactiveClasses =
    'transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift'

  return (
    <div
      className={`rounded-2xl border border-line bg-surface shadow-card ${
        interactive ? interactiveClasses : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
