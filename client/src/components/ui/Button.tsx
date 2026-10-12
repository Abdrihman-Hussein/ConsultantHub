import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'dark' | 'outline' | 'ghost' | 'onInk' | 'onInkOutline'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap ' +
  // Only the properties that actually change are transitioned. `transition-all`
  // also animates layout properties, which jitters under press.
  'transition-[transform,background-color,border-color,color,box-shadow,opacity] duration-200 ease-smooth ' +
  // Press feedback: the interface confirms it heard you within 200ms.
  'active:scale-[0.97] motion-reduce:active:scale-100 ' +
  'focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-accent-500/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-accent-500 text-white hover:bg-accent-600 shadow-sm shadow-accent-500/25',
  dark: 'bg-ink-950 text-white hover:bg-ink-900 shadow-sm',
  outline: 'border border-line-strong bg-surface text-body hover:border-accent-500 hover:bg-accent-50',
  ghost: 'text-muted hover:bg-ink-100 hover:text-body',
  // Dark-surface pairs. The shared `base` ring is tuned for cream and
  // disappears against ink, so these override the ring and its offset too.
  onInk:
    'bg-accent-on-ink text-ink-950 hover:bg-accent-300 shadow-sm ' +
    'focus-visible:ring-accent-on-ink/60 focus-visible:ring-offset-surface-ink',
  onInkOutline:
    'border border-ink-line bg-transparent text-on-ink hover:bg-ink-line ' +
    'focus-visible:ring-accent-on-ink/60 focus-visible:ring-offset-surface-ink',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-7 text-[15px]',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    /** Render a react-router <Link> instead of a <button>. */
    to?: string
  }

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  to,
  ...rest
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
