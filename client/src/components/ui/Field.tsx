import { useId } from 'react'
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from 'react'

interface FieldProps {
  label: string
  hint?: ReactNode
  error?: string
}

interface InputProps extends FieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  className?: string
}

export function Input({ label, hint, error, className = '', id, ...rest }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-body">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        className={`w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-body placeholder:text-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500/20 ${
          error
            ? 'border-danger focus:border-danger'
            : 'border-line-strong focus:border-ink-950'
        } ${className}`}
        {...rest}
      />
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  )
}

interface SelectProps
  extends FieldProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  className?: string
  children: ReactNode
}

export function Select({ label, hint, error, className = '', id, children, ...rest }: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className="space-y-1.5">
      <label htmlFor={selectId} className="block text-sm font-medium text-body">
        {label}
      </label>
      <select
        id={selectId}
        className={`w-full appearance-none rounded-xl border bg-surface px-4 py-2.5 text-sm text-body transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500/20 ${
          error ? 'border-danger' : 'border-line-strong focus:border-ink-950'
        } ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  )
}
