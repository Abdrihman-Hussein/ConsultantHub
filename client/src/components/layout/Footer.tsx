import { Link } from 'react-router-dom'
import Reveal from '../ui/Reveal'
import InkBand from '../marketing/InkBand'

/**
 * A footer link is either a real destination or a plain label.
 *
 * Every entry used to be a `Link`, which meant "Pricing" pointed at a
 * `/#pricing` anchor that no longer exists, and the two legal rows plus the
 * social icons pointed at `/#` — so clicking "Privacy policy" silently
 * navigated to the homepage. A link that lands somewhere other than its label
 * is worse than no link at all, so unimplemented destinations are modelled as
 * `href: null` and rendered as non-navigational text.
 */
type FooterLink = { label: string; href: string | null }

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Browse consultants', href: '/consultants' },
      { label: 'How it works', href: '/#how-it-works' },
      // Pricing is per-consultant and shown on every card and profile, so
      // there is no page to link to and no anchor to invent.
      { label: 'Pricing', href: null },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Become a consultant', href: '/become-a-consultant' },
      { label: 'Client dashboard', href: '/client/dashboard' },
      // No support desk exists in this build, so this is a label, not a link.
      { label: 'Contact support', href: null },
    ],
  },
  {
    title: 'Legal',
    links: [
      // These documents have not been written. Inventing stub pages would be
      // the same class of fabrication this redesign removed elsewhere.
      { label: 'Terms of service', href: null },
      { label: 'Privacy policy', href: null },
    ],
  },
]

/**
 * Brand marks for accounts this project does not have. They were `href="/#"`
 * anchors, so every one of them navigated to the homepage — a link promising
 * GitHub that lands on marketing copy. They are rendered as inert marks with
 * the unavailable state stated, so nothing on the page lies about being
 * clickable.
 */
const socials = [
  {
    label: 'X',
    path: 'M3 3l7.5 9.5L3.6 17H6l5.3-6.6L14.4 17H17l-7.9-10L16.6 3H14l-4.8 6L6.1 3H3z',
  },
  {
    label: 'LinkedIn',
    path: 'M4.5 3a1.75 1.75 0 110 3.5 1.75 1.75 0 010-3.5zM3 8h3v9H3V8zm5.5 0h2.9v1.3h.04c.4-.76 1.4-1.56 2.86-1.56 3.06 0 3.7 2 3.7 4.7V17h-3v-4.4c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4V17h-3V8z',
  },
  {
    label: 'GitHub',
    path: 'M10 2a8 8 0 00-2.53 15.59c.4.07.55-.17.55-.38l-.01-1.34c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 014 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48l-.01 2.2c0 .21.14.46.55.38A8 8 0 0010 2z',
  },
]

export default function Footer() {
  return (
    <InkBand as="footer" className="border-t border-ink-line">
      <div className="grid gap-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <Reveal>
          <div className="max-w-xs">
            <Link to="/" className="group inline-flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-on-ink text-xs font-semibold text-ink-950 transition-transform duration-300 ease-spring group-hover:scale-110">
                C
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-on-ink">
                ConsultantHub
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-on-ink-muted">
              Consultants reviewed before they are listed, with rates and availability
              published. Find the right person and book a session in minutes.
            </p>

            {/* Rendered inert: no accounts exist to link to, so these carry no href and
                no hover affordance that would promise a destination. */}
            <div className="mt-6 flex gap-2">
              {socials.map((social) => (
                <span
                  key={social.label}
                  title={`${social.label} — not available yet`}
                  className="grid h-9 w-9 place-items-center rounded-full border border-ink-line/60 text-on-ink-muted/60"
                >
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d={social.path} />
                  </svg>
                  <span className="sr-only">{social.label} — not available yet</span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {columns.map((column, index) => (
          <Reveal key={column.title} delay={(index + 1) * 70}>
            <div>
              <h3 className="eyebrow mb-4 text-on-ink-muted">{column.title}</h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href === null ? (
                      // Not a destination, so not a link: no href, no focus
                      // stop, no hover promise. The label stands for itself.
                      <span className="inline-flex items-center text-sm text-on-ink-muted/70">
                        {link.label}
                      </span>
                    ) : (
                      <Link
                        to={link.href}
                        className="group inline-flex items-center text-sm text-on-ink-muted transition-colors hover:text-on-ink"
                      >
                        <span className="mr-0 h-px w-0 bg-accent-on-ink transition-all duration-300 ease-out group-hover:mr-2 group-hover:w-3" />
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="mt-14 flex flex-col gap-3 border-t border-ink-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-on-ink-muted">
            © {new Date().getFullYear()} ConsultantHub. All rights reserved.
          </p>
          <p className="text-xs text-on-ink-muted">MIT licensed.</p>
        </div>
      </Reveal>
    </InkBand>
  )
}
