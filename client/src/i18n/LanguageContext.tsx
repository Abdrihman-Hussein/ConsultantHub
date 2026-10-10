import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { DEFAULT_LANG, isLang, translateIn, LANG_STORAGE_KEY } from './strings'
import type { Lang, MessageKey, Params, Translate } from './strings'

/**
 * Language selection.
 *
 * Deliberately independent of auth: it is a reading preference, not an account
 * setting, and Clerk is mid-migration. It is persisted under the app's own
 * localStorage prefix but outside `lib/storage`'s `KEYS`, so the "reset demo
 * data" wipe does not discard someone's language choice.
 *
 * There is no `dir` anywhere. Somali is written in Latin script, left to
 * right, like this dictionary itself.
 */

interface LanguageState {
  lang: Lang;
  /** Locale for `Intl` — kept alongside `lang` so it is explicit, not guessed. */
  locale: string;
  t: Translate;
  setLang: (lang: Lang) => void;
  /** For `<html lang>` and any `<a hreflang>`. */
  htmlLang: string;
}

const LanguageContext = createContext<LanguageState | null>(null)

function readStoredLang(): Lang {
  if (typeof window === 'undefined') return DEFAULT_LANG
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY)
    return isLang(stored) ? stored : DEFAULT_LANG
  } catch {
    // Private browsing or a blocked storage partition: fall back to English
    // rather than failing to render.
    return DEFAULT_LANG
  }
}

/** BCP-47 tags, matching the `lang` values the dictionary is keyed by. */
const LOCALES: Record<Lang, string> = { en: 'en-US', so: 'so' }

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next)
    } catch {
      // Storage unavailable: the language still changes for this session.
    }
  }, [])

  const t = useCallback<Translate>(
    (key: MessageKey, params?: Params) => translateIn(lang, key, params),
    [lang],
  )

  // `useMemo` rather than a `useEffect`: the attribute has to be correct on
  // the very first paint after a switch, and an effect would leave a frame of
  // screen-reader-visible text in the previous language.
  const htmlLang = lang

  if (typeof document !== 'undefined') {
    document.documentElement.lang = htmlLang
  }

  const value = useMemo<LanguageState>(
    () => ({ lang, locale: LOCALES[lang], t, setLang, htmlLang }),
    [lang, t, setLang, htmlLang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageState {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return context
}

/** The common case: just the dictionary. */
export function useTranslation() {
  const { t, lang, setLang } = useLanguage()
  return { t, lang, setLang }
}