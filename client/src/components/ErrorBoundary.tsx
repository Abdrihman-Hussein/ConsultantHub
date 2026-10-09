import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { isLang, LANG_STORAGE_KEY, translateIn } from '../i18n/strings'
import type { Lang, MessageKey } from '../i18n/strings'
import Button from './ui/Button'

/**
 * The active language, read outside React.
 *
 * A class component cannot call a hook, and this boundary is the one place that
 * has to render even when the tree below it is broken. Reading storage directly
 * keeps the recovery message in the reader's language without depending on a
 * provider that may itself be part of what failed.
 */
function currentLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY)
    return isLang(stored) ? stored : 'en'
  } catch {
    return 'en'
  }
}

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Catches render errors so a single broken component shows a recoverable
 * message instead of a blank page. Class component because React exposes no
 * hook equivalent.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // A real deployment would report this to an error service.
    console.error('Unhandled error:', error, info.componentStack)
  }

  private handleReset = () => {
    this.setState({ error: null })
  }

  private handleReload = () => {
    window.location.reload()
  }

  render() {
    const { error } = this.state

    if (!error) return this.props.children

    const t = (key: MessageKey) => translateIn(currentLang(), key)

    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-subtle px-5 py-16">
        <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 text-center shadow-lift">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-danger-soft text-danger">
            <svg viewBox="0 0 20 20" className="h-6 w-6" fill="currentColor">
              <path d="M10 1.5L18.5 17H1.5L10 1.5zM9 7.5v4.2a1 1 0 002 0V7.5a1 1 0 00-2 0zm1 6.1a1.1 1.1 0 100 2.2 1.1 1.1 0 000-2.2z" />
            </svg>
          </span>

          <h1 className="mt-5 font-display text-display-md text-ink-950">
            {t('error.title')}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {t('error.body')}
          </p>

          <pre className="mt-5 max-h-32 overflow-auto rounded-xl bg-surface-muted p-3 text-left text-xs text-muted">
            {error.message}
          </pre>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={this.handleReset}>
              {t('error.try_again')}
            </Button>
            <Button className="flex-1" onClick={this.handleReload}>
              {t('error.reload')}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
