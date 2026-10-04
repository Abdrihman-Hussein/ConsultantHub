import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

const control =
  'w-full appearance-none rounded-xl border bg-surface px-4 py-2.5 text-sm text-body ' +
  'placeholder:text-subtle transition-all duration-200 ease-out ' +
  'focus:outline-none focus:ring-2 focus:ring-accent-500/20'

interface FieldShellProps {
  label: string
  hint?: ReactNode
  error?: string
  htmlFor: string
  children: ReactNode
}

function FieldShell({ label, hint, error, htmlFor, children }: FieldShellProps) {
  return (
    <div className="group space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-muted transition-colors duration-200 group-focus-within:text-accent-600"
      >
        {label}
      </label>
      {children}
      {error ? (
        // role=alert so screen readers announce the message on submit.
        <p role="alert" className="flex items-center gap-1.5 text-xs text-danger">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="currentColor">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3.2c.44 0 .78.36.75.8l-.2 3.1a.55.55 0 01-1.1 0l-.2-3.1A.75.75 0 018 4.2zm0 5.6a.85.85 0 110 1.7.85.85 0 010-1.7z" />
          </svg>
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  )
}

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>,
    Pick<FieldShellProps, 'label' | 'hint' | 'error'> {
  className?: string
}

export function Input({ label, hint, error, className = '', id, ...rest }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={inputId}>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        className={`${control} ${
          error
            ? 'border-danger focus:border-danger focus:ring-danger/20'
            : 'border-line-strong hover:border-ink-400 focus:border-accent-500'
        } ${className}`}
        {...rest}
      />
    </FieldShell>
  )
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'>,
    Pick<FieldShellProps, 'label' | 'hint' | 'error'> {
  className?: string
  children: ReactNode
}

export function Select({ label, hint, error, className = '', id, children, ...rest }: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={selectId}>
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={error ? true : undefined}
          className={`${control} cursor-pointer pr-10 ${
            error
              ? 'border-danger focus:border-danger'
              : 'border-line-strong hover:border-ink-400 focus:border-accent-500'
          } ${className}`}
          {...rest}
        >
          {children}
        </select>
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </FieldShell>
  )
}
