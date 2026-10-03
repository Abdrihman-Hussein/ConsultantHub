/**
 * DEV-ONLY design review surface. Route: /design-options
 *
 * Renders the same hero + consultant card in four different visual
 * directions so a direction can be chosen by looking at it rather than
 * by describing it. Not part of the product — delete this file and its
 * route once a direction is picked.
 */
import { useState } from 'react'
import Container from '../components/ui/Container'

interface Direction {
  id: string
  name: string
  tagline: string
  font: string
  radius: number
  bg: string
  surface: string
  surfaceAlt: string
  text: string
  muted: string
  border: string
  accent: string
  onAccent: string
  displayFont: string
  shadow: string
  swatch: string[]
}

const directions: Direction[] = [
  {
    id: 'editorial',
    name: 'A. Editorial Serif',
    tagline: 'Magazine-like. Serif headlines, airy, premium, calm authority.',
    font: 'Instrument Serif + Inter',
    radius: 4,
    bg: '#FBFAF8',
    surface: '#FFFFFF',
    surfaceAlt: '#F2F0EB',
    text: '#14110E',
    muted: '#6B635A',
    border: '#E4E0D8',
    accent: '#14110E',
    onAccent: '#FFFFFF',
    displayFont: "'Instrument Serif', Georgia, serif",
    shadow: '0 1px 2px rgba(20,17,14,.04), 0 16px 40px -20px rgba(20,17,14,.18)',
    swatch: ['#FBFAF8', '#14110E', '#8C7B63'],
  },
  {
    id: 'swiss',
    name: 'B. Swiss Minimal',
    tagline: 'Brutalist-clean. One accent, tight grid, zero decoration.',
    font: 'Inter only',
    radius: 8,
    bg: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#F4F4F5',
    text: '#09090B',
    muted: '#71717A',
    border: '#E4E4E7',
    accent: '#2563EB',
    onAccent: '#FFFFFF',
    displayFont: "'Inter', sans-serif",
    shadow: '0 1px 2px rgba(9,9,11,.05)',
    swatch: ['#FFFFFF', '#2563EB', '#09090B'],
  },
  {
    id: 'warm',
    name: 'C. Warm Terracotta',
    tagline: 'Human and approachable. Soft cream, earthy accent, soft radii.',
    font: 'Fraunces + Inter',
    radius: 20,
    bg: '#FDF8F3',
    surface: '#FFFFFF',
    surfaceAlt: '#F5EBE0',
    text: '#2A2118',
    muted: '#7A6A5B',
    border: '#EADFD2',
    accent: '#C2622D',
    onAccent: '#FFFFFF',
    displayFont: "'Fraunces', Georgia, serif",
    shadow: '0 2px 4px rgba(42,33,24,.03), 0 18px 40px -20px rgba(42,33,24,.22)',
    swatch: ['#FDF8F3', '#C2622D', '#2A2118'],
  },
  {
    id: 'dark',
    name: 'D. Dark Premium',
    tagline: 'Confident and modern. Deep slate, luminous accent, glassy cards.',
    font: 'Space Grotesk + Inter',
    radius: 16,
    bg: '#0B0C0E',
    surface: '#141619',
    surfaceAlt: '#1C1F24',
    text: '#F4F4F5',
    muted: '#9CA0AA',
    border: '#25282E',
    accent: '#34D399',
    onAccent: '#06231A',
    displayFont: "'Space Grotesk', 'Inter', sans-serif",
    shadow: '0 24px 60px -24px rgba(0,0,0,.9)',
    swatch: ['#0B0C0E', '#34D399', '#F4F4F5'],
  },
]

function Card({ d }: { d: Direction }) {
  return (
    <div
      style={{
        background: d.surface,
        border: `1px solid ${d.border}`,
        borderRadius: d.radius,
        boxShadow: d.shadow,
        padding: 24,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            background: d.surfaceAlt,
            color: d.muted,
            display: 'grid',
            placeItems: 'center',
            fontSize: 18,
            fontWeight: 600,
            border: `1px solid ${d.border}`,
          }}
        >
          SJ
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: d.text }}>Sarah Jenkins</div>
          <div style={{ fontSize: 13, color: d.muted, marginTop: 2 }}>Strategic Marketing</div>
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: d.accent,
            background: d.surfaceAlt,
            padding: '4px 10px',
            borderRadius: 999,
          }}
        >
          Verified
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, marginTop: 16, fontSize: 12, color: d.muted }}>
        <span style={{ color: '#D9A441' }}>★★★★★</span>
        <span style={{ color: d.text, fontWeight: 500 }}>4.9</span>
        <span>(128)</span>
      </div>

      <div
        style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: `1px solid ${d.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <span style={{ fontSize: 22, fontWeight: 600, color: d.text }}>$150</span>
          <span style={{ fontSize: 13, color: d.muted }}> /hr</span>
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: d.text,
            border: `1px solid ${d.border}`,
            borderRadius: 999,
            padding: '8px 16px',
          }}
        >
          View profile
        </div>
      </div>
    </div>
  )
}

function DirectionPreview({ d }: { d: Direction }) {
  return (
    <div style={{ background: d.bg, borderRadius: 20, padding: 5, border: `1px solid ${d.border}` }}>
      <div
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          background: d.bg,
          border: `1px solid ${d.border}`,
        }}
      >
        {/* fake nav */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: `1px solid ${d.border}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 999,
                background: d.accent,
                color: d.onAccent,
                display: 'grid',
                placeItems: 'center',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              C
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: d.text }}>ConsultantHub</span>
          </div>
          <div style={{ display: 'flex', gap: 18, fontSize: 13, color: d.muted }}>
            <span>Browse</span>
            <span>Dashboard</span>
          </div>
        </div>

        {/* hero */}
        <div style={{ padding: '40px 24px 32px' }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: d.muted,
              fontWeight: 500,
              marginBottom: 14,
            }}
          >
            Verified consultants
          </div>
          <div
            style={{
              fontFamily: d.displayFont,
              fontSize: 40,
              lineHeight: 1.05,
              letterSpacing: '-.02em',
              color: d.text,
              fontWeight: 400,
            }}
          >
            Find the right
            <br />
            consultant.
          </div>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: d.muted,
              marginTop: 16,
              maxWidth: 380,
            }}
          >
            Browse vetted specialists, review their experience and rates, then book a session
            directly.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <div
              style={{
                background: d.accent,
                color: d.onAccent,
                borderRadius: 999,
                padding: '11px 22px',
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Browse consultants
            </div>
            <div
              style={{
                border: `1px solid ${d.border}`,
                color: d.text,
                borderRadius: 999,
                padding: '11px 22px',
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Become a consultant
            </div>
          </div>
        </div>

        {/* card */}
        <div style={{ padding: '0 24px 28px' }}>
          <Card d={d} />
        </div>
      </div>
    </div>
  )
}

export default function DesignOptions() {
  const [choice, setChoice] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-ink-50 py-16">
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow mb-3">Dev only</p>
          <h1 className="font-display text-display-lg text-ink-950">Pick a direction</h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Same content, four visual systems. Click the one you want and I&apos;ll apply it
            across the whole app. Delete this page once we&apos;re done.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {directions.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setChoice(d.id)}
              className="text-left"
              aria-pressed={choice === d.id}
            >
              <div
                style={{
                  borderRadius: 20,
                  padding: 5,
                  border:
                    choice === d.id ? '2px solid #059669' : '2px solid transparent',
                  transition: 'border-color .2s',
                }}
              >
                <DirectionPreview d={d} />
              </div>

              <div className="mt-4 flex items-start justify-between gap-4 px-1">
                <div>
                  <p className="text-sm font-semibold text-ink-950">{d.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{d.tagline}</p>
                  <p className="mt-2 text-xs text-subtle">Type: {d.font}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {d.swatch.map((color) => (
                    <span
                      key={color}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 999,
                        background: color,
                        border: '1px solid rgba(0,0,0,.12)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        {choice && (
          <div className="mt-12 rounded-2xl border border-accent-200 bg-accent-50 p-6">
            <p className="text-sm font-medium text-accent-900">
              You picked{' '}
              <strong>{directions.find((d) => d.id === choice)?.name}</strong>.
            </p>
            <p className="mt-1 text-sm text-accent-800">
              Tell me and I&apos;ll rebuild the whole app on that system — tokens, components,
              and every page.
            </p>
          </div>
        )}
      </Container>
    </div>
  )
}
