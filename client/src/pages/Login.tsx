import { Link, useLocation } from 'react-router-dom'
import { SignIn } from '@clerk/react'
import { useTranslation } from '../i18n/LanguageContext'
import AuthShell from '../components/marketing/AuthShell'
import { authCardAppearance } from '../lib/clerkAppearance'

interface LocationState {
  from?: string
}

/**
 * Sign-in. The form itself is Clerk's; the page around it is still ours.
 *
 * `AuthShell` renders unchanged, so the ink aside and the cream panel survive —
 * the shell owns the title, subtitle, card and footer, and Clerk's `<SignIn>`
 * is rendered inside the card where the hand-written form used to be. Clerk's
 * own card chrome is switched off (`elevation: 'flush'`) so its border, radius
 * and shadow do not stack on top of the shell's, and its "Don't have an
 * account? Sign up" footer is hidden because the shell footer already says
 * exactly that and links to the same route.
 *
 * `routing="hash"` is deliberate. With the default path routing Clerk would
 * push `/login/continue` and friends, which React Router has no route for, so
 * the catch-all would send the user back to the home page mid-flow. Hash
 * routing keeps Clerk's internal step in the fragment and leaves `/login` — and
 * every other route URL in this app — exactly where it was.
 *
 * The intended destination survives: `RequireAuth` puts the path it was
 * guarding into `location.state.from`, and that is passed as the redirect, so
 * arriving at `/client/appointments` still lands on `/client/appointments`
 * after signing in. `forceRedirectUrl` rather than `fallbackRedirectUrl`,
 * because this value is a decision the app already made and Clerk's dashboard
 * default must not override it.
 */
export default function Login() {
  const location = useLocation()
  const { t } = useTranslation()

  const redirectTo = (location.state as LocationState | null)?.from ?? '/client/dashboard'

  return (
    <AuthShell
      title={t('login.title')}
      subtitle={t('login.subtitle')}
      footer={
        <>
          {t('login.no_account')}{' '}
          <Link to="/register" className="font-medium text-ink-950 underline underline-offset-4">
            {t('booking.create_one')}
          </Link>
        </>
      }
    >
      <SignIn
        routing="hash"
        signUpUrl="/register"
        forceRedirectUrl={redirectTo}
        appearance={authCardAppearance}
      />
    </AuthShell>
  )
}