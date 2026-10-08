import { formatPrice } from '../../../lib/format'
import type { Service } from '../../../types'

interface ServiceStepProps {
  services: Service[];
  selectedId: string;
  selected: Service | undefined;
  onSelect: (id: string) => void;
}

export default function ServiceStep({ services, selectedId, selected, onSelect }: ServiceStepProps) {
  return (
    <div>
      <label htmlFor="booking-service" className="mb-2 block text-sm font-medium text-body">
        Service
      </label>
      <div className="relative">
        <select
          id="booking-service"
          value={selectedId}
          onChange={(event) => onSelect(event.target.value)}
          className="w-full cursor-pointer appearance-none rounded-xl border border-line-strong bg-surface px-4 py-2.5 pr-10 text-sm transition-all duration-200 hover:border-ink-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
        >
          {services.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.name} — {candidate.isFree ? 'Free' : formatPrice(candidate.price)} ·{' '}
              {candidate.duration} min
            </option>
          ))}
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
      {selected && (
        <p className="mt-2 text-xs leading-relaxed text-muted">{selected.description}</p>
      )}
    </div>
  );
}
