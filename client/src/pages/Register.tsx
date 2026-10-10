import { Link } from 'react-router-dom'
import { SignUp } from '@clerk/react'
import { useTranslation } from '../i18n/LanguageContext'
import AuthShell from '../components/marketing/AuthShell'
import { authCardAppearance } from '../lib/clerkAppearance'

/**
 * Registration. The form is Clerk's; the page around it is still ours.
 *
 * Identical treatment to `Login` — the shell's card, the ink aside, the
 * shell's own footer link — so the two pages differ only in the copy around
 * Clerk's component and in where Clerk sends the new account. Sign-up has no
 * remembered destination (the old form always went to the dashboard) so this
 * one uses `forceRedirectUrl` directly rather than reading `location.state`.
 *
 * The local password rules are gone with the local accounts: Clerk decides
 * what a password has to look like, and the app no longer has a strength meter
 * to keep in step with it.
 */
export default function Register() {
  const { t } = useTranslation()

  return (
    <AuthShell
      title={t('register.title')}
      subtitle={t('register.subtitle')}
      footer={
        <>
          {t('register.already')}{' '}
          <Link to="/login" className="font-medium text-ink-950 underline underline-offset-4">
            {t('common.log_in')}
          </Link>
        </>
      }
    >
      <SignUp
        routing="hash"
        signInUrl="/login"
        forceRedirectUrl="/client/dashboard"
        appearance={authCardAppearance}
      />
    </AuthShell>
  )
}