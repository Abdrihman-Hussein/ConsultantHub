import { Link } from 'react-router-dom'
import Container from '../ui/Container'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Browse consultants', to: '/consultants' },
      { label: 'How it works', to: '/#how-it-works' },
      { label: 'Pricing', to: '/#pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Become a consultant', to: '/register' },
      { label: 'Client dashboard', to: '/client/dashboard' },
      { label: 'Contact support', to: '/#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of service', to: '/#' },
      { label: 'Privacy policy', to: '/#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-ink-950 text-xs font-semibold text-white">
                C
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-ink-950">
                ConsultantHub
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              A trusted network of verified consultants. Find the right person and book a session
              in minutes.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="eyebrow mb-4">{column.title}</h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted transition-colors hover:text-ink-950"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-subtle">
            © {new Date().getFullYear()} ConsultantHub. All rights reserved.
          </p>
          <p className="text-xs text-subtle">MIT licensed.</p>
        </div>
      </Container>
    </footer>
  )
}
