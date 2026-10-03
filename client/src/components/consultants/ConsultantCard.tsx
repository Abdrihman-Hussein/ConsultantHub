import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import Rating from '../ui/Rating'
import type { Consultant } from '../../types'

interface ConsultantCardProps {
  consultant: Consultant
}

export default function ConsultantCard({ consultant }: ConsultantCardProps) {
  return (
    <Card interactive className="flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <Avatar src={consultant.avatar} name={consultant.name} size="lg" />
        {consultant.verified && (
          <Badge tone="accent">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
              <path d="M8 1l1.9 1.2 2.2-.3.9 2 1.9 1-.3 2.2 1.2 1.9-1.2 1.9.3 2.2-1.9 1-.9 2-2.2-.3L8 15l-1.9-1.2-2.2.3-.9-2-1.9-1 .3-2.2L1.2 8l1.2-1.9-.3-2.2 1.9-1 .9-2 2.2.3L8 1z" />
              <path d="M5.6 8.1l1.6 1.6 3.3-3.3" stroke="#ECFDF5" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Verified
          </Badge>
        )}
      </div>

      <div className="mt-5">
        <h3 className="text-[17px] font-semibold tracking-tight text-ink-950">
          {consultant.name}
        </h3>
        <p className="mt-1 text-sm text-muted">{consultant.title}</p>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Rating value={consultant.rating} reviewCount={consultant.reviewCount} />
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted">{consultant.bio}</p>

      <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 text-sm">
        <div>
          <dt className="text-xs text-subtle">Experience</dt>
          <dd className="mt-0.5 font-medium text-body">{consultant.experience}</dd>
        </div>
        <div>
          <dt className="text-xs text-subtle">Sessions</dt>
          <dd className="mt-0.5 font-medium text-body">{consultant.sessions}+</dd>
        </div>
      </dl>

      <div className="mt-6 flex items-end justify-between gap-4 pt-1">
        <div>
          <span className="text-xl font-semibold tracking-tight text-ink-950">
            ${consultant.hourlyRate}
          </span>
          <span className="text-sm text-subtle"> /hr</span>
        </div>
        <Link
          to={`/consultants/${consultant.id}`}
          className="rounded-full border border-line-strong px-4 py-2 text-sm font-medium text-body transition-all duration-200 hover:border-ink-950 hover:bg-ink-950 hover:text-white"
        >
          View profile
        </Link>
      </div>
    </Card>
  )
}
