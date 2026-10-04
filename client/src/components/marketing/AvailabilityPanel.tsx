import { useState } from 'react'
import { Link } from 'react-router-dom'
import { consultants } from '../../data/consultants'
import Container from '../ui/Container'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'

export default function AvailabilityPanel() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="relative">
      {/* Offset terracotta plate behind the card for depth. */}
      <div
        aria-hidden="true"
        className="absolute -inset-3 rounded-3xl border border-accent-200 bg-accent-50/60"
      />

      <div className="relative rounded-2xl border border-line bg-surface p-6 shadow-lift">
        <div className="mb-5 flex items-center justify-between">
          <p className="eyebrow">Available this week</p>
          <Badge tone="accent">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-accent-500" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-500" />
            </span>
            Live
          </Badge>
        </div>

        <ul className="space-y-1">
          {consultants.slice(0, 3).map((consultant, index) => (
            <li key={consultant.id}>
              <Link
                to={`/consultants/${consultant.id}`}
                onMouseEnter={() => setHovered(consultant.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(consultant.id)}
                onBlur={() => setHovered(null)}
                style={{ transitionDelay: `${index * 40}ms` }}
                className={`flex items-center gap-3.5 rounded-xl p-2.5 transition-all duration-300 ease-out hover:bg-accent-50/70 ${
                  hovered === consultant.id ? 'translate-x-1 bg-accent-50/70' : ''
                }`}
              >
                <Avatar src={consultant.avatar} name={consultant.name} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-950">{consultant.name}</p>
                  <p className="truncate text-xs text-muted">{consultant.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-ink-950">${consultant.hourlyRate}</p>
                  <p className="text-xs text-subtle">{consultant.responseTime} response</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to="/consultants"
          className="group mt-6 flex items-center justify-between rounded-xl bg-ink-950 px-4 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-accent-600"
        >
          See all consultants
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
